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

import UploadsBackglassModerateAdminModalTpl from './uploads.backglass.moderate.admin.modal.pug';

export default class UploadsBackglassListAdminCtrl {

	/**
	 * @param $scope
	 * @param $uibModal
	 * @param {ApiHelper} ApiHelper
	 * @param {UploadHelper} UploadHelper
	 * @param BackglassResource
	 * @ngInject
	 */
	constructor($scope, $uibModal, ApiHelper, UploadHelper, BackglassResource) {

		this.$scope = $scope;
		this.$uibModal = $uibModal;
		this.ApiHelper = ApiHelper;
		this.UploadHelper = UploadHelper;
		this.BackglassResource = BackglassResource;

		$scope.$on('refresh', this.refresh.bind(this));
		this.refresh();
	}

	refresh(query) {
		query = query || {
			moderation: this.$scope.filters.status,
			fields: 'moderation',
			sort: 'modified_at',
			per_page: this.$scope.numItems
		};
		this.backglasses = this.BackglassResource.query(query, this.ApiHelper.handlePagination(this, { loader: true }, backglasses => {
			backglasses.forEach(this.UploadHelper.addIcons);
		}));
	}

	moderateBackglass(backglass) {
		this.$uibModal.open({
			templateUrl: UploadsBackglassModerateAdminModalTpl,
			controller: 'UploadsBackglassModerateAdminModalCtrl',
			controllerAs: 'vm',
			size: 'md',
			resolve: {
				params: () => {
					return {
						backglass: backglass,
						refresh: this.refresh.bind(this)
					};
				}
			}
		});
	}

	paginate(link) {
		this.refresh(link.query);
	}
}