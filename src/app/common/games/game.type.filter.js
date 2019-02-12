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

/**
 * Converts the game type enum into a display string.
 *
 * @ngInject
 */
export default function gameTypeFilter() {
	return function(type) {
		if (type) {
			switch (type.toLowerCase()) {
				case 'ss':
					return 'Solid-State Game';
				case 'em':
					return 'Electro-Mechanical Game';
				case 'pm':
					return 'Pure Mechanical';
				case 'og':
					return 'Original Game';
				default:
					return type;
			}
		} else {
			return 'Undefined';
		}
	};
}
