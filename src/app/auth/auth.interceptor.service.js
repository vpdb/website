/**
 * A service which adds the bearer token to backend API requests.
 *
 * The logic is the following:
 *
 * 	- If the request is hitting the VPDB backend
 * 	   - If there is an auth token in local storage
 * 	     - Then add the token to the header
 * 	   - Elseif there is an (auto)login token in local storage
 * 	      - Then retrieve an auth token first and add it to the header
 * 	   - If there is currently an authentication request going on
 * 	     - Subscribe to it and add the token to the header on result
 *
 * This interceptor also checks the `x-token-refresh` header and updates
 * the token accordingly.
 *
 * @see https://stackoverflow.com/questions/28638600/angularjs-http-interceptor-class-es6-loses-binding-to-this
 * @author freezy <freezy@vpdb.io>
 */
export default class AuthInterceptorService {

	/**
	 * @param $injector
	 * @param $q
	 * @param {ConfigService} ConfigService
	 * @ngInject
	 */
	constructor($injector, $q, ConfigService) {

		// noinspection JSUnusedGlobalSymbols
		this.request = (config) => {

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
						console.debug('[AuthInterceptor] Adding available auth token, resolving.');
						resolve(config);

					// check for auto login token
					} else if (!ConfigService.isAuthUrl(config.url) && AuthService.hasLoginToken()) {

						// if already authenticating, don't do launch another request but wait for the other to finish
						if (AuthService.isAuthenticating) {
							console.warn('[AuthInterceptor] Got autologin token, but there already seems to be a request. Adding to callback.');

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
		};

		// noinspection JSUnusedGlobalSymbols
		this.response = (response) => {
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
					console.log(response.config.url + ' ' + response.status + ' Got dirty flag ' + response.headers('x-user-dirty') + ', updating local user (' + token + ')');
				} else {
					AuthService.tokenUpdated(token);
				}
			}
			return response;
		};
	}
}