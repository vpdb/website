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

import { map } from 'lodash';

export default class BackglassEditModalCtrl {
	/**
	 * @param $uibModalInstance
	 * @param {App} App
	 * @param {ApiHelper} ApiHelper
	 * @param {AuthService} AuthService
	 * @param {ModalService} ModalService
	 * @param GameResource
	 * @param BackglassResource
	 * @param params
	 * @ngInject
	 */
	constructor($uibModalInstance, App, ApiHelper, AuthService, ModalService,
				GameResource, BackglassResource, params) {

		this.$uibModalInstance = $uibModalInstance;

		this.App = App;
		this.AuthService = AuthService;
		this.ApiHelper = ApiHelper;
		this.GameResource = GameResource;
		this.BackglassResource = BackglassResource;
		this.ModalService = ModalService;

		this.params = params;
		this.backglass = params.backglass;
		this.game = params.game;
		this.status = { loading: false, offline: false };

		this.reset();
	}

	findGame(val) {
		return this.ApiHelper.request(() => this.GameResource.query({ q: val }), this.status);
	}

	gameSelected(item, model) {
		this.updatedBackglass._game = model.id;
	}

	reset() {
		this.updatedBackglass = map(this.backglass, [ 'description', 'acknowledgements']);
		this.updatedBackglass._game = this.game.id;
		this.query = this.game.title;
	}

	remove(backglass) {
		return this.ModalService.question({
			title: 'Delete Backglass',
			message: 'This is definitive. Backglass will be gone after that.',
			question: 'Are you sure?'
		}).result.then(() => {
			this.BackglassResource.delete({ id: backglass.id }, () => {
				this.$uibModalInstance.close(null);
			}, this.ApiHelper.handleErrorsInDialog('Error removing backglass.'));
		});
	}

	submit() {
		this.BackglassResource.update({ id: this.backglass.id }, this.updatedBackglass, () => {
			this.backglass.description = this.updatedBackglass.description;
			this.backglass.acknowledgements = this.updatedBackglass.acknowledgements;
			this.App.showNotification('Successfully updated backlass.');
			this.$uibModalInstance.close(this.game.id === this.updatedBackglass._game ? this.backglass : null);

		}, this.ApiHelper.handleErrors(this));
	}
}
