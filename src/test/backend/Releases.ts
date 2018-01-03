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

import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { merge } from 'lodash';
import { company } from 'faker';
import { Files } from './Files';
import { Games } from './Games';
import { Users } from './Users';
import { File } from '../models/File';
import { Game } from '../models/Game';
import { Release } from '../models/Release';
import { User } from '../models/User';
import { VpdbConfig } from '../models/VpdbConfig';

export class Releases {

	private api: AxiosInstance;
	private games: Games;
	private files: Files;
	private users: Users;

	constructor(private vpdb: VpdbConfig) {
		this.api = axios.create({
			baseURL: vpdb.apiUri.protocol + '://' + vpdb.apiUri.hostname + ':' + vpdb.apiUri.port + vpdb.apiUri.pathname
		});
		this.games = new Games(vpdb);
		this.files = new Files(vpdb);
		this.users = new Users(vpdb);
	}

	/**
	 * Creates a new release on the server.
	 *
	 * @param {string} creator Username of the user creating the release
	 * @param {Release} release Release data to override default values with
	 * @param {Game} g Game of the release. If null or not provided, a new game will be created.
	 * @return {Promise<Release>} Created release
	 */
	createRelease(creator:string, release:Release = null, g:Game = null): Promise<Release> {
		let user:User;
		let game:Game;
		let tableFile:File;
		let playfieldImage:File;

		return this.users.authenticateOrCreateUser(creator).then((u: User) => {
			user = u;
			if (g) {
				return g;
			} else {
				return this.games.createGame();
			}
		}).then((g:Game) => {
			game = g;
			return this.files.uploadTableFile('blank.vpt', user);

		}).then((file:File) => {
			tableFile = file;
			return this.files.uploadPlayfieldImage('fs', user);

		}).then((file:File) => {
			playfieldImage = file;

			const defaultRelease:Release = {
				name: company.catchPhraseAdjective() + 'Edition',
				license: 'by-sa',
				_game: game.id,
				versions: [
					{
						files: [ {
							_file: tableFile.id,
							_playfield_image: playfieldImage.id,
							_compatibility: [ '9.9.0' ],
							flavor: { orientation: 'fs', lighting: 'night' }
						} ],
						version: '1.0.0'
					}
				],
				authors: [ { _user: user.id, roles: [ 'Table Creator' ] } ]
			};


			return this.api.post<File>('/v1/releases', release ? merge(defaultRelease, release) : defaultRelease, {
				headers: { [ this.vpdb.authHeader ]: 'Bearer ' + user.token }
			});

		}).then((response: AxiosResponse) => response.data);
	}
}