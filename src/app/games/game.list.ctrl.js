import { cloneDeep, isEqual, pickBy } from 'lodash';

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

		this.pageLoading = false;
		this.lastReqParams = null;

		// the default query. params equal to that don't appear in the url.
		this.defaultQuery = {
			q: '',
			filterDecades: [],
			filterManufacturer: [],
			includeEmptyGames: false,
			sort: '-popularity',
			page: 1,
			perPage: 12
		};

		/**
		 * What we internally save the as query status
		 * @type {{ q:string, includeEmptyGames:boolean, sort:string, page:number, filterDecades:number[], filterManufacturer:string[] }}
		 */
		this.query = cloneDeep(this.defaultQuery);

		// update query object from url
		this.updateQueryFromUrl();

		// watch query object for changes
		$scope.$watch(() => this.query, this.onQueryChanged.bind(this), true);

		// trigger first load
		this.refresh();
	}

	/**
	 * Executed when the query object changes, i.e. the user changes a
	 * parameter in the DOM.
	 */
	onQueryChanged() {
		this.updateUrlFromQuery();
		this.refresh();
	}

	/**
	 * Converts the URL parameters to the query object.
	 */
	updateQueryFromUrl() {
		const queryParams = this.$location.search();
		if (queryParams.q) {
			this.query.q = queryParams.q;
		}
		if (queryParams.decade) {
			this.query.filterDecades = queryParams.decade.split(',').map(parseInt);
		}
		if (queryParams.mfg) {
			this.query.filterManufacturer = queryParams.mfg.split(',');
		}
		if (queryParams.show_empty) {
			this.query.includeEmptyGames = !!queryParams.show_empty;
		}
		if (queryParams.sort) {
			this.query.sort = queryParams.sort;
		}
		if (queryParams.page) {
			this.query.page = parseInt(queryParams.page);
		}
	}

	/**
	 * Updates the URL with the query object parameters.
	 * Default parameters are omitted.
	 */
	updateUrlFromQuery() {
		const defaultUrlQuery = GameListCtrl.queryToUrl(this.defaultQuery);
		const urlQuery = pickBy(GameListCtrl.queryToUrl(this.query), (value, key) => defaultUrlQuery[key] !== value);
		this.$location.search(urlQuery);
	}

	/**
	 * Converts the query object to an URL query for the backend.
	 */
	queryToRequest() {
		const reqParams = { sort: this.query.sort, page: this.query.page };
		if (this.query.q && this.query.q.length > 2) {
			reqParams.q = this.query.q;
		}
		if (this.query.filterDecades.length) {
			reqParams.decade = this.query.filterDecades.join(',');
		}
		if (this.query.filterManufacturer.length) {
			reqParams.mfg = this.query.filterManufacturer.join(',');
		}
		if (!this.query.includeEmptyGames) {
			reqParams.min_releases = 1;
		}
		return reqParams;
	}

	/**
	 * Loads games from the backend
	 */
	refresh() {
		const reqParams = this.queryToRequest();
		// only refresh if query object changed
		if (!isEqual(this.lastReqParams, reqParams)) {
			this.lastReqParams = reqParams;
			this.pageLoading = true;
			this.games = this.GameResource.query(reqParams, this.ApiHelper.handlePagination(this, { loader: true }));
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

	/**
	 * Converts the query object to URL parameters
	 * @param query
	 * @see #updateQueryFromUrl
	 */
	static queryToUrl(query) {
		return {
			q: query.q,
			decade: query.filterDecades.join(','),
			mfg: query.filterManufacturer.join(','),
			show_empty: query.includeEmptyGames ? 1 : 0,
			sort: query.sort,
			page: query.page,
			per_page: query.perPage
		};
	}
}