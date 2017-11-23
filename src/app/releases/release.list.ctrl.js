import { cloneDeep, includes, isEqual, values } from 'lodash';
import { Param, Params } from "../core/param.helper";

export default class ReleaseListCtrl {

	/**
	 * @param $scope
	 * @param $localStorage
	 * @param $location
	 * @param {App} App
	 * @param {AuthService} AuthService
	 * @param {ApiHelper} ApiHelper
	 * @param {Flavors} Flavors
	 * @param {ReleaseService} ReleaseService
	 * @param {TrackerService} TrackerService
	 * @param ReleaseResource
	 * @param TagResource
	 * @param BuildResource
	 * @ngInject
	 */
	constructor($scope, $localStorage, $location,
				App, AuthService, ApiHelper, Flavors, ReleaseService, TrackerService,
				ReleaseResource, TagResource, BuildResource) {

		App.theme('dark');
		App.setTitle('Releases');
		App.setMenu('releases');
		App.setMeta({
			description: 'Browse and search through our release database, see playfield shots, release date, popularity or rating, filter by orientation, tag, compatibility.',
			keywords: 'visual pinball, vpt, vpx, fullscreen, desktop, search, browse, filter, sort, download, virtual pinball, vpinball'
		});
		TrackerService.trackPage();

		this.$scope = $scope;
		this.$localStorage = $localStorage;
		this.$location = $location;
		this.App = App;
		this.AuthService = AuthService;
		this.ApiHelper = ApiHelper;
		this.Flavors = Flavors;
		this.ReleaseService = ReleaseService;
		this.TrackerService = TrackerService;
		this.ReleaseResource = ReleaseResource;
		this.TagResource = TagResource;
		this.BuildResource = BuildResource;

		// view type config
		const viewTypes = ['extended', 'table'];
		const defaultViewType = 'compact';

		this.pageLoading = false;
		this.lastReqParams = null;

		// stuff we need in the view
		this.flavors = values(Flavors);
		this.tags = TagResource.query();
		this.builds = BuildResource.query();

		// view types logic
		$localStorage.releases = $localStorage.releases || {};
		const viewtype = $localStorage.releases.viewtype || defaultViewType;
		this.viewtype = includes(viewTypes, viewtype) ? viewtype : defaultViewType;
		this.setViewTemplate(this.viewtype);

		this.params = new Params([
			new Param({ name: 'q', defaultValue: '' }),
			new Param({ name: 'starredOnly', defaultValue: false }),
			new Param({ name: 'filterBuilds', defaultValue: [], reqName: 'builds', toReq: b => b.join(','), fromUrl: b => b.split(',') }),
			new Param({ name: 'filterFlavor', defaultValue: [] }),
			new Param({ name: 'filterTags', defaultValue: [] }),
			new Param({ name: 'filterValidation', defaultValue: [] }),
			new Param({ name: 'sort', defaultValue: 'released_at' }),
			new Param({ name: 'page', defaultValue: 1, fromUrl: page => parseInt(page, 10) }),
			new Param({ name: 'perPage', defaultValue: 12, fromUrl: null }),
		]);
		/** @type {{ q:string, starredOnly:boolean, filterBuilds, filterFlavor, filterTags, filterValidation, sort:string, page:number, perPage:number }} */
		this.query = this.params.value;

		// update query object from url
		this.params.fromUrl(this.$location.search());

		// watch query object for changes
		$scope.$watch(() => this.query, this.onQueryChanged.bind(this), true);

		// trigger first load
		this.refresh();

		// query defaults
		// this.lastReqParams = null;
		// this.flavorFilter = { orientation: '', lighting: '' };
		// this.filterTags = [];
		// this.filterBuilds = [];
		// this.filterFlavorOpen = { };
		// this.$scope.sort = 'released_at';
		//
		//
		// // update scope with query variables TODO surely we can refactor this a bit?
		// const urlQuery = this.$location.search();
		// if (urlQuery.q) {
		// 	this.q = urlQuery.q;
		// }
		// if (urlQuery.starred) {
		// 	this.starredOnly = true;
		// }
		// if (urlQuery.page) {
		// 	this.page = urlQuery.page;
		// }
		// if (urlQuery.sort) {
		// 	this.$scope.sort = urlQuery.sort;
		// }
		// if (urlQuery.tags) {
		// 	this.filterTagOpen = true;
		// 	this.filterTags = urlQuery.tags.split(',');
		// }
		// if (urlQuery.builds) {
		// 	this.filterBuildOpen = true;
		// 	this.filterBuilds = urlQuery.builds.split(',');
		// }
		// if (urlQuery.flavor) {
		// 	let f;
		// 	const queryFlavors = urlQuery.flavor.split(',');
		// 	for (let i = 0; i < queryFlavors.length; i++) {
		// 		f = queryFlavors[i].split(':');
		// 		this.filterFlavorOpen[f[0]] = true;
		// 		this.flavorFilter[f[0]] = f[1]
		// 	}
		// }
		// if (urlQuery.validation) {
		// 	this.filterValidationOpen = true;
		// 	this.validation = urlQuery.validation;
		// }
		//
		// $scope.$watch(() => this.q, this.refresh.bind(this));
		// $scope.$watch('starredOnly', this.refresh.bind(this));
		//
		// $scope.$on('dataChangeSort', (event, field, direction) => {
		// 	this.$scope.sort = (direction === 'desc' ? '-' : '') + field;
		// 	this.refresh({});
		// });
		//
		// $scope.$on('dataToggleTag', (event, tag) => {
		// 	if (includes(this.filterTags, tag)) {
		// 		this.filterTags.splice(this.filterTags.indexOf(tag), 1);
		// 	} else {
		// 		this.filterTags.push(tag);
		// 	}
		// 	this.refresh({});
		// });
		//
		// $scope.$on('dataToggleBuild', (event, build) => {
		// 	if (includes(this.filterBuilds, build)) {
		// 		this.filterBuilds.splice(this.filterBuilds.indexOf(build), 1);
		// 	} else {
		// 		this.filterBuilds.push(build);
		// 	}
		// 	this.refresh({});
		// });
		//
		// this.refresh({});
	}

