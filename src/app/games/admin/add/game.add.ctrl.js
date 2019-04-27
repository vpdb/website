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

export default class GameAddCtrl {

	constructor($scope, $window, $localStorage, $state,
				App, ApiHelper, AuthService, ModalService, TrackerService,
				GameResource, FileResource) {

		App.theme('light');
		App.setMenu('games');
		TrackerService.trackPage();

		this.$scope = $scope;
		this.$state = $state;
		this.$window = $window;
		this.$localStorage = $localStorage;
		this.App = App;
		this.ApiHelper = ApiHelper;
		this.AuthService = AuthService;
		this.FileResource = FileResource;
		this.ModalService = ModalService;
		this.GameResource = GameResource;

		this.maxAspectRatioDifference = 0.2;
		this.dropText = {
			backglass: 'Click or drag and drop backglass image here',
			logo: 'Click or drag and drop logo here'
		};
		this.submitting = false;

		this.resetMedia();
	}

	$onInit() {
		if (this.$localStorage.newGame) {
			this.game  = this.$localStorage.newGame;
			this.AuthService.collectUrlProps(this.game, true);

		} else {
			this.resetGame();
		}
	}

	onBackglassUpload(status) {
		const bg = status.storage;
		console.info('GameAddAdminCtrl: Backglass uploaded, collecting URL props.', status);
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

	reset() {
		this.resetGame();
		this.resetMedia();
	}

	resetMedia() {
		this.mediaFile = {
			backglass: {
				uploadText: this.dropText.backglass
			},
			logo: {
				uploadText: this.dropText.logo
			}
		};
		delete this.backglass;
	}

}
