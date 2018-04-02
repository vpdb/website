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
import { omit } from 'lodash';

export default class GameAddAdminCtrl {

	/**
	 * @param $scope
	 * @param $window
	 * @param $localStorage
	 * @param $state
	 * @param {App} App
	 * @param {ApiHelper} ApiHelper
	 * @param {AuthService} AuthService
	 * @param {ModalService} ModalService
	 * @param {TrackerService} TrackerService
	 * @param IpdbResource
	 * @param GameResource
	 * @param FileResource
	 * @param GameRequestResource
	 * @ngInject
	 */
	constructor($scope, $window, $localStorage, $state,
				App, ApiHelper, AuthService, ModalService, TrackerService,
				IpdbResource, GameResource, FileResource, GameRequestResource) {

		App.theme('light');
		App.setTitle('Add Game');
		App.setMenu('games');
		TrackerService.trackPage();

		this.$scope = $scope;
		this.$state = $state;
		this.$window = $window;
		this.$localStorage = $localStorage;
		this.App = App;
		this.ApiHelper = ApiHelper;
		this.AuthService = AuthService;
		this.GameRequestResource = GameRequestResource;
		this.FileResource = FileResource;
		this.IpdbResource = IpdbResource;
		this.ModalService = ModalService;
		this.GameResource = GameResource;

		this.maxAspectRatioDifference = 0.2;
		this.dropText = {
			backglass: 'Click or drag and drop backglass image here',
			logo: 'Click or drag and drop logo here'
		};
		this.submitting = false;

		this.resetMedia();

		if (this.AuthService.hasPermission('game_requests/list')) {
			this.gameRequests = GameRequestResource.query();
		}
	}

	$onInit() {
		if (this.$localStorage.newGame) {
			this.game  = this.$localStorage.newGame;
			this.AuthService.collectUrlProps(this.game, true);

		} else {
			this.resetGame();
		}
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

	resetGame() {
		// delete media if already uploaded
		if (this.game && !this.game.submitted) {
			if (this.game.mediaFile.backglass.id) {
				this.FileResource.delete({ id: this.game.mediaFile.backglass.id});
			}
			if (this.game.mediaFile.logo.id) {
				this.FileResource.delete({ id: this.game.mediaFile.logo.id});
			}
		}

		this.game = this.$localStorage.newGame = {
			origin: 'recreation',
			ipdbUrl: '',
			links: [{ label: '', url: '' }],
			mediaFile: {
				backglass: {
					url: false,
					variations: {
						'medium-2x': { url: false }
					}
				},
				logo: {
					url: false
				}
			},
			data: {
				fetched: false,
				year: true,
				idValidated: false
			},
			_game_request: null
		};
	}

	fetchIpdb(ipdbId, done) {
		this.App.setLoading(true);
		const game = this.IpdbResource.get({ id: ipdbId }, () => {
			this.App.setLoading(false);

			this.game = Object.assign(this.game, game);
			if (this.game.short) {
				this.game.id = this.game.short[0].replace(/[^a-z0-9\s-]+/gi, '').replace(/\s+/g, '-').toLowerCase();
			} else {
				this.game.id = this.game.title.replace(/[^a-z0-9\s-]+/gi, '').replace(/\s+/g, '-').toLowerCase();
			}
			this.errors = {};
			this.error = null;
			this.game.data.fetched = true;
			this.game.data.year = !!game.year;

			if (done) {
				done(null, this.game);
			}
		}, this.ApiHelper.handleErrorsInDialog('Error fetching data.'));
	}

	readIpdbId() {
		if (/id=\d+/i.test(this.game.ipdbUrl)) {
			const m = this.game.ipdbUrl.match(/id=(\d+)/i);
			return m[1];

		} else if (parseInt(this.game.ipdbUrl)) {
			return this.game.ipdbUrl;
		} else {
			return false;
		}
	}

	refresh(done) {
		const ipdbId = this.readIpdbId();
		if (ipdbId) {
			this.fetchIpdb(ipdbId, done);
		} else {
			this.ModalService.error({
				title: 'IPDB Fetch',
				subtitle: 'Sorry!',
				message: 'You need to put either the IPDB number or the URL with an ID.'
			});
		}
	}

	check() {
		if (!this.game.id) {
			this.game.data.idValid = false;
			this.game.data.idValidated = true;
			return;
		}

		this.GameResource.head({ id: this.game.id }, () => {
			this.game.data.idValid = false;
			this.game.data.idValidated = true;
		}, () => {
			this.game.data.idValid = true;
			this.game.data.idValidated = true;
		});
	}

	submit() {
		// if not yet refreshed, do that first.
		const ipdbId = this.readIpdbId();
		if (this.game.origin === 'recreation' && ipdbId && (!this.game.ipdb || !this.game.ipdb.number)) {
			this.fetchIpdb(ipdbId, this.postData.bind(this));
		} else {
			this.postData();
		}
	}

	postData() {
		this.submitting = true;
		this.game.game_type =
			this.game.origin === 'originalGame' ? 'og' : (
				this.game.game_type ? this.game.game_type.toLowerCase() : 'na'
			);

		this.GameResource.save(omit(this.game, ['data', 'mediaFile']), game => {
			const id = this.game.id;
			this.submitting = false;
			this.game.submitted = true;
			this.reset();
			this.ModalService.info({
				icon: 'check-circle',
				title: 'Game Created!',
				subtitle: game.title,
				message: 'The game has been successfully created.'
			});

			// go to game page
			this.$state.go('gameDetails', { id });

		}, this.ApiHelper.handleErrors(this, () => this.submitting = false));
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

	searchOnIpdb() {
		this.$window.open(angular.element('#ipdbLink').attr('href'));
	}

	selectGameRequest(gameRequest) {
		// don't fetch if already selected
		if (this.game._game_request === gameRequest.id) {
			return;
		}
		this.game.origin = 'recreation';
		this.game.ipdbUrl = gameRequest.ipdb_number;
		this.game._game_request = gameRequest.id;
		this.refresh();
	}

	closeGameRequest(gameRequest, denyMessage) {
		this.GameRequestResource.update({ id: gameRequest.id }, { is_closed: true, message: denyMessage }, () => {
			this.ModalService.info({
				icon: 'check-circle',
				title: 'Game Request Closed',
				subtitle: gameRequest.ipdb_title,
				message: 'The game request has been successfully closed.'
			});
			this.gameRequests = this.GameRequestResource.query();
			this.reset();
		});
	}
}
