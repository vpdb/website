import { extend, isEqual, map } from 'lodash';

/**
 * Home page controller.
 *
 * @author freezy <freezy@vpdb.io>
 */
export default class HomeCtrl {

	/**
	 * Constructor
	 * @param $scope
	 * @param {App} App
	 * @param {ApiHelper} ApiHelper
	 * @param {GameResource} GameResource
	 * @param {ReleaseResource} ReleaseResource
	 * @param {TrackerService} TrackerService
	 */
	constructor($scope, App, ApiHelper, GameResource, ReleaseResource, TrackerService) {

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
		this.GameResource = GameResource;

		// internal params
		this.q = '';
		this.searching = false;

		this.searchResult = false;
		this.whatsThis = false;

		// watch query
		$scope.$watch(() => this.q, (newVal, oldVal, scope) => this.refresh({ q: newVal }));

		// fetch latest releases
		this.releases = ReleaseResource.query({
			thumb_format: App.pixelSuffix('square'),
			per_page: 6,
			sort: 'released_at' });

		// fetch popular games
		this.popularGames = GameResource.query({
			per_page: 8,
			sort: 'popularity' });
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
		if (!isEqual(this.$query, query)) {
			this.searching = true;

			// noinspection JSUnresolvedFunction
			this.GameResource.query(query, this.ApiHelper.handlePagination(this, games => {

				// only update results if result is different to avoid flicker.
				if (!isEqual(map(this.games, 'id'), map(games, 'id'))) {
					this.games = games;
				}
				this.searchResult = true;
				this.searching = false;
			}));
			this.$query = query;
		} else {
			this.searchResult = true;
		}
	}

	paginate(link) {
		this.refresh(link.query);
	};
}