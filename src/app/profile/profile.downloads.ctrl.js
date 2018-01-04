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

export default class ProfileDownloadsCtrl {

	/**
	 * @param $scope
	 * @param {App} App
	 * @param {AuthService} AuthService
	 * @param {ApiHelper} ApiHelper
	 * @param ProfileResource
	 * @ngInject
	 */
	constructor($scope, App, AuthService, ApiHelper, ProfileResource) {

		this.App = App;
		this.AuthService = AuthService;
		this.ApiHelper = ApiHelper;
		this.ProfileResource = ProfileResource;

		this.init();

		this.releaseData = {
			game_title: 'Twilight Zone',
			game_manufacturer: 'Williams',
			game_year: 1993,
			release_name: 'Powerflip Edition',
			release_version: '1.2.0',
			release_compatibility: 'VP10-alpha',
			original_filename: 'Twilight-Zone_Night Mod_VP9.2_V1.2_FS_APC FOM-UUP2_WMS'
		};

		$scope.$watch(() => this.updatedPreferences.tablefile_name, this.updateExample.bind(this));
		$scope.$watch(() => this.updatedPreferences.flavor_tags.orientation.fs, this.updateExample.bind(this), true);
		$scope.$watch(() => this.updatedPreferences.flavor_tags.lighting.day, this.updateExample.bind(this), true);
	}

	init() {
		this.updatedPreferences = this.AuthService.getUser().preferences || {};
		this.updatedPreferences.tablefile_name = this.updatedPreferences.tablefile_name || '{game_title} ({game_manufacturer} {game_year})';
		this.updatedPreferences.flavor_tags = this.updatedPreferences.flavor_tags || {
			orientation: { fs: 'FS', ws: 'DT', any: '' },
			lighting: { day: '', night: 'Nightmod', any: '' }
		};
	}

	updateExample() {
		this.exampleName = this.updatedPreferences.tablefile_name.replace(/(\{([^}]+)\})/g, (m1, m2, m3) => {
			return this.releaseData[m3] ? this.releaseData[m3] : m1;
		}) + '.vpx';
		this.exampleName = this.exampleName.replace('{release_flavor_orientation}', this.updatedPreferences.flavor_tags.orientation.fs);
		this.exampleName = this.exampleName.replace('{release_flavor_lighting}', this.updatedPreferences.flavor_tags.lighting.day);
	}

	updateUserPreferences() {
		this.ProfileResource.patch({ preferences: this.updatedPreferences }, user => {

			this.App.showNotification('User Preferences successfully saved');
			this.AuthService.saveUser(user);
			this.ApiHelper.clearErrors(this);
			this.init();

		}, this.ApiHelper.handleErrors(this));
	}
}
