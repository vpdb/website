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
	 * Class constructor
	 * @param $window
	 * @param $localStorage
	 * @param $rootScope
	 * @param $location
	 * @param $http
	 * @param $state
	 * @param $timeout
	 * @param {App} App
	 * @param {Config} Config
	 * @param {ApiHelper} ApiHelper
	 * @param {ConfigService} ConfigService
	 * @param {TokenResource} TokenResource
	 * @param {ProfileResource} ProfileResource
	 */
	constructor($window, $localStorage, $rootScope, $location, $http, $state, $timeout,
				App, Config, ApiHelper, ConfigService, TokenResource, ProfileResource) {

		this.$window = $window;
		this.$localStorage = $localStorage;
		this.$rootScope = $rootScope;
		this.$location = $location;
		this.$http = $http;
		this.$state = $state;
		this.$timeout = $timeout;
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
		this.$rootScope.$on('userUpdated', (event, user) => {
			this.saveUser(user);
		});
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
	 * @param token JWT, as string
	 */
	tokenReceived(token) {

		this.saveToken(token);
		this.$rootScope.$broadcast('updateUser');
	}

	/**
	 * Executed after token refresh, where only the token but not the user
	 * is updated.
	 * @param token JWT, as string
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
		}, this.ApiHelper.handleErrorsInDialog(this.$rootScope, 'Error creating login token.'));
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

			}, this.ApiHelper.handleErrorsInDialog(this.$rootScope, 'Error deleting login token.', done));

		} else {
			done();
		}
	}

	/**
	 * Checks whether the currently logged user has a given permission.
	 * Returns false if not logged.
	 *
	 * @param {string} resourcePermission Permission to check, e.g. "users/view"
	 * @returns {boolean} True if user has permission, false otherwise.
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
	 * @returns {boolean} True if user has role, false otherwise.
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
	 * @returns {Object}
	 */
	getUser() {
		return this.$localStorage.user;
	}

	/**
	 * Reloads the user profile data from the server
	 * @returns {promise}
	 */
	refreshUser(callback) {
		return this.ProfileResource.get(user => {
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
	 * @param user
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
	 * Returns true if no token set.
	 *
	 * @returns {boolean}
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
	 *
	 * @returns {boolean}
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
	 * @returns {boolean}
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
	 * @returns {*}
	 */
	getToken() {
		return this.$localStorage.jwt;
	}

	/**
	 * Returns the login token from browser storage.
	 * @returns {*}
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
	 * @param {String} token JWT
	 * @returns {String} User ID stored in the token (Issuer Claim)
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
	 *
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
		if (fetch) {
			this.fetchUrlTokens();
		}
		return this;
	}

	/**
	 * Requests storage tokens for previously collected URLs.
	 * @see #collectUrlProps
	 * @param {array} [paths]
	 * @param {function} [callback]
	 * @return {AuthService}
	 */
	fetchUrlTokens(paths, callback) {
		paths = paths || this.paths;
		if (!isString(paths) && (!isObject(paths) || keys(paths).length === 0)) {
			return this;
		}
		this.$http({
			method: 'POST',
			url: this.ConfigService.storageUri('/authenticate'),
			data: { paths: paths }
		}).then(data => {
			if (callback) {
				return callback(null, data);
			}
			this.storageTokens = data;
			this.paths = [];
			if (this.storageTokenCallbacks) {
				forEach(data, (token, path) => {
					if (this.storageTokenCallbacks[path]) {
						this.storageTokenCallbacks[path](token);
						delete this.storageTokenCallbacks[path];
					}
				});
			}
		}, (data, status) => {
			if (callback) {
				callback(status, data);
			}
			console.error('Error fetching tokens: ' + status);
			console.error(data);
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
	 * @param {function} callback
	 * @return {AuthService}
	 */
	addUrlToken(url, callback) {
		if (this.storageTokens && this.storageTokens[url]) {
			console.log('already have storage token.');
			return callback(url + (~url.indexOf('?') ? '&' : '?') + 'token=' + this.storageTokens[url]);
		}
		if (!includes(this.paths, url)) {
			return console.error('Path "%s" neither in collected paths nor in received tokens. Might forgot to collect URL props on some object?', url);
		}
		console.log('getting storage token.');
		this.storageTokenCallbacks = this.storageTokenCallbacks || [];
		this.storageTokenCallbacks[url] = token => {
			console.log('got storage token: %s', token);
			callback(url + (~url.indexOf('?') ? '&' : '?') + 'token=' + token);
		};
		return this;
	}

	/**
	 * Returns the authorization header from the app configuration.
	 * @returns {string}
	 */
	getAuthHeader() {
		return this.Config.authHeader;
	}

	/**
	 * Returns authentication providers. If a user is supplied, only
	 * the providers of the user are returned.
	 *
	 * @param {User} [user]
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
	 * @param action
	 * @param params
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