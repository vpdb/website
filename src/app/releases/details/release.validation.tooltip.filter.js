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
 * @ngInject
 */
export default function validationTooltip() {
	return function(validation) {
		if (!validation) {
			// eslint-disable-next-line
			return "This file hasn't been validated yet.";
		}
		switch (validation.status) {
			case 'verified': return 'This file has been validated by a moderator.';
			case 'playable': return 'There are minor problems but the file is still playable.';
			case 'broken': return 'This file has been reported to be broken.';
		}
	};
}
