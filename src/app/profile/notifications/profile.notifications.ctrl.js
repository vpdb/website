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

export default class ProfileNotificationsCtrl {

	/**
	 * @param {App} App
	 * @param {AuthService} AuthService
	 * @param {ApiHelper} ApiHelper
	 * @param ProfileResource
	 * @ngInject
	 */
	constructor(App, AuthService, ApiHelper, ProfileResource) {

		this.App = App;
		this.AuthService = AuthService;
		this.ApiHelper = ApiHelper;
		this.ProfileResource = ProfileResource;

		this.init();
	}

	init() {
		this.updatedPreferences = this.AuthService.getUser().preferences || {};
	}

	updateUserPreferences() {
		this.ProfileResource.patch({ preferences: this.updatedPreferences }, user => {

			this.App.showNotification('Notification Preferences successfully saved');
			this.AuthService.saveUser(user);
			this.ApiHelper.clearErrors(this);
			this.init();

		}, this.ApiHelper.handleErrors(this));
	}
}