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

export default class UploadHelper {

	addIcons(entity) {
		const m = entity.moderation;
		if (m.is_approved && m.auto_approved) {
			entity.icon = 'thumb-up-auto';

		} else if (m.is_approved) {
			entity.icon = 'thumb-up';

		} else if (m.is_refused) {
			entity.icon = 'thumb-down';

		} else {
			entity.icon = 'thumbs-up-down';
		}
	}

	mapHistory(item) {
		const h = {
			message: item.message,
			created_at: new Date(item.created_at),
			created_by: item.created_by
		};
		switch (item.event) {
			case 'approved':
				h.status = 'Approved';
				h.icon = 'thumb-up';
				break;
			case 'refused':
				h.status = 'Refused';
				h.icon = 'thumb-down';
				break;
			case 'pending':
				h.status = 'Set to Pending';
				h.icon = 'thumbs-up-down';
				break;
		}
		return h;
	}
}