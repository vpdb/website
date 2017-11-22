import { isObject, isEqual, includes, assign, omit } from 'lodash';

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

		this.$scope = $scope;
		this.$location = $location;
		this.App = App;
		this.AuthService = AuthService;
		this.ApiHelper = ApiHelper;
		this.GameResource = GameResource;

		this.pageLoading = false;
		this.$query = null;
		this.$scope.filterDecades = [];
		this.$scope.filterManufacturer = [];
		this.$scope.sort = 'popularity';
		this.firstQuery = true;

		// update scope with query variables TODO surely we can refactor this a bit?
		const urlQuery = this.$location.search();
		if (urlQuery.q) {
			this.q = urlQuery.q;
		}
		if (urlQuery.show_empty) {
			this.includeEmptyGames = true;
		}
		if (urlQuery.page) {
			this.page = urlQuery.page;
		}
		if (urlQuery.sort) {
			this.$scope.sort = urlQuery.sort;
		}
		if (urlQuery.decade) {
			this.filterYearOpen = true;
			$scope.filterDecades = urlQuery.decade.split(',').map(parseInt);
		}
		if (urlQuery.mfg) {
			this.filterManufacturerOpen = true;
			this.$scope.filterManufacturer = urlQuery.mfg.split(',');
		}

		$scope.$watch(() => this.q, this.refresh.bind(this));
		$scope.$watch(() => this.includeEmptyGames, this.refresh.bind(this));
		$scope.$on('dataChangeSort', (event, field, direction) => {
			this.$scope.sort = (direction === 'desc' ? '-' : '') + field;
			this.refresh({});
		});
		$scope.$on('dataToggleDecade', (event, decade) => {
			if (includes($scope.filterDecades, decade)) {
				this.$scope.filterDecades.splice(this.$scope.filterDecades.indexOf(decade), 1);
			} else {
				this.$scope.filterDecades.push(decade);
			}
			this.refresh({});
		});
		$scope.$on('dataToggleManufacturer', (event, manufacturer) => {
			if (includes(this.$scope.filterManufacturer, manufacturer)) {
				this.$scope.filterManufacturer.splice(this.$scope.filterManufacturer.indexOf(manufacturer), 1);
			} else {
				this.$scope.filterManufacturer.push(manufacturer);
			}
			this.refresh({});
		});

		// trigger first load
		this.refresh({});
	}

	refresh(queryOverride, firstRunCheck) {

		// ignore initial watches
		if (queryOverride === firstRunCheck) {
			return;
		}

		const urlQuery = this.$location.search();
		let query = { sort: this.$scope.sort };
		if (this.firstQuery) {
			query.page = urlQuery.page;
			this.firstQuery = false;
		}
		queryOverride = queryOverride || {};

		// search query
		if (this.q && this.q.length > 2) {
			query.q = this.q;
		}
		if (!this.q) {
			delete query.q;
		}

		// filter by decade
		if (this.$scope.filterDecades.length) {
			query.decade = this.$scope.filterDecades.join(',');
		} else {
			delete query.decade;
		}

		// filter by manufacturer
		if (this.$scope.filterManufacturer.length) {
			query.mfg = this.$scope.filterManufacturer.join(',');
		} else {
			delete query.mfg;
		}

		// filter empty games
		if (!this.includeEmptyGames) {
			query.min_releases = 1;
		}

		if (isObject(queryOverride)) {
			query = assign(query, queryOverride);
		}
		this.$location.search(this.queryToUrl(query));

		// refresh if changes
		if (!isEqual(this.$query, query)) {
			this.pageLoading = true;
			this.games = this.GameResource.query(query, this.ApiHelper.handlePagination(this, { loader: true }));
			this.$query = query;
		}
	}

	queryToUrl(query) {
		const defaults = {
			sort: 'popularity',
			page: '1',
			per_page: '12'
		};
		const q = omit(query, (value, key) => defaults[key] === value);
		if (query.min_releases) {
			delete q.min_releases;
		} else {
			q.show_empty = 1;
		}
		return q;
	}

	paginate(link) {
		this.refresh(link.query);
	}
}