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

import angular from 'angular';
import GameRequestModalTpl from './game.request.modal.pug';

export default class GameSelectModalCtrl {

	/**
	 * @param $uibModal
	 * @param $uibModalInstance
	 * @param {App} App
	 * @param {ApiHelper} ApiHelper
	 * @param GameResource
	 * @param {{ title:string, text:string }} params
	 * @ngInject
	 */
	constructor($uibModal, $uibModalInstance, App, ApiHelper, GameResource, params) {

		this.$uibModal = $uibModal;
		this.$uibModalInstance = $uibModalInstance;
		this.App = App;
		this.ApiHelper = ApiHelper;
		this.GameResource = GameResource;
		this.params = params;
		this.status = { loading: false, offline: false };
	}

	findGame(val) {
		return this.ApiHelper.request(() => this.GameResource.query({ q: val }), this.status);
	}

	gameSelected(item, model) {
		this.$uibModalInstance.close(model);
	}

	requestGame() {
		this.$uibModalInstance.dismiss();
		this.$uibModal.open({
			templateUrl: GameRequestModalTpl,
			controller: 'GameRequestModalCtrl',
			controllerAs: 'vm',
		}).result.catch(angular.noop);
	}
}
