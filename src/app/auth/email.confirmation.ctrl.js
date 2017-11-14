export default class EmailConfirmationCtrl {

	/**
	 * @param $state
	 * @param $stateParams
	 * @param {ApiHelper} ApiHelper
	 * @param {AuthService} AuthService
	 * @param {LoginService} LoginService
	 * @param {ModalFlashService} ModalFlashService
	 * @param {ProfileResource} ProfileResource
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