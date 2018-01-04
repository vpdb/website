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
import traverse from 'traverse';
import { forEach, isArray, includes, map, uniqBy, isString, isObject, isEmpty, keys, filter } from 'lodash';

/**
 * Manages all authentication related tasks.
 *
 * @author freezy <freezy@vpdb.io>
 */
export default class AuthService {

	/**
	 * @param $window
	 * @param $localStorage
	 * @param $rootScope
	 * @param $location
	 * @param $http
	 * @param $state
	 * @param $timeout
	 * @param $log
	 * @param {App} App
	 * @param {ApiHelper} ApiHelper
	 * @param {Config} Config
	 * @param {ConfigService} ConfigService
	 * @param TokenResource
	 * @param ProfileResource
	 * @ngInject
	 */
	constructor($window, $localStorage, $rootScope, $location, $http, $state, $timeout, $log,
				App, ApiHelper, Config, ConfigService, TokenResource, ProfileResource) {

		this.$window = $window;
		this.$localStorage = $localStorage;
		this.$rootScope = $rootScope;
		this.$location = $location;
		this.$http = $http;
		this.$state = $state;
		this.$timeout = $timeout;
		this.$log = $log;
		this.App = App;
		this.Config = Config;
		this.ApiHelper = ApiHelper;
		this.ConfigService = ConfigService;
		this.TokenResource = TokenResource;
		this.ProfileResource = ProfileResource;

		this.timeout = null;
		this.isAuthenticating = false;
		this.authCallbacks = [];

		this.user = this.getUser();
		this.isAuthenticated = !!this.user;
		this.permissions = this.user ? this.user.permissions : null;
		this.roles = this.user ? this.user.roles: null;

		// save user when updated
		this.$rootScope.$on('userUpdated', (event, user) => this.saveUser(user));
	}

	/**
	 * Executed after successful API authentication using where we receive
	 * the user object along with the JWT.
	 *
	 * @param {{ expires:string, token:string, user:object }} result Object after successful authentication
	 */
	authenticated(result) {

		const claims = angular.fromJson(this.$window.atob(result.token.split('.')[1]));

		if (claims.irt === false) {
			this.$localStorage.initialJwt = result.token;
			this.$localStorage.initialTokenExpires = new Date(claims.exp).getTime();
			this.$localStorage.initialTokenCreatedLocal = new Date().getTime();
			this.$localStorage.initialTokenCreatedServer = new Date(claims.iat).getTime();
		}
		this.saveToken(result.token);
		this.saveUser(result.user);
	}

	/**
	 * Executed after successful OAuth authentication using a callback URL
	 * where we only retrieve the token from the view and need to make
	 * further requests for user info.
	 *
	 * @param {string} token JSON web token
	 */
	tokenReceived(token) {

		this.saveToken(token);
		this.$rootScope.$broadcast('updateUser');
	}

	/**
	 * Executed after token refresh, where only the token but not the user
	 * is updated.
	 * @param {string} token JSON web token
	 */
	tokenUpdated(token) {
		// only update if there already is a token. this is to avoid refreshing the token
		// when the server didn't send a refresh token but browser still passes the header
		// due to a 302.
		if (this.hasToken()) {
			this.saveToken(token);
		}
	}

	/**
	 * Retrieves a login token for future auto-login.
	 */
	rememberMe() {
		this.TokenResource.save({ type: 'login' }, token => {
			this.$localStorage.loginToken = token;
		}, this.ApiHelper.handleErrorsInDialog('Error creating login token.'));
	}

	/**
	 * Clears token, resulting in not being authenticated anymore.
	 */
	logout() {

		const done = () => {
			this.deleteToken();
			this.$location.url('/');
		};

		if (this.$localStorage.loginToken) {
			this.TokenResource.delete({ id: this.$localStorage.loginToken.id }, () => {
				delete this.$localStorage.loginToken;
				done();

			}, this.ApiHelper.handleErrorsInDialog('Error deleting login token.', done));

		} else {
			done();
		}
	}

