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
import { Build } from './Build';
import { Tag } from './Tag';
import { Game } from './Game';
import { User } from "./User";

export interface Release {
	id?: string,
	name?: string,
	name_sortable?: string,
	license?: 'by-sa' | 'by-nd',
	description?: string,
	acknowledgements?: string,
	released_at?: Date,
	modified_at?: Date,
	created_at?: Date,
	moderation?: {
		is_approved: boolean,
		is_refused: boolean,
		auto_approved: boolean
	},
	rating?: {
		score: number,
		votes: number,
		average: number
	},
	metrics?: {
		popularity: number
	},
	counter?: {
		views: number,
		stars: number,
		comments: number,
		downloads: number
	},
	links?: {
		label: string,
		url: string
	}[],
	authors?: {
		roles: string[],
		user?: {
			id: string
			name: string,
			username: string,
			counter: {
				stars: number,
				comments: number
			},
			gravatar_id: string,
		},
		_user: string
	}[],
	versions: {
		version: string,
		files?: {
			released_at?: Date,
			file?: File
			_file?: string,
			playfield_images?: File[];
			_playfield_image?: string[];
			playfield_videos?: File[],
			_playfield_videos?: string[],
			compatibility?: Build[],
			_compatibility?: string[],
			flavor: {
				orientation: 'ws' | 'fs' | 'any',
				lighting: 'day' | 'night' | 'any'
			},
			counter?: {
				downloads: number
			},
		}[]
		changes?: string,
		released_at?: Date,
		counter?: {
			comments: number,
			downloads: number
		},
	}[],
	tags?: Tag[],
	game?: Game,
	_game?: string,
	created_by?: User
}
