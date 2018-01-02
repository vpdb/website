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

export default class UserInfoModalCtrl {

	/**
	 * @param {ModalService} ModalService
	 * @param UserResource
	 * @param UserStarResource
	 * @param username
	 * @ngInject
	 */
	constructor(ModalService, UserResource, UserStarResource, username) {

		this.UserStarResource = UserStarResource;
		this.ModalService = ModalService;

		this.username = username.replace(/\.$/g, '');
		this.user = null;

		UserResource.query({ name: this.username }, users => {
			this.user = users.length ? users[0] : {};
			if (this.user.id) {
				UserStarResource.get({ userId: this.user.id }).$promise.then(() => {
					this.starred = true;
				}, () => {
					this.starred = false;
				});
			}
		});
	}

	toggleStar() {
		const err = err => {
			if (err.data && err.data.error) {
				this.ModalService.error({
					subtitle: 'Error starring user.',
					message: err.data.error
				});
			} else {
				console.error(err);
			}
		};
		if (this.starred) {
			this.UserStarResource.delete({ userId: this.user.id }, {}, () => {
				this.starred = false;
				this.user.counter.stars--;
			}, err);

		} else {
			this.UserStarResource.save({ userId: this.user.id }, {}, result => {
				this.starred = true;
				this.user.counter.stars = result.total_stars;
			}, err);
		}
	}
}