	/**
	 * Checks whether the currently logged user has a given permission.
	 * Returns false if not logged.
	 *
	 * @param {string} resourcePermission Permission to check, e.g. "users/view"
	 * @return {boolean} True if user has permission, false otherwise.
	 */
	hasPermission(resourcePermission) {
		if (!this.isAuthenticated) {
			return false;
		}
		const p = resourcePermission.split('/');
		const resource = p[0];
		const permission = p[1];
		if (resource === '*') {
			if (this.permissions) {
				for (let key in this.permissions) {
					if (!this.permissions.hasOwnProperty(key)) {
						continue;
					}
					if (includes(this.permissions[key], permission)) {
						return true;
					}
				}
			}
			return false;
		} else {
			return this.permissions && includes(this.permissions[resource], permission);
		}
	}

	/**
	 * Checks whether the currently logged user has a given role.
	 * Returns false if not logged.
	 *
	 * @param {string|string[]} role Role to match. If multiple given, at least one must match.
	 * @return {boolean} True if user has role, false otherwise.
	 */
	hasRole(role) {
		if (isArray(role)) {
			for (let i = 0; i < role.length; i++) {
				if (this.roles && includes(this.roles, role[i])) {
					return true;
				}
			}
			return false;
		} else {
			return this.roles && includes(this.roles, role);
		}
	}

	/**
	 * Checks whether the currently logged user is author of the given release.
	 * @param release Release to check
	 * @return {boolean} True if author, false otherwise.
	 */
	isAuthor(release) {
		if (!release || !this.isAuthenticated) {
			return false;
		}
		const authorIds = map(release.authors, 'user.id');
		if (release.created_by) {
			authorIds.push(release.created_by.id);
		}
		return includes(authorIds, this.user.id);
	}

	/**
	 * Returns the user from browser storage.
	 * @return {Object}
	 */
	getUser() {
		return this.$localStorage.user;
	}

	/**
	 * Reloads the user profile data from the server
	 * @param {function(err:Error, user:Object=)} callback Error or refreshed user
	 */
	refreshUser(callback) {
		this.ProfileResource.get(user => {
			this.saveUser(user);
			if (callback) {
				callback(null, user);
			}
		}, err => {
			if (callback) {
				callback(err);
			}
			console.log('Error retrieving user profile: %s', err);
		});
	}

	/**
	 * Saves the user data to browser storage. Called after user profile update
	 * or successful authentication.
	 * @param user User to save
	 */
	saveUser(user) {
		this.$localStorage.user = user;
		this.isAuthenticated = true;
		this.user = user;
		this.permissions = user.permissions;
		this.roles = user.roles;
		this.$rootScope.$broadcast('user', user);
	}

	/**
	 * Checks if the current JWT is expired.
	 * @return {boolean} True if no token set, false otherwise.
	 */
	isTokenExpired() {
		if (!this.$localStorage.tokenExpires) {
			return true;
		}
		const timeDiff = this.$localStorage.tokenCreatedLocal - this.$localStorage.tokenCreatedServer;
		return this.$localStorage.tokenExpires + timeDiff < new Date().getTime();
	}

	/**
	 * Checks if there is a valid token. If there is an expired token, it
	 * is deleted first.
	 * @return {boolean} True if token exists and not expired, false otherwise.
	 */
	hasToken() {
		if (this.isTokenExpired()) {
			this.deleteToken();
			return false;
		}
		return !!this.$localStorage.jwt;
	}

	/**
	 * Checks if there is a valid login token.
	 * @return {boolean} True if login token exists, "remember me" is disabled and the token is not expired.
	 */
	hasLoginToken() {
		if (!this.$localStorage.loginToken || !this.$localStorage.rememberMe) {
			return false;
		}
		if (!this.$localStorage.loginToken.is_active) {
			return false;
		}
		return new Date(this.$localStorage.loginToken.expires_at).getTime() > new Date().getTime();
	}

