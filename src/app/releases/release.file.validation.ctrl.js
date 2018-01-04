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

import { cloneDeep } from 'lodash';

export default class ReleaseFileValidationCtrl {

	/**
	 * @param $uibModalInstance
	 * @param {App} App
	 * @param {ApiHelper} ApiHelper
	 * @param {AuthService} AuthService
	 * @param ReleaseFileValidationResource
	 * @param params
	 * @ngInject
	 */
	constructor($uibModalInstance, App, ApiHelper, AuthService, ReleaseFileValidationResource, params) {

		this.$uibModalInstance = $uibModalInstance;
		this.App = App;
		this.ApiHelper = ApiHelper;
		this.AuthService = AuthService;
		this.ReleaseFileValidationResource = ReleaseFileValidationResource;
		this.params = params;

		if (!params.file.validation) {
			this.message = 'This file has not been validated yet. Nothing more to see. ';

		} else {
			this.message = 'This file has been validated by ' + params.file.validation.validated_by.name + '. ';
			switch (params.file.validation.status) {
				case 'verified':
					break;
				case 'playable':
					this.message += 'There seems to be a minor problem but the file is still playable.';
					break;
				case 'broken':
					this.message += 'There seems to be a problems but the file is still playable.';
					break;
			}
			this.message += 'More details below:';
		}

		this.validation = cloneDeep(params.file.validation || {});
		this.file = params.file;
		this.statuses = [
			{ name: 'verified', description: 'The file has been verified and everything is okay.'},
			{ name: 'playable', description: 'Problems so minor that the release is still playable.'},
			{ name: 'broken', description: 'Major problems resulting in an unplayable file.'}
		];

		if (!this.validation.message) {
			this.validation.message = 'Checked and made sure that:\n\n- DOF config up is to date\n- `controller.vbs` is up to date\n- SoundFX calls are working';
		}
	}

	submit() {
		this.ReleaseFileValidationResource.save({
			releaseId: this.params.release.id,
			version: this.params.version,
			fileId: this.params.file.file.id
		}, this.validation, validation => {

			this.App.showNotification('Successfully saved new validation status.');
			this.$uibModalInstance.close(validation);

		}, this.ApiHelper.handleErrors(this));
	}
}