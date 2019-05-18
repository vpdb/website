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

export default class ResetPasswordModalCtrl {

	/**
	 * @param $state
	 * @param $stateParams
	 * @param $uibModalInstance
	 * @param {ApiHelper} ApiHelper
	 * @param {ModalService} ModalService
	 * @param ProfileResource
	 * @ngInject
	 */
	constructor($state, $stateParams, $uibModalInstance, ApiHelper, ModalService, ProfileResource) {
		this.$state = $state;
		this.$uibModalInstance = $uibModalInstance;
		this.ApiHelper = ApiHelper;
		this.ModalService = ModalService;
		this.ProfileResource = ProfileResource;
		this.token = $stateParams.token;
		this.password = '';
	}

	update() {
		this.ProfileResource.resetPassword({ password: this.password, token: this.token }, result => {
			this.errors = {};
			this.error = null;
			this.userPass = {};
			this.email = '';
			this.ModalService.info({
				title: 'Password Reset',
				subtitle: 'Success!',
				message: result.message
			});
			this.$uibModalInstance.dismiss();
			this.$state.go('home');

		}, this.ApiHelper.handleErrors(this, { hideGlobalValidationError: true }));
	}
}
