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