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

import { isEmpty, isEqual} from 'lodash';
import Params from '../../common/util/params';
import Param from '../../common/util/param';

export default class GameListCtrl {

	/**
	 * @param $scope
	 * @param $location
	 * @param {App} App
	 * @param {ApiHelper} ApiHelper
	 * @param {AuthService} AuthService
	 * @param {TrackerService} TrackerService
	 * @param GameResource
	 * @ngInject
	 */
	constructor($scope, $location, App, AuthService, ApiHelper, TrackerService, GameResource) {

		App.theme('dark');
		App.setTitle('Games');
		App.setMenu('games');
		App.setMeta({
			description: 'Browse and search through our game database, see backglasses and wheel images, sort by name, popularity or rating, filter by manufacturer or decade.',
			keywords: 'virtual pinball games, recreations, digital, list, search, browse, filter, fuzzy search'
		});
		TrackerService.trackPage();

		this.$location = $location;
		this.App = App;
		this.AuthService = AuthService;
		this.ApiHelper = ApiHelper;
		this.GameResource = GameResource;

		this.lastReqParams = null;
		this.status = { loading: false, offline: false };
		this.pagination = {};

		this.params = new Params([
			new Param({ name: 'q', defaultValue: '' }),
			new Param({ name: 'filterDecades', defaultValue: [], reqName: 'decade' }),
			new Param({ name: 'filterManufacturer', defaultValue: [], reqName: 'mfg' }),
			new Param({ name: 'includeEmptyGames', defaultValue: false, urlName: 'show_empty', reqName: 'min_releases', fromUrl: v => !!v, toReq: v => v ? 0 : 1, toUrl: v => v ? 1 : 0 }),
			new Param({ name: 'sort', defaultValue: 'popularity' }),
			new Param({ name: 'page', defaultValue: 1, fromUrl: page => parseInt(page, 10) }),
			new Param({ name: 'perPage', defaultValue: 12, fromUrl: null })
		]);
		/** @type {{ q:string, filterDecades:string[], filterManufacturer:string[], includeEmptyGames:boolean, sort:string, page:number, perPage:number }} */
		this.query = this.params.value;

		// update query object from url
		this.params.fromUrl(this.$location.search());

		// watch query object for changes
		$scope.$watch(() => this.query, this.onQueryChanged.bind(this), true);

		// collapse statuses
		$scope.$watch(() => this.query.filterDecades, () => this.filterDecadesOpen = !isEmpty(this.query.filterDecades));
		$scope.$watch(() => this.query.filterManufacturer, () => this.filterManufacturerOpen = !isEmpty(this.query.filterManufacturer));

		// trigger first load
		this.refresh();
	}

	/**
	 * Executed when the query object changes, i.e. the user changes a
	 * parameter in the DOM.
	 */
	onQueryChanged() {
		this.$location.search(this.params.getUrl());
		this.refresh();
	}

	/**
	 * Loads games from the backend
	 */
	refresh() {
		const reqParams = this.params.toRequest();
		const validQuery = !reqParams.q || reqParams.q.length > 2;
		if (validQuery && !isEqual(this.lastReqParams, reqParams)) {
			this.ApiHelper.paginatedRequest(() => this.GameResource.query(reqParams), this.status, this.pagination).then(games => {
				this.games = games;
				this.lastReqParams = reqParams;

			}).catch(() => this.games = []);
		}

	}

	/**
	 * Updates the query object with the new page.
	 * @param link
	 */
	paginate(link) {
		this.query.page = parseInt(link.query.page, 10);
		this.refresh();
	}
}
