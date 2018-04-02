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

import { debounce } from 'lodash';

import UserEditAdminModalTpl from './user.edit.admin.modal.pug';

export default class UserListAdminCtrl {

	/**
	 * @param $scope
	 * @param $uibModal
	 * @param {App} App
	 * @param {TrackerService} TrackerService
	 * @param UserResource
	 * @param RolesResource
	 * @ngInject
	 */
	constructor($scope, $uibModal, TrackerService, App, UserResource, RolesResource) {

		App.theme('light');
		App.setTitle('Users');
		App.setMenu('admin');

		this.$scope = $scope;
		this.$uibModal = $uibModal;
		this.UserResource = UserResource;
		this.RolesResource = RolesResource;
		TrackerService.trackPage();

		this.users = this.UserResource.query();
		this.roles = this.RolesResource.query();

		this.filterRole = [];
		this.firstLoad = true;
		this.query = '';

		$scope.$watch(() => this.query, debounce(() => {
			if (!this.firstLoad || this.query) {
				this.refresh();
			}
		}, 350), true);

		$scope.$on('dataToggleRole', (event, role) => {
			if (this.filterRole.includes(role)) {
				this.filterRole.splice(this.filterRole.indexOf(role), 1);
			} else {
				this.filterRole.push(role);
			}
			$scope.$apply();
			this.refresh();
		});
	}

	edit(user) {
		this.$uibModal.open({
			templateUrl: UserEditAdminModalTpl,
			controller: 'UserEditAdminModalCtrl',
			controllerAs: 'vm',
			size: 'lg',
			resolve: {
				user: () => user,
				roles: () => this.roles
			}
		});
	}

	refresh() {
		const query = {};
		if (!this.firstLoad || this.query) {
			query.q = this.query;
			this.firstLoad = false;
		}
		if (this.filterRole.length > 0) {
			query.roles = this.filterRole.join(',');
		}
		this.users = this.UserResource.query(query);
	}
}