	/**
	 * Returns the token from browser storage.
	 * @return {string} The JWT
	 */
	getToken() {
		return this.$localStorage.jwt;
	}

	/**
	 * Returns the login token from browser storage.
	 * @return {string} The login token
	 */
	getLoginToken() {
		return this.$localStorage.loginToken.token;
	}

	/**
	 * Clears the login token.
	 */
	clearLoginToken() {
		delete this.$localStorage.loginToken;
	}

	/**
	 * Saves the token to browser storage.
	 * @param {string} token JWT
	 * @return {string} User ID stored in the token (Issuer Claim)
	 */
	saveToken(token) {

		const claims = angular.fromJson(this.$window.atob(token.split('.')[1]));

		this.$localStorage.jwt = token;
		this.$localStorage.tokenExpires = new Date(claims.exp).getTime();
		this.$localStorage.tokenCreatedLocal = new Date().getTime();
		this.$localStorage.tokenCreatedServer = new Date(claims.iat).getTime();

		// enable timeout notification
		if (this.timeout) {
			this.$timeout.cancel(this.timeout);
		}
		if (!this.$localStorage.rememberMe) {
			this.timeout = this.$timeout(() => {
				this.deleteToken();
				this.App.showLoginTimeoutMessage();
			}, this.$localStorage.tokenExpires - this.$localStorage.tokenCreatedServer);
		}

		return claims.iss;
	}

	/**
	 * Removes the token from browser storage.
	 */
	deleteToken() {
		this.user = null;
		this.isAuthenticated = false;
		delete this.permissions;
		delete this.roles;

		delete this.$localStorage.jwt;
		delete this.$localStorage.user;
		delete this.$localStorage.tokenExpires;
		delete this.$localStorage.tokenCreatedLocal;
		delete this.$localStorage.tokenCreatedServer;

		delete this.$localStorage.initialJwt;
		delete this.$localStorage.initialTokenExpires;
		delete this.$localStorage.initialTokenCreatedLocal;
		delete this.$localStorage.initialTokenCreatedServer;

		this.$rootScope.$broadcast('user', null);
	}

	/**
	 * Traverses an object and collects all values of the `url` property.
	 * @param {object} obj Object to deep-traverse
	 * @param {boolean} [fetch] If set, directly fetch the tokens
	 * @return {AuthService}
	 */
	collectUrlProps(obj, fetch) {
		this.paths = this.paths || [];
		const paths = [];
		traverse.forEach(obj, function(value) {
			if (this.key === 'url' && value) {
				paths.push(value);
			}
		});
		this.paths = uniqBy(paths.concat(this.paths));
		this.$log.debug('AuthService: Added %d URLs to be collected.', this.paths.length);
		if (fetch) {
			// wait one digestion cycle so all paths can be added before collecting tokens
			this.$timeout(() => this.fetchUrlTokens(), 0);
		}
		return this;
	}

	/**
	 * Requests storage tokens for previously collected URLs.
	 * @see #collectUrlProps
	 * @param {string[]} [paths]
	 * @param {function(err:Error, {token:string, expires:string, user:object}=)} [callback]
	 * @return {AuthService}
	 */
	fetchUrlTokens(paths, callback) {
		paths = paths || this.paths;
		if (!isString(paths) && (!isObject(paths) || keys(paths).length === 0)) {
			return this;
		}
		this.$log.debug('AuthService: Collecting tokens for %d URLs.', paths.length);
		this.$http({
			method: 'POST',
			url: this.ConfigService.storageUri('/v1/authenticate'),
			data: { paths: paths }
		}).then(response => {
			this.$log.debug('AuthService: Tokens collected.', response.data);
			if (callback) {
				this.$log.debug('AuthService: Returning through provided callback.');
				return callback(null, response.data);
			}
			this.storageTokens = response.data;
			this.paths = [];
			if (this.storageTokenCallbacks) {
				this.$log.debug('AuthService: Executing storage token callbacks.');
				forEach(response.data, (token, path) => {
					if (this.storageTokenCallbacks[path]) {
						this.storageTokenCallbacks[path](token);
						delete this.storageTokenCallbacks[path];
					}
				});
			}
		}).catch(response => {
			if (callback) {
				callback(response, data);
			}
			this.$log.error('Error fetching tokens: ' + response.status);
			this.$log.error(response);
		});
		return this;
	}

