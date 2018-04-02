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

export default class UploadsBackglassModerateAdminModalCtrl {

	/**
	 * @param $uibModalInstance
	 * @param {App} App
	 * @param {ApiHelper} ApiHelper
	 * @param {AuthService} AuthService
	 * @param {UploadHelper} UploadHelper
	 * @param {DownloadService} DownloadService
	 * @param BackglassResource
	 * @param BackglassModerationResource
	 * @param params
	 * @ngInject
	 */
	constructor($uibModalInstance, App, ApiHelper, AuthService, UploadHelper, DownloadService,
				BackglassResource, BackglassModerationResource, params) {

		this.$uibModalInstance = $uibModalInstance;
		this.App = App;
		this.AuthService = AuthService;
		this.ApiHelper = ApiHelper;
		this.DownloadService = DownloadService;
		this.BackglassModerationResource = BackglassModerationResource;
		this.refresh = params.refresh;

		this.files = [];
		this.backglass = BackglassResource.get({ id: params.backglass.id, fields: 'moderation' }, backglass => {
			this.history = backglass.moderation.history.map(UploadHelper.mapHistory);
		});
	}

	downloadBackglass(file) {
		this.DownloadService.downloadFile(file);
	}

	refuse() {
		this.BackglassModerationResource.save({ id: this.backglass.id }, { action: 'refuse', message: this.message }, () => {
			this.$uibModalInstance.close();
			this.App.showNotification('Backglass successfully refused.');
			this.refresh();
		}, this.ApiHelper.handleErrors(this));
	}

	approve() {
		this.BackglassModerationResource.save({ id: this.backglass.id }, { action: 'approve', message: this.message }, () => {
			this.$uibModalInstance.close();
			this.App.showNotification('Backglass successfully approved.');
			this.refresh();
		}, this.ApiHelper.handleErrors(this));
	}

	moderate() {
		this.BackglassModerationResource.save({ id: this.backglass.id }, { action: 'moderate', message: this.message }, () => {
			this.$uibModalInstance.close();
			this.App.showNotification('Backglass successfully set back to pending.');
			this.refresh();
		}, this.ApiHelper.handleErrors(this));
	}
}