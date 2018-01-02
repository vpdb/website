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

import { isBuffer } from 'util';
import { PNG } from 'pngjs';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import Please = require('pleasejs/src/Please.js');
import toArray = require('stream-to-array');
import { Users } from './Users';
import { User } from '../models/User';
import { File } from '../models/File';
import { VpdbConfig } from '../models/VpdbConfig';

export class Files {

	private storage: AxiosInstance;
	private users: Users;

	constructor(private vpdb: VpdbConfig) {
		this.storage = axios.create({
			baseURL: vpdb.storageUri.protocol + '://' + vpdb.storageUri.hostname + ':' + vpdb.storageUri.port + vpdb.storageUri.pathname
		});
		this.users = new Users(vpdb);
	}

	uploadBackglass(): Promise<File> {
		const color = Please.make_color({ format: 'rgb' })[0];
		const png = new PNG({
			width: 640,
			height: 512,
			colorType: 2,
			bgColor: { red: color.r, green: color.g, blue: color.b }
		});

		let token: string;
		return this.users.getAuthenticatedUser('contributor').then((user: User) => {
			token = user.token;
			return toArray(png.pack());

		}).then(parts => {
			const buffers = parts.map(part => isBuffer(part) ? part : Buffer.from(part));
			const buffer = Buffer.concat(buffers);
			return this.storage.post<File>('/v1/files', buffer, {
				headers: {
					'Content-Type': 'image/png',
					'Content-Disposition': 'attachment; filename="backglass.png"',
					[ this.vpdb.authHeader ]: 'Bearer ' + token,
				},
				params: { type: 'backglass' }
			});
		}).then((response: AxiosResponse) => response.data);
	}
}