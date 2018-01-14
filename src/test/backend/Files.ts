/*
 * VPDB - Virtual Pinball Database
 * Copyright (C) 2018 freezy <freezy@vpdb.io>
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.
 */

import { readFileSync } from 'fs';
import { extname, resolve } from 'path';
import { isBuffer } from 'util';
import { ColorType, PNG } from 'pngjs';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Users } from './Users';
import { File } from '../models/File';
import { VpdbConfig } from '../models/VpdbConfig';
import Please = require('pleasejs/src/Please.js');
import toArray = require('stream-to-array');
import { User } from "../models/User";

export class Files {

	private storage: AxiosInstance;
	private users: Users;

	constructor(private vpdb: VpdbConfig) {
		this.storage = axios.create({
			baseURL: vpdb.storageUri.protocol + '://' + vpdb.storageUri.hostname + ':' + vpdb.storageUri.port + vpdb.storageUri.pathname
		});
		this.users = new Users(vpdb);
	}

	/**
	 * Generates a colored backglass image and uploads it to the server.
	 *
	 * @param {User} user Authenticated user
	 * @returns {Promise<File>} Uploaded file
	 */
	uploadBackglassImage(user:User): Promise<File> {
		return this.generateImage(640, 512).then(buffer => {
			return this.storage.post<File>('/v1/files', buffer, {
				headers: {
					'Content-Type': 'image/png',
					'Content-Disposition': 'attachment; filename="backglass.png"',
					[ this.vpdb.authHeader ]: 'Bearer ' + user.token,
				},
				params: { type: 'backglass' }
			});
		}).then((response: AxiosResponse) => response.data);
	}

	/**
	 * Generates a colored playfield image and uploads it to the server.
	 *
	 * @param {"fs" | "ws"} orientation
	 * @param {User} user Authenticated user
	 * @returns {Promise<File>} Uploaded file
	 */
	uploadPlayfieldImage(orientation:'fs'|'ws', user:User): Promise<File> {
		let [ width, height ] = orientation === 'fs' ? [ 1080, 1920 ] : [ 1920, 1080 ];
		return this.generateImage(width, height).then(buffer => {
			return this.storage.post<File>('/v1/files', buffer, {
				headers: {
					'Content-Type': 'image/png',
					'Content-Disposition': 'attachment; filename="playfield.png"',
					[ this.vpdb.authHeader ]: 'Bearer ' + user.token,
				},
				params: { type: 'playfield-' + orientation }
			});
		}).then((response: AxiosResponse) => response.data);
	}

	/**
	 * Uploads a table file from the test assets folder.
	 *
	 * @param {string} fileName File name without path
	 * @param {User} user Authenticated user
	 * @param {string} overrideFileName Filename without extension to override when uploading
	 * @returns {Promise<File>} Uploaded file
	 */
	uploadTableFile(fileName:string, user:User, overrideFileName:string = null): Promise<File> {
		const ext = extname(fileName);
		const mimeType = ext === '.vpx' ? 'application/x-visual-pinball-table-x' : 'application/x-visual-pinball-table';
		overrideFileName = overrideFileName ? overrideFileName + ext : fileName;
		return this.storage.post<File>('/v1/files', this.readAsset(fileName), {
			headers: {
				'Content-Type': mimeType,
				'Content-Disposition': 'attachment; filename="' + overrideFileName + '"',
				[ this.vpdb.authHeader ]: 'Bearer ' + user.token,
			},
			params: { type: 'release' }
		}).then((response: AxiosResponse) => response.data);
	}

	/**
	 * Reads a file from the asset folder into memory.
	 *
	 * @param {string} fileName File name without path
	 * @returns {Buffer} Read binary data
	 */
	private readAsset(fileName:string): Buffer {
		return readFileSync(resolve(__dirname, '../../../../src/test/assets', fileName));
	}

	/**
	 * Generates a PNG image with a random color for a given resolution.
	 *
	 * @param {number} width Width of the image to generate
	 * @param {number} height Height of the image to generate
	 * @param {ColorType} colorType Color type
	 * @returns {Promise<Buffer>} Generated binary data
	 */
	private generateImage(width:number, height:number, colorType:ColorType = 2): Promise<Buffer> {
		const color = Please.make_color({ format: 'rgb' })[0];
		const png = new PNG({
			width: width,
			height: height,
			colorType: colorType,
			bgColor: { red: color.r, green: color.g, blue: color.b }
		});
		return toArray(png.pack()).then(parts => {
			const buffers = parts.map(part => isBuffer(part) ? part : Buffer.from(part));
			return Buffer.concat(buffers);
		});
	}
}
