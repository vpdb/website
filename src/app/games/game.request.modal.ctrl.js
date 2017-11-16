export default class GameRequestModalCtrl {

	/**
	 * @param $uibModalInstance
	 * @param {ApiHelper} ApiHelper
	 * @param {ModalService} ModalService
	 * @param GameRequestResource
	 * @ngInject
	 */
	constructor($uibModalInstance, ApiHelper, ModalService, GameRequestResource) {

		this.$uibModalInstance = $uibModalInstance;
		this.ApiHelper = ApiHelper;
		this.GameRequestResource = GameRequestResource;
		this.ModalService = ModalService;

		this.gameRequest = {};
		this.submitting = false;
	}

	submit() {
		this.submitting = true;
		this.GameRequestResource.save(this.gameRequest, gameRequest => {
			this.submitting = false;
			this.$uibModalInstance.dismiss();

			// show success msg
			this.ModalService.info({
				icon: 'check-circle',
				title: 'Game Requested!',
				subtitle: gameRequest.ipdb_title,
				message: 'The game has been successfully requested. We\'ll keep you posted!'
			});

		}, this.ApiHelper.handleErrors(this, () => this.submitting = false));
	}
}