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

export default class EmailConfirmationCtrl {

	/**
	 * @param $state
	 * @param $stateParams
	 * @param {ApiHelper} ApiHelper
	 * @param {AuthService} AuthService
	 * @param {LoginService} LoginService
	 * @param {ModalFlashService} ModalFlashService
	 * @param ProfileResource
	 * @ngInject
	 */
	constructor($state, $stateParams, ApiHelper, AuthService, LoginService, ModalFlashService, ProfileResource) {

		ProfileResource.confirm({ id: $stateParams.token }, result => {
			if (result.previous_code === 'pending_update') {

				ModalFlashService.info({
					title: 'Email Confirmation',
					subtitle: 'Thanks!',
					message: result.message
				});

				if (AuthService.isAuthenticated) {
					$state.go('profile.settings');
				} else {
					$state.go('home');
				}

			} else {
				LoginService.loginParams.open = true;
				LoginService.loginParams.localOnly = true;
				LoginService.loginParams.message = result.message;
				$state.go('home');
			}

		}, ApiHelper.handleErrorsInFlashDialog('home', 'Token validation error'));
	}
}