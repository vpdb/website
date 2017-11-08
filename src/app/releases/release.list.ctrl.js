import { values, includes, omit, isEqual, isObject, assign } from 'lodash';

export default class ReleaseListCtrl {

	/**
	 * Class constructor
	 * @param $scope
	 * @param $localStorage
	 * @param $location
	 * @param {App} App
	 * @param {AuthService} AuthService
	 * @param {ApiHelper} ApiHelper
	 * @param {Flavors} Flavors
	 * @param {TrackerService} TrackerService
	 * @param {ReleaseResource} ReleaseResource
	 * @param {TagResource} TagResource
	 * @param {BuildResource} BuildResource
	 */
	constructor($scope, $localStorage, $location,
				App, AuthService, ApiHelper, Flavors, TrackerService,
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
		this.TrackerService = TrackerService;
		this.ReleaseResource = ReleaseResource;
		this.TagResource = TagResource;
		this.BuildResource = BuildResource;

		// view type config
		const viewTypes = ['extended', 'table'];
		const defaultViewType = 'compact';

		$localStorage.releases = $localStorage.releases || {};

		// query defaults
		this.$query = null;
		this.flavorFilter = { orientation: '', lighting: '' };
		this.filterTags = [];
		this.filterBuilds = [];
		this.filterFlavorOpen = { };
		this.$scope.sort = 'released_at';

		// stuff we need in the view
		this.flavors = values(Flavors);

		this.tags = TagResource.query();
		this.builds = BuildResource.query();

		// view types logic
		const viewtype = $localStorage.releases.viewtype || defaultViewType;
		this.viewtype = includes(viewTypes, viewtype) ? viewtype : defaultViewType;
		this.setViewTemplate(this.viewtype);

		// update scope with query variables TODO surely we can refactor this a bit?
		const urlQuery = this.$location.search();
		if (urlQuery.q) {
			this.q = urlQuery.q;
		}
		if (urlQuery.starred) {
			this.starredOnly = true;
		}
		if (urlQuery.page) {
			this.page = urlQuery.page;
		}
		if (urlQuery.sort) {
			this.$scope.sort = urlQuery.sort;
		}
		if (urlQuery.tags) {
			this.filterTagOpen = true;
			this.filterTags = urlQuery.tags.split(',');
		}
		if (urlQuery.builds) {
			this.filterBuildOpen = true;
			this.filterBuilds = urlQuery.builds.split(',');
		}
		if (urlQuery.flavor) {
			var f, queryFlavors = urlQuery.flavor.split(',');
			for (var i = 0; i < queryFlavors.length; i++) {
				f = queryFlavors[i].split(':');
				this.filterFlavorOpen[f[0]] = true;
				this.flavorFilter[f[0]] = f[1]
			}
		}
		if (urlQuery.validation) {
			this.filterValidationOpen = true;
			this.validation = urlQuery.validation;
		}

		$scope.$watch(() => this.q, this.refresh.bind(this));
		$scope.$watch('starredOnly', this.refresh.bind(this));

		$scope.$on('dataChangeSort', (event, field, direction) => {
			this.$scope.sort = (direction === 'desc' ? '-' : '') + field;
			this.refresh({});
		});

		$scope.$on('dataToggleTag', (event, tag) => {
			if (includes(this.filterTags, tag)) {
				this.filterTags.splice(this.filterTags.indexOf(tag), 1);
			} else {
				this.filterTags.push(tag);
			}
			this.refresh({});
		});

		$scope.$on('dataToggleBuild', (event, build) => {
			if (includes(this.filterBuilds, build)) {
				this.filterBuilds.splice(this.filterBuilds.indexOf(build), 1);
			} else {
				this.filterBuilds.push(build);
			}
			this.refresh({});
		});

		this.refresh({});
	}

	refresh(queryOverride, firstRunCheck) {

		// ignore initial watches
		if (queryOverride === firstRunCheck) {
			return;
		}
		const urlQuery = this.$location.search();

		let query = { sort: this.$scope.sort, thumb_format: this.thumbFormat };
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

		// filter by starred
		if (this.starredOnly) {
			query.starred = 1;
		}

		// filter by tags
		if (this.filterTags.length) {
			query.tags = this.filterTags.join(',');
		} else {
			delete query.tags;
		}

		// filter by builds
		if (this.filterBuilds.length) {
			query.builds = this.filterBuilds.join(',');
		} else {
			delete query.builds;
		}

		// filter by flavor
		const queryFlavors = [];
		for (let f in this.flavorFilter) {
			if (this.flavorFilter.hasOwnProperty(f) && this.flavorFilter[f]) {
				queryFlavors.push(f + ':' + this.flavorFilter[f]);
			}
		}
		if (queryFlavors.length > 0) {
			query.flavor = queryFlavors.join(',');
		} else {
			delete query.flavor;
		}

		// filter by validation
		if (this.validation) {
			query.validation = this.validation;
		}
		if (!this.validation) {
			delete query.validation;
		}

		if (isObject(queryOverride)) {
			query = assign(query, queryOverride);
		}
		this.$location.search(this.queryToUrl(query));

		// refresh if changes
		if (!isEqual(this.$query, query)) {
			this.loading = true;
			this.releases = this.ReleaseResource.query(query, this.ApiHelper.handlePagination(this, { loader: true }), this.ApiHelper.handleErrors(this));
			this.$query = query;
		}
	};

	queryToUrl(query) {
		const defaults = {
			sort: 'released_at',
			page: '1',
			per_page: '12'
		};
		const q = omit(query, function(value, key) {
			return defaults[key] === value;
		});
		delete q.thumb_format;
		return q;
	};

	paginate(link) {
		this.refresh(link.query);
	};

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

	switchview(view) {
		if (this.viewtype === view) {
			return;
		}
		this.$localStorage.releases.viewtype = view;
		this.viewtype = view;
		this.setViewTemplate(view);
		this.refresh({});
	};
}