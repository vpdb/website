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

import GameAddBaseCtrl from './game.add.base.ctrl';

export default class GameAddAdminCtrl extends GameAddBaseCtrl {

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

		super($scope, $window, $localStorage, $state, App, ApiHelper, AuthService, ModalService, TrackerService, GameResource, FileResource);

		App.setTitle('Add Game');

		this.GameRequestResource = GameRequestResource;
		this.IpdbResource = IpdbResource;

		if (this.AuthService.hasPermission('game_requests/list')) {
			this.gameRequests = GameRequestResource.query();
		}
	}

	$onInit() {
		if (this.$localStorage.newGame) {
			this.game  = this.$localStorage.newGame;
			this.AuthService.collectUrlProps(this.game, true);

		} else {
			this.resetGame('recreation');
		}
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

	submit() {
		// if not yet refreshed, do that first.
		const ipdbId = this.readIpdbId();
		if (this.game.origin === 'recreation' && ipdbId && (!this.game.ipdb || !this.game.ipdb.number)) {
			this.fetchIpdb(ipdbId, this.postData.bind(this));
		} else {
			this.postData();
		}
	}

	searchOnIpdb() {
		this.$window.open(document.getElementById('ipdbLink').getAttribute('href'), '_blank');
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
