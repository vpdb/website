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

import { extend, isEqual, map } from 'lodash';

/**
 * Home page controller.
 *
 * @author freezy <freezy@vpdb.io>
 */
export default class HomeCtrl {

	/**
	 * @param $scope
	 * @param {App} App
	 * @param {ApiHelper} ApiHelper
	 * @param {AuthService} AuthService
	 * @param {LoginService} LoginService
	 * @param {ReleaseService} ReleaseService
	 * @param GameResource
	 * @param ReleaseResource
	 * @param {TrackerService} TrackerService
	 * @ngInject
	 */
	constructor($scope, App, AuthService, ApiHelper, LoginService, ReleaseService, GameResource, ReleaseResource, TrackerService) {

		App.theme('dark');
		App.setTitle('VPDB - The Virtual Pinball Database');
		App.setMenu('home');
		App.setMeta({
			description: 'VPDB is a platform around virtual pinball. It seeks to preserve the great pinball games from the last and current century in digital form, created by a wonderful community.',
			keywords: 'virtual pinball, database, pinball, vpinball, visual pinball, directb2s, backglass, beautiful, fast, open source'
		});
		TrackerService.trackPage();

		// services
		this.App = App;
		this.ApiHelper = ApiHelper;
		this.AuthService = AuthService;
		this.ReleaseService = ReleaseService;
		this.GameResource = GameResource;
		this.ReleaseResource = ReleaseResource;

		// internal params
		this.q = '';
		this.searching = false;

		this.searchResult = false;
		this.whatsThis = false;
		this.pagination = {};

		// statuses
		this.status = {
			releases: { loading: false, offline: false },
			games: { loading: false, offline: false },
			gameResult: { loading: false, offline: false }
		};

		// watch query
		$scope.$watch(() => this.q, (newVal) => this.refresh({ q: newVal }));

		// login?
		if (LoginService.loginParams.open) {
			LoginService.loginParams.open = false;
			App.login();
		}

		// load data
		this.loadReleases();
		this.loadGames();
	}

	/**
	 * Fetches latest releases from the API.
	 */
	loadReleases() {
		this.status.releases = { loading: true, offline: false, error: null };
		this.ReleaseResource.query({ thumb_format: this.App.pixelSuffix('square'), per_page: 6, sort: 'released_at' }).$promise.then(releases => {
			this.status.releases = { loading: false, offline: false, error: null };
			this.releases = releases;
		}).catch(err => {
			if (err.status === -1) {
				this.status.releases = { loading: false, offline: true, error: null };
			} else {
				this.status.releases = { loading: false, offline: false, error: err };
			}
		});
	}

	/**
	 * Fetches most popular games from the API.
	 */
	loadGames() {
		this.ApiHelper.request(() => this.GameResource.query({ per_page: 8, sort: 'popularity' }), this.status.games)
			.then(games => this.games = games)
			.catch(() => this.games = []);
	}

	/**
	 * Refreshes the search result.
	 *
	 * @param {{ q?:string, page?:number }} queryOverride
	 */
	refresh(queryOverride) {

		if (!this.q) {
			this.searchResult = false;
		}

		// only fetch if a query
		if (!this.q || this.q.length < 3) {
			return;
		}

		let query = {};
		queryOverride = queryOverride || {};

		// search query
		if (this.q) {
			query.q = this.q;
		}

		query = extend(query, queryOverride);

		// refresh if changes
		if (!isEqual(this.lastReqParams, query)) {

			this.ApiHelper.paginatedRequest(() => this.GameResource.query(query), this.status.gameResult, this.pagination)
				.then(games => {
					// only update results if result is different to avoid flicker.
					if (!isEqual(map(this.games, 'id'), map(games, 'id'))) {
						this.gameResult = games;
					}
				})
				.catch(() => this.gameResult = [])
				.finally(() => this.searchResult = true);

			this.lastReqParams = query;
		} else {
			this.searchResult = true;
		}
	}

	paginate(link) {
		this.refresh(link.query);
	}
}
