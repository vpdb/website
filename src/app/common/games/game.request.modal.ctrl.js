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

export default class GameRequestModalCtrl {

	/**
	 * @param $uibModalInstance
	 * @param {ApiHelper} ApiHelper
	 * @param {ModalService} ModalService
	 * @param GameRequestResource
	 * @ngInject
	 */
	constructor($uibModalInstance, ApiHelper, ModalService, GameRequestResource) {

		this.$uibModalInstance = $uibModalInstance;
		this.ApiHelper = ApiHelper;
		this.GameRequestResource = GameRequestResource;
		this.ModalService = ModalService;

		this.gameRequest = {};
		this.submitting = false;
	}

	submit() {
		this.submitting = true;
		this.GameRequestResource.save(this.gameRequest, gameRequest => {
			this.submitting = false;
			this.$uibModalInstance.dismiss();

			// show success msg
			this.ModalService.info({
				icon: 'check-circle',
				title: 'Game Requested!',
				subtitle: gameRequest.ipdb_title,
				message: 'The game has been successfully requested. We\'ll keep you posted!'
			});

		}, this.ApiHelper.handleErrors(this, () => this.submitting = false));
	}
}