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

/**
 * Formats a rating number: 0.0, 0.1, 1.0, 2.0, 9.9, 10
 * @ngInject
 */
export default function ratingFormatFilter() {
	return function(rating) {
		rating = parseFloat(rating);
		if (!rating) {
			return ' — ';
		}
		if (rating % 1 === 0 && rating < 10) {
			return rating + '.0';
		} else {
			return Math.round(rating * 10) / 10;
		}
	};
}
