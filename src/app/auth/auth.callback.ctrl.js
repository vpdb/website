export default class AuthCallbackCtrl {

	/**
	 * Class constructor
	 * @param $stateParams
	 * @param $location
	 * @param $localStorage
	 * @param {AuthService} AuthService
	 * @param {AuthResource} AuthResource
	 * @param {ModalService} ModalService
	 */
	constructor($stateParams, $location, $localStorage, AuthService, AuthResource, ModalService) {

		if ($location.search().code) {
			AuthResource.authenticateCallback($stateParams, result => {
				AuthService.authenticated(result);
				AuthService.runPostLoginActions();

				if ($localStorage.rememberMe) {
					AuthService.rememberMe();
				}

			}, function(err) {
				ModalService.error({
					subtitle: 'Could not login.',
					message: err.data.error
				});
			});

		} else {
			this.error = $location.search();
		}
	}
}