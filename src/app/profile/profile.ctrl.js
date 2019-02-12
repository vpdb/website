/*
 * VPDB - Virtual Pinball Database
 * Copyright (C) 2019 freezy <freezy@vpdb.io>
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

export default class ProfileCtrl {

	/**
	 * @param $state
	 * @param $location
	 * @param $uibModal
	 * @param {AuthService} AuthService
	 * @ngInject
	 */
	constructor($state, $location, $uibModal, AuthService) {

		this.$state = $state;
		this.$location = $location;
		this.$uibModal = $uibModal;
		this.AuthService = AuthService;

		if (!this.AuthService.isAuthenticated) {
			AuthService.addPostLoginAction('redirect', { stateName: $state.current.name, stateParams: $state.params });
			this.$state.go('401', { url: this.$location.path() });
		}
	}

	changeAvatar () {
		this.$uibModal.open({ templateUrl: 'modal/change-avatar.html' }).result.catch(angular.noop);
	}
}
