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

import { File } from './File';
import { IpdbGame } from './IpdbGame';

export interface Game extends IpdbGame {
	id: string,
	year: number,
	game_type: "ss" | "em" | "pm" | "na",
	manufacturer: string,
	created_at?: Date,
	rating?: {
		score: number,
		votes: number,
		average: number
	},
	metrics?: {
		popularity: number
	},
	counter?: {
		stars: number,
		comments: number,
		downloads: number,
		views: number,
		releases: number
	},
	pinside?: {
		ranks: number[],
		ids: number[]
	},
	_backglass?: string,
	backglass?: File,
	_logo?: string,
	logo?: File
}