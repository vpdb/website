import { map } from 'lodash';

export default class BackglassEditModalCtrl {
	/**
	 * @param $uibModalInstance
	 * @param {App} App
	 * @param {AuthService} AuthService
	 * @param {ApiHelper} ApiHelper
	 * @param {GameResource} GameResource
	 * @param {BackglassResource} BackglassResource
	 * @param {ModalService} ModalService
	 * @param params
	 */
	constructor($uibModalInstance, App, ApiHelper, AuthService,
				GameResource, BackglassResource, ModalService, params) {

		this.$uibModalInstance = $uibModalInstance;

		this.App = App;
		this.AuthService = AuthService;
		this.ApiHelper = ApiHelper;
		this.GameResource = GameResource;
		this.BackglassResource = BackglassResource;
		this.ModalService = ModalService;

		this.params = params;
		this.backglass = params.backglass;
		this.game = params.game;

		this.reset();
	}

	findGame(val) {
		return this.GameResource.query({ q: val }).$promise;
	}

	gameSelected(item, model) {
		this.updatedBackglass._game = model.id;
	}

	reset() {
		this.updatedBackglass = map(this.backglass, [ 'description', 'acknowledgements']);
		this.updatedBackglass._game = this.game.id;
		this.query = this.game.title;
	}

	remove(backglass) {
		return this.ModalService.question({
			title: 'Delete Backglass',
			message: 'This is definitive. Backglass will be gone after that.',
			question: 'Are you sure?'
		}).result.then(() => {
			this.BackglassResource.delete({ id: backglass.id }, () => {
				this.$uibModalInstance.close(null);
			}, this.ApiHelper.handleErrorsInDialog('Error removing backglass.'));
		});
	}

	submit() {
		this.BackglassResource.update({ id: this.backglass.id }, this.updatedBackglass, () => {
			this.backglass.description = this.updatedBackglass.description;
			this.backglass.acknowledgements = this.updatedBackglass.acknowledgements;
			this.App.showNotification('Successfully updated backlass.');
			this.$uibModalInstance.close(this.game.id === this.updatedBackglass._game ? this.backglass : null);

		}, this.ApiHelper.handleErrors(this));
	}
}