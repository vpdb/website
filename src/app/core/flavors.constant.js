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

export default {
	orientation: {
		header: 'Orientation',
		name: 'orientation',
		values: {
			ws: { name: 'Desktop', other: 'Landscape', value: 'ws', short: 'DT' },
			fs: { name: 'Cabinet', other: 'Portrait', value: 'fs', short: 'FS' },
			any: { name: 'Universal', other: 'Any Orientation', value: 'any', short: 'Universal' }
		}
	},
	lighting: {
		header: 'Lighting',
		name: 'lighting',
		values: {
			night: { name: 'Night', other: 'Dark Playfield', value: 'night' },
			day: { name: 'Day', other: 'Illuminated Playfield', value: 'day' },
			any: { name: 'Universal', other: 'Customizable', value: 'any' }
		}
	}
};