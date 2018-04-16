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
 * An interceptor which adds the bearer token to backend API requests.
 *
 * The logic is the following:
 *
 *    - If the request is hitting the VPDB backend
 *       - If there is an auth token in local storage
 *         - Then add the token to the header
 *       - Elseif there is an (auto)login token in local storage
 *          - Then retrieve an auth token first and add it to the header
 *       - If there is currently an authentication request going on
 *         - Subscribe to it and add the token to the header on result
 *
 * This interceptor also checks the `x-token-refresh` header and updates
 * the token accordingly.
 *
 * @param $injector
 * @param $log
 * @param $q
 * @param {ConfigService} ConfigService
 * @ngInject
 * @see https://stackoverflow.com/questions/28638600/angularjs-http-interceptor-class-es6-loses-binding-to-this
 * @author freezy <freezy@vpdb.io>
 */
export default function($injector, $log, $q, ConfigService) {

	return {

		request: config => {

			return $q((resolve, reject) => {

				config.headers = config.headers || {};

				if (ConfigService.isAnyApiUrl(config.url)) {
					// don't "internally cache" (as in: don't make the request at all) anything from the api.
					config.cache = false;

					/** @type {AuthService} */
					const AuthService = $injector.get('AuthService');
					// check for valid token
					if (AuthService.hasToken()) {
						config.headers[AuthService.getAuthHeader()] = 'Bearer ' + AuthService.getToken();
						$log.debug('AuthInterceptor: Adding available auth token, resolving.');
						resolve(config);

					// check for auto login token
					} else if (!ConfigService.isAuthUrl(config.url) && AuthService.hasLoginToken()) {

						// if already authenticating, don't do launch another request but wait for the other to finish
						if (AuthService.isAuthenticating) {
							$log.warn('AuthInterceptor: Got autologin token, but there already seems to be a request. Adding to callback.');

							// this will be executed when the other request finishes
							AuthService.authCallbacks.push((err, result) => {
								if (err) {
									// received error from previous auth request
									return reject(err);
								}
								config.headers[AuthService.getAuthHeader()] = 'Bearer ' + result.token;
								// received token from previous auth request, continuing..
								resolve(config);
							});

						} else {
							// tell potential other requests that we're already authenticating
							AuthService.isAuthenticating = true;
							const AuthResource = $injector.get('AuthResource');
							// retrieving first auth token before continuing request (due to autologin)
							AuthResource.authenticate({ token: AuthService.getLoginToken() }, result => {

								config.headers[AuthService.getAuthHeader()] = 'Bearer ' + result.token;
								AuthService.authenticated(result);

								// received token from autologin, continuing
								resolve(config);

								// now notify subscribers
								AuthService.isAuthenticating = false;
								for (let i = 0; i < AuthService.authCallbacks.length; i++) {
									AuthService.authCallbacks[i](null, result);
								}
								AuthService.authCallbacks = [];

							}, err => {
								AuthService.clearLoginToken(); // it failed, so no need to keep it around further.
								reject(err);

								// also notify subscribers
								AuthService.isAuthenticating = false;
								for (let i = 0; i < AuthService.authCallbacks.length; i++) {
									AuthService.authCallbacks[i](err);
								}
								AuthService.authCallbacks = [];
							});
						}

					} else {
						// autologin disabled, moving on.
						resolve(config);
					}
				} else {
					// no API URL, moving on.
					resolve(config);
				}
			});
		},

		response: response => {

			if (response.status === 401 || response.status === 403) {
				return response;
			}
			const token = response.headers('x-token-refresh');

			// only for api calls we can be sure that the token is not cached and therefore correct.
			if (token && ConfigService.isApiUrl(response.config.url)) {
				const dirty = parseInt(response.headers('x-user-dirty'));
				/** @type {AuthService} */
				const AuthService = $injector.get('AuthService');
				if (dirty > 0) {
					// force user update
					AuthService.tokenReceived(token);
					$log.info(response.config.url + ' ' + response.status + ' Got dirty flag ' + response.headers('x-user-dirty') + ', updating local user (' + token + ')');
				} else {
					AuthService.tokenUpdated(token);
				}
			}
			return response;
		}
	};
}