	/**
	 * Appends the `token` parameter to an URL from previously
	 * requested storage tokens.
	 *
	 * This is for resources where we can't put a token into the header
	 * because of the browser doing the request (like image URLs).
	 *
	 * @param {string} url
	 * @param {function(url:string)} callback
	 * @return {AuthService}
	 */
	addUrlToken(url, callback) {
		if (this.storageTokens && this.storageTokens[url]) {
			this.$log.log('AuthService: already have storage token.');
			return callback(url + (~url.indexOf('?') ? '&' : '?') + 'token=' + this.storageTokens[url]);
		}
		if (!includes(this.paths, url)) {
			return this.$log.error('AuthService: Path "%s" neither in collected paths nor in received tokens. Might forgot to collect URL props on some object?', url);
		}
		this.$log.debug('AuthService: Adding callback for url %s', url);
		this.storageTokenCallbacks = this.storageTokenCallbacks || [];
		this.storageTokenCallbacks[url] = token => {
			this.$log.debug('AuthService: got storage token: %s', token);
			callback(url + (~url.indexOf('?') ? '&' : '?') + 'token=' + token);
		};
		return this;
	}

	/**
	 * Returns the authorization header from the app configuration.
	 * @return {string}
	 */
	getAuthHeader() {
		return this.Config.authHeader;
	}

	/**
	 * Returns authentication providers. If a user is supplied, only
	 * the providers of the user are returned.
	 *
	 * @param {object} [user] If set, only return providers of the user
	 */
	getProviders(user) {
		let providers = [];

		if (this.Config.authProviders.google) {
			providers.push({
				id: 'google',
				icon: 'google-g',
				name: 'Google',
				url: '/auth/google'
			});
		}
		if (this.Config.authProviders.github) {
			providers.push({
				id: 'github',
				icon: 'github',
				name: 'GitHub',
				url: '/auth/github'
			});
		}
		if (isArray(this.Config.authProviders.ipboard)) {
			providers = providers.concat(this.Config.authProviders.ipboard);
		}

		if (user) {
			return filter(providers, provider => {
				return user[provider.id] && !isEmpty(user[provider.id]);
			});
		} else {
			return providers;
		}
	}

	/**
	 * Runs previously saved post login actions.
	 */
	runPostLoginActions() {
		if (isArray(this.$localStorage.postLoginActions)) {
			this.$localStorage.postLoginActions.forEach(postLoginAction => {
				switch (postLoginAction.action) {
					case 'redirect':
						this.$state.go(postLoginAction.params.stateName, postLoginAction.params.stateParams);
						break;
					case 'downloadFile':
						this.$rootScope.$broadcast('downloadFile', postLoginAction.params);
						break;
					default:
						return;
				}
			});
		}
		this.$localStorage.postLoginActions = [];
	}

	/**
	 * Adds an action to be executed after successful login
	 * @param {string} action
	 * @param {object} params
	 */
	addPostLoginAction(action, params) {
		if (!this.$localStorage.postLoginActions) {
			this.$localStorage.postLoginActions = [];
		}
		this.$localStorage.postLoginActions.push({ action: action, params: params });
	}

	/**
	 * Sets the login page to be redirected to the current page upon successful login.
	 */
	setPostLoginRedirect() {
		this.addPostLoginAction('redirect', { stateName: this.$state.current.name, stateParams: this.$state.params });
	}
}