import { isEmpty, isEqual} from 'lodash';
import { Param, Params } from '../core/param.helper';

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

		this.params = new Params([
			new Param({ name: 'q', defaultValue: '' }),
			new Param({ name: 'filterDecades', defaultValue: [], reqName: 'decade' }),
			new Param({ name: 'filterManufacturer', defaultValue: [], reqName: 'mfg' }),
			new Param({ name: 'includeEmptyGames', defaultValue: false, urlName: 'show_empty', reqName: 'min_releases', fromUrl: v => !!v, toReq: v => v ? 0 : 1, toUrl: v => v ? 1 : 0 }),
			new Param({ name: 'sort', defaultValue: 'released_at' }),
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
		// only refresh if query object changed
		if (!isEqual(this.lastReqParams, reqParams)) {
			this.lastReqParams = reqParams;
			this.pageLoading = true;
			this.games = this.GameResource.query(reqParams, this.ApiHelper.handlePagination(this, { loader: true }), this.ApiHelper.handleErrors(this));
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