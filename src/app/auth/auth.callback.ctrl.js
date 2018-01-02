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

/**
 * The page where the OAuth provider redirects to.
 *
 * @author freezy <freezy@vpdb.io>
 */
export default class AuthCallbackCtrl {

	/**
	 * @param $stateParams
	 * @param $location
	 * @param {*} $localStorage
	 * @param {AuthService} AuthService
	 * @param {ModalService} ModalService
	 * @param AuthResource
	 * @ngInject
	 */
	constructor($stateParams, $location, $localStorage, AuthService, ModalService, AuthResource) {

		if ($location.search().code) {
			// noinspection JSUnresolvedFunction
			AuthResource.authenticateCallback($stateParams, result => {
				AuthService.authenticated(result);
				AuthService.runPostLoginActions();
				if ($localStorage.rememberMe) {
					AuthService.rememberMe();
				}
			}, err => {
				ModalService.error({
					subtitle: 'Could not login.',
					message: err.data.error
				});
			});
		} else {
			/** @type {{ error_uri:string, error_description:string}} */
			this.error = $location.search();
		}
	}
}