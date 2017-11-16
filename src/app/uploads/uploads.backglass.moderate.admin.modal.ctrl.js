import { map } from 'lodash';

export default class UploadsBackglassModerateAdminModalCtrl {

	/**
	 * @param $uibModalInstance
	 * @param {App} App
	 * @param {ApiHelper} ApiHelper
	 * @param {AuthService} AuthService
	 * @param {UploadHelper} UploadHelper
	 * @param {DownloadService} DownloadService
	 * @param BackglassResource
	 * @param BackglassModerationResource
	 * @param params
	 * @ngInject
	 */
	constructor($uibModalInstance, App, ApiHelper, AuthService, UploadHelper, DownloadService,
				BackglassResource, BackglassModerationResource, params) {

		this.$uibModalInstance = $uibModalInstance;
		this.App = App;
		this.AuthService = AuthService;
		this.ApiHelper = ApiHelper;
		this.DownloadService = DownloadService;
		this.BackglassModerationResource = BackglassModerationResource;
		this.refresh = params.refresh;

		this.files = [];
		this.backglass = BackglassResource.get({ id: params.backglass.id, fields: 'moderation' }, backglass => {
			this.history = map(backglass.moderation.history, UploadHelper.mapHistory);
		});
	}

	downloadBackglass(file) {
		this.DownloadService.downloadFile(file);
	}

	refuse() {
		this.BackglassModerationResource.save({ id: this.backglass.id }, { action: 'refuse', message: this.message }, () => {
			this.$uibModalInstance.close();
			this.App.showNotification('Backglass successfully refused.');
			this.refresh();
		}, this.ApiHelper.handleErrors(this));
	}

	approve() {
		this.BackglassModerationResource.save({ id: this.backglass.id }, { action: 'approve', message: this.message }, () => {
			this.$uibModalInstance.close();
			this.App.showNotification('Backglass successfully approved.');
			this.refresh();
		}, this.ApiHelper.handleErrors(this));
	}

	moderate() {
		this.BackglassModerationResource.save({ id: this.backglass.id }, { action: 'moderate', message: this.message }, () => {
			this.$uibModalInstance.close();
			this.App.showNotification('Backglass successfully set back to pending.');
			this.refresh();
		}, this.ApiHelper.handleErrors(this));
	}
}