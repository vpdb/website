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

import angular from 'angular';
import UploadsReleaseModerateAdminModalTpl from './uploads.release.moderate.admin.modal.pug';

export default class UploadsReleaseListAdminCtrl {

	/**
	 * @param $scope
	 * @param $uibModal
	 * @param {ApiHelper} ApiHelper
	 * @param {UploadHelper} UploadHelper
	 * @param ReleaseResource
	 * @ngInject
	 */
	constructor($scope, $uibModal, ApiHelper, UploadHelper, ReleaseResource) {

		this.$scope = $scope;
		this.$uibModal = $uibModal;
		this.ApiHelper = ApiHelper;
		this.UploadHelper = UploadHelper;
		this.ReleaseResource = ReleaseResource;

		this.status = {
			releases: { loading: false, offline: false }
		};
		this.pagination = {
			releases: {}
		};

		$scope.$on('refresh', () => this.refresh());
		this.refresh();
	}

	refresh(query) {
		query = query || {
			moderation: this.$scope.filters.status,
			fields: 'moderation',
			sort: 'modified_at',
			per_page: this.$scope.numItems
		};
		this.ApiHelper.paginatedRequest(() => this.ReleaseResource.query(query), this.status.releases, this.pagination.releases)
			.then(releases => this.releases = releases.map(this.UploadHelper.addIcons))
			.catch(() => this.releases = []);
	}

	moderateRelease(release) {
		this.$uibModal.open({
			templateUrl: UploadsReleaseModerateAdminModalTpl,
			controller: 'UploadsReleaseModerateAdminModalCtrl',
			controllerAs: 'vm',
			size: 'md',
			resolve: {
				params: () => {
					return {
						release: release,
						refresh: this.refresh.bind(this)
					};
				}
			}
		}).result.catch(angular.noop);
	}

	paginate(link) {
		this.refresh(link.query);
	}
}
