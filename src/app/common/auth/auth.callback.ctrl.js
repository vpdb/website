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
import UserMergeModalTpl from '../user/user.merge.modal.pug';

/**
 * The page where the OAuth provider redirects to.
 *
 * @author freezy <freezy@vpdb.io>
 */
export default class AuthCallbackCtrl {

	/**
	 * @param $state
	 * @param $stateParams
	 * @param $location
	 * @param $localStorage
	 * @param $uibModal
	 * @param {AuthService} AuthService
	 * @param {ModalService} ModalService
	 * @param {ErrorReportingService} ErrorReportingService
	 * @param AuthResource
	 * @ngInject
	 */
	constructor($state, $stateParams, $location, $localStorage, $uibModal, AuthService, ModalService, ErrorReportingService, AuthResource) {

		if ($location.search().code) {
			let query;
			const params = $location.search();
			if ($localStorage.mergeUserId) {
				query = { code: params.code, strategy: $stateParams.strategy, merged_user_id: $localStorage.mergeUserId };
				delete $localStorage.mergeUserId;
			} else {
				query = Object.assign(params, { strategy: $stateParams.strategy });
			}
			AuthResource.authenticateCallback(query, result => {
				AuthService.authenticated(result);
				AuthService.runPostLoginActions();
				if ($localStorage.rememberMe) {
					AuthService.rememberMe();
				}
			}, err => {
				if (err.status === 409) {
					$uibModal.open({
						templateUrl: UserMergeModalTpl,
						controller: 'UserMergeModalCtrl',
						controllerAs: 'vm',
						size: 'lg',
						keyboard: false,
						backdrop: 'static',
						windowClass: 'theme-light',
						resolve: { data: () => err.data.data }
					}).result.catch(angular.noop);

				} else {

					ErrorReportingService.reportError('Error logging with OAuth.', err.data);
					ModalService.error({
						subtitle: 'Could not login.',
						message: err.data.error
					}, false, () => $state.go('home'));
				}
			});
		} else {
			/** @type {{ error_uri:string, error_description:string}} */
			this.error = $location.search();
		}
	}
}
