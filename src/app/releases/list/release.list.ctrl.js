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

import { isEqual, isEmpty, toPairs, fromPairs, mapValues } from 'lodash';
import Param from '../../common/util/param';
import Params from '../../common/util/params';

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
		this.ReleaseService = ReleaseService;
		this.ReleaseResource = ReleaseResource;

		// view type config
		const viewTypes = ['extended', 'table'];
		const defaultViewType = 'compact';

		this.lastReqParams = null;
		this.status = { loading: false, offline: false };
		this.pagination = {};

		// stuff we need in the view
		this.flavors = Object.keys(Flavors).map(e => Flavors[e]);
		this.tags = TagResource.query();
		this.builds = BuildResource.query();

		// view types logic
		$localStorage.releases = $localStorage.releases || {};
		const viewtype = $localStorage.releases.viewtype || defaultViewType;
		this.viewtype = viewTypes.includes(viewtype) ? viewtype : defaultViewType;
		this.setViewTemplate(this.viewtype);

		this.params = new Params([
			new Param({ name: 'q', defaultValue: '' }),
			new Param({ name: 'starredOnly', defaultValue: false, reqName: 'starred' }),
			new Param({ name: 'filterBuilds', defaultValue: [], reqName: 'builds' }),
			new Param({ name: 'filterFlavor', defaultValue: { orientation: '', lighting: '' }, reqName: 'flavor',
				toReq: f => toPairs(f).filter(p => p[1]).map(j => j.join(':')).join(','),
				fromUrl: f => fromPairs(f.split(',').map(p => p.split(':')))}),
			new Param({ name: 'filterTags', defaultValue: [], reqName: 'tags' }),
			new Param({ name: 'filterValidation', defaultValue: [], reqName: 'validation' }),
			new Param({ name: 'sort', defaultValue: 'released_at' }),
			new Param({ name: 'page', defaultValue: 1, fromUrl: page => parseInt(page, 10) }),
			new Param({ name: 'perPage', defaultValue: 12, fromUrl: null })
		]);
		/** @type {{ q:string, starredOnly:boolean, filterBuilds, filterFlavor, filterTags, filterValidation, sort:string, page:number, perPage:number }} */
		this.query = this.params.value;

		// update query object from url
		this.params.fromUrl(this.$location.search());

		// watch query object for changes
		$scope.$watch(() => this.query, this.onQueryChanged.bind(this), true);

		// collapse statuses
		$scope.$watch(() => this.query.filterFlavor, () => this.filterFlavorOpen = mapValues(this.query.filterFlavor, val => !!val), true);
		$scope.$watch(() => this.query.filterBuilds, () => this.filterBuildsOpen = !isEmpty(this.query.filterBuilds));
		$scope.$watch(() => this.query.filterTags, () => this.filterTagsOpen = !isEmpty(this.query.filterTags));
		$scope.$watch(() => this.query.filterValidation, () => this.filterValidationOpen = !isEmpty(this.query.filterValidation));

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

	refresh() {
		const reqParams = Object.assign(this.params.toRequest(), { thumb_format: this.thumbFormat });
		// only refresh if query object changed
		if (!isEqual(this.lastReqParams, reqParams)) {
			this.ApiHelper.paginatedRequest(() => this.ReleaseResource.query(reqParams), this.status, this.pagination)
				.then(releases => {
					this.releases = releases;
					this.lastReqParams = reqParams;
				})
				.catch(() => this.releases = []);
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

	setViewTemplate(view) {
		switch (view) {
			case 'compact':
				this.thumbFormat = this.App.pixelSuffix('medium');
				break;
			default:
				this.thumbFormat = this.App.pixelSuffix('square');
		}
	}

	switchView(view) {
		if (this.viewtype === view) {
			return;
		}
		this.$localStorage.releases.viewtype = view;
		this.viewtype = view;
		this.setViewTemplate(view);
		this.refresh();
	}
}
