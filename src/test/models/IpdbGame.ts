/*
 * VPDB - Virtual Pinball Database
 * Copyright (C) 2019 freezy <freezy@vpdb.io>
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

export interface IpdbGame {
	ipdb: {
		number: number,
		mfg?: number,
		rating?: string,
		mpu?: number
	},
	title: string,
	year: number
	manufacturer?: string,
	model_number?: string,
	game_type?: "ss" | "em" | "pm" | "na",
	short?: string[],
	produced_units?: number,
	themes?: string[],
	designers?: string[],
	artists?: string[],
	features?: string,
	notes?: string,
	toys?: string,
	slogans?: string
}