	/**
	 * Executed when the query object changes, i.e. the user changes a
	 * parameter in the DOM.
	 */
	onQueryChanged() {
		this.$location.search(this.params.getUrl());
		this.refresh();
	}

	refresh() {

		// // ignore initial watches
		// if (queryOverride === firstRunCheck) {
		// 	return;
		// }
		// const urlQuery = this.$location.search();
		//
		// let query = { sort: this.$scope.sort, thumb_format: this.thumbFormat };
		// if (this.firstQuery) {
		// 	query.page = urlQuery.page;
		// 	this.firstQuery = false;
		// }
		// queryOverride = queryOverride || {};
		//
		// // search query
		// if (this.q && this.q.length > 2) {
		// 	query.q = this.q;
		// }
		// if (!this.q) {
		// 	delete query.q;
		// }
		//
		// // filter by starred
		// if (this.starredOnly) {
		// 	query.starred = 1;
		// }
		//
		// // filter by tags
		// if (this.filterTags.length) {
		// 	query.tags = this.filterTags.join(',');
		// } else {
		// 	delete query.tags;
		// }
		//
		// // filter by builds
		// if (this.filterBuilds.length) {
		// 	query.builds = this.filterBuilds.join(',');
		// } else {
		// 	delete query.builds;
		// }
		//
		// // filter by flavor
		// const queryFlavors = [];
		// for (let f in this.flavorFilter) {
		// 	if (this.flavorFilter.hasOwnProperty(f) && this.flavorFilter[f]) {
		// 		queryFlavors.push(f + ':' + this.flavorFilter[f]);
		// 	}
		// }
		// if (queryFlavors.length > 0) {
		// 	query.flavor = queryFlavors.join(',');
		// } else {
		// 	delete query.flavor;
		// }
		//
		// // filter by validation
		// if (this.validation) {
		// 	query.validation = this.validation;
		// }
		// if (!this.validation) {
		// 	delete query.validation;
		// }
		//
		// if (isObject(queryOverride)) {
		// 	query = assign(query, queryOverride);
		// }
		// this.$location.search(this.queryToUrl(query));
		//
		// // refresh if changes
		// if (!isEqual(this.lastReqParams, query)) {
		// 	this.pageLoading = true;
		// 	this.releases = this.ReleaseResource.query(query, this.ApiHelper.handlePagination(this, { loader: true }), this.ApiHelper.handleErrors(this));
		// 	this.lastReqParams = query;
		// }

		const reqParams = this.params.toRequest();
		// only refresh if query object changed
		if (!isEqual(this.lastReqParams, reqParams)) {
			this.lastReqParams = reqParams;
			this.pageLoading = true;
			this.releases = this.ReleaseResource.query(reqParams, this.ApiHelper.handlePagination(this, { loader: true }), this.ApiHelper.handleErrors(this));
		}
	};

	/**
	 * Updates the query object with the new page.
	 * @param link
	 */
	paginate(link) {
		this.query.page = parseInt(link.query.page, 10);
		this.refresh();
	}

	onFlavorChange() {
		this.refresh({});
	};

	toggleValidation(validation) {
		if (validation === this.validation) {
			this.validation = null;
		} else {
			this.validation = validation;
		}
		this.refresh({});
	}

	setViewTemplate(view) {
		switch (view) {
			case 'compact':
				this.thumbFormat = this.App.pixelSuffix('medium');
				break;
			default:
				this.thumbFormat = this.App.pixelSuffix('square');
		}
	};

	switchView(view) {
		if (this.viewtype === view) {
			return;
		}
		this.$localStorage.releases.viewtype = view;
		this.viewtype = view;
		this.setViewTemplate(view);
		this.refresh({});
	};

}