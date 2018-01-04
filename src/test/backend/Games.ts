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

import { resolve } from 'path';
import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { assign } from 'lodash';
import { Files } from './Files';
import { Users } from './Users';
import { File } from '../models/File';
import { Game } from '../models/Game';
import { User } from '../models/User';
import { IpdbGame } from '../models/IpdbGame';
import { VpdbConfig } from '../models/VpdbConfig';

/**
 * Provides easy access to the server's game API.
 * @author freezy <freezy@vpdb.io>
 */
export class Games {

	static IPDB: IpdbGame[] = require(resolve(__dirname, '../../../../src/test/ipdb.json')); // path relative to compiled file

	private api: AxiosInstance;
	private files: Files;
	private users: Users;

	constructor(private vpdb: VpdbConfig) {
		this.api = axios.create({
			baseURL: vpdb.apiUri.protocol + '://' + vpdb.apiUri.hostname + ':' + vpdb.apiUri.port + vpdb.apiUri.pathname
		});
		this.files = new Files(vpdb);
		this.users = new Users(vpdb);
	}

	/**
	 * Creates a new game on the server.
	 *
	 * Data is used from the local IPDB index, so no additional fetch. The created
	 * game is then removed from the index so we don't get duplicates.
	 * @returns {Promise<Game>}
	 */
	createGame(): Promise<Game> {
		let token:string;
		return this.users.getAuthenticatedUser('contributor').then((user: User) => {
			token = user.token;
			return this.files.uploadBackglassImage(user);

		}).then((backglass:File) => {
			return this.api.post<File>('/v1/games', assign(Games.getGame(), { _backglass: backglass.id }), {
				headers: { [ this.vpdb.authHeader ]: 'Bearer ' + token }
			});

		}).then((response: AxiosResponse) => response.data);
	}

	/**
	 * Returns random game data.
	 *
	 * Data is used from the IPDB index and running this multiple times through
	 * a test guarantees no duplicates.
	 * @returns {Game} Random game data
	 */
	public static getGame():Game {
		const game = Games.popGame() as Game;
		if (game.short) {
			game.id = game.short[0].replace(/[^a-z0-9\s\-]+/gi, '').replace(/\s+/g, '-').toLowerCase();
		} else {
			game.id = /unknown/i.test(game.title) ? Games.randomChars(7) : game.title.replace(/[^a-z0-9\s\-]+/gi, '').replace(/\s+/g, '-').toLowerCase();
		}
		game.year = game.year || 1900;
		game.game_type = game.game_type || 'na';
		game.manufacturer = game.manufacturer || 'unknown';
		return game;
	}

	/**
	 * Returns a pre-fetched game from the IPDB index and removes it for further usage.
	 * @returns {IpdbGame} A random game
	 */
	private static popGame():IpdbGame {
		return Games.IPDB.splice(Games.randomInt(Games.IPDB.length), 1)[0]
	}

	/**
	 * Returns a random number between 0 and the given maximal number.
	 * @param {number} max Maximal number to return
	 * @returns {number} Random number
	 */
	private static randomInt(max:number):number {
		return Math.floor(Math.random() * max - 1) + 1;
	}

	/**
	 * Returns a randomly generated string with given length.
	 * @param {number} length Length of the string to return
	 * @returns {string} Random string
	 */
	private static randomChars(length:number):string {
		const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
		let rnd = '';
		for (let i = 0; i < length; i++) {
			rnd += chars[Games.randomInt(chars.length)];
		}
		return rnd;
	}
}