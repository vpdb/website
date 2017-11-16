export default class ProfileCtrl {

	/**
	 * @param $state
	 * @param $uibModal
	 * @param {AuthService} AuthService
	 * @ngInject
	 */
	constructor($state, $uibModal, AuthService) {

		this.$state = $state;
		this.$uibModal = $uibModal;
		this.AuthService = AuthService;
	}

	changeAvatar () {
		this.$uibModal.open({ templateUrl: 'modal/change-avatar.html' });
	}
}