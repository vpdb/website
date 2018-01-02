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

import { cloneDeep, compact, isEmpty, pick } from 'lodash';

export default class GameEditAdminCtrl {

	/**
	 * @param $state
	 * @param $stateParams
	 * @param $scope
	 * @param {App} App
	 * @param {ApiHelper} ApiHelper
	 * @param {AuthService} AuthService
	 * @param {TrackerService} TrackerService
	 * @param GameSystems
	 * @param GameResource
	 * @ngInject
	 */
	constructor($state, $stateParams, $scope, App, ApiHelper, AuthService, TrackerService, GameSystems, GameResource) {

		App.theme('light');
		App.setTitle('Edit Game');
		App.setMenu('admin');
		TrackerService.trackPage();

		this.$scope = $scope;
		this.$state = $state;
		this.App = App;
		this.ApiHelper = ApiHelper;
		this.AuthService = AuthService;
		this.GameResource = GameResource;

		this.gameId = $stateParams.id;
		this.arrayFields = [ 'keywords', 'artists', 'designers', 'themes' ];
		this.updateableFields = ['title', 'year', 'manufacturer', 'game_type', 'short', 'description', 'instructions',
			'produced_units', 'model_number', 'themes', 'designers', 'artists', 'features', 'notes', 'toys', 'slogans',
			'_backglass', '_logo', 'keywords', 'ipdb' ];
		this.maxAspectRatioDifference = 0.2;
		this.gameTypes = [
			{ name: 'Solid State', value: 'ss' },
			{ name: 'Electro-mechanic', value: 'em' },
			{ name: 'Pure mechanical', value: 'pm'}
		];
		this.systems = GameSystems;
		this.arrays = {};

		GameResource.get({ id: this.gameId }, game => {
			this.originalGame = cloneDeep(game);
			this.reset(game);
		});
	}

	/**
	 * Backglass has been uploaded.
	 * Calculates AR and updates games object.
	 * @param status
	 */
	onBackglassUpload(status) {

		const bg = status.storage;

		this.AuthService.collectUrlProps(bg, true);
		this.game._backglass = bg.id;
		this.game.mediaFile.backglass = bg;

		const ar = Math.round(bg.metadata.size.width / bg.metadata.size.height * 1000) / 1000;
		const arDiff = Math.abs(ar / 1.25 - 1);

		this.backglass = {
			dimensions: bg.metadata.size.width + '×' + bg.metadata.size.height,
			test: ar === 1.25 ? 'optimal' : (arDiff < this.maxAspectRatioDifference ? 'warning' : 'error'),
			ar,
			arDiff: Math.round(arDiff * 100)
		};
	}

	/**
	 * Logo has been uploaded.
	 * Updates game object.
	 * @param status
	 */
	onLogoUpload(status) {
		const logo = status.storage;

		this.AuthService.collectUrlProps(logo, true);
		this.game._logo = logo.id;
		this.game.mediaFile.logo = logo;
	}

	/**
	 * Callback when media gets deleted before it gets re-uploaded.
	 * @param key
	 */
	onMediaClear(key) {
		this.game.mediaFile[key] = {
			url: false,
			variations: {
				'medium-2x': { url: false }
			}
		};
		this.$scope.$emit('imageUnloaded');
	}

	/**
	 * Posts the release add form to the server.
	 */
	submit() {

		const game = pick(cloneDeep(this.game), this.updateableFields);

		// restore arrays
		this.arrayFields.forEach(what => {
			game[what] = compact(this.arrays[what].split(/,\s*/));
			if (isEmpty(game[what])) {
				delete game[what];
			}
		});

		this.GameResource.update({ id: this.game.id }, game, () => {
			this.$state.go('gameDetails', { id: this.gameId });
			this.App.showNotification('Successfully updated game.');

		}, this.ApiHelper.handleErrors(this));
	}

	/**
	 * Resets all field to is original data
	 * @param game Original data
	 */
	reset(game) {
		this.game = cloneDeep(game);
		this.arrayFields.forEach(what => this.arrays[what] = game[what].join(', '));
		this.game.mediaFile = pick(game, [ 'backglass', 'logo' ]);
		this.errors = {};
	}

}