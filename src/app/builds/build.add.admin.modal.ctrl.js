import { pick } from 'lodash';

export default class BuildAddAdminModalCtrl {

	/**
	 * Class constructor
	 * @param $uibModal
	 * @param $uibModalInstance
	 * @param {App} App
	 * @param {ApiHelper} ApiHelper
	 * @param BuildResource
	 * @param {BootstrapPatcher} BootstrapPatcher
	 * @ngInject
	 */
	constructor($uibModal, $uibModalInstance, App, ApiHelper, BuildResource, BootstrapPatcher) {

		this.$uibModal = $uibModal;
		this.$uibModalInstance = $uibModalInstance;
		this.App = App;
		this.ApiHelper = ApiHelper;
		this.BuildResource = BuildResource;

		BootstrapPatcher.patchCalendar();

		this.build = {};
		this.platforms = [ { id: 'vp', label: 'Visual Pinball' } ];
		this.types = [
			{ id: 'release', label: 'Official Release' },
			{ id: 'experimental', label: 'Experimental Build' },
			{ id: 'nightly', label: 'Nightly Build' }
		];
	}

	submit() {
		const data = pick(this.build, ['id', 'platform', 'major_version', 'label', 'download_url', 'support_url', 'built_at', 'description', 'type', 'is_range', 'is_active']);
		this.BuildResource.save(data, build => {
			this.BuildResource.update({ id: build.id }, { is_active: true }, () => {
				this.$uibModalInstance.close();
				this.App.showNotification('Successfully added build.');

			}, this.ApiHelper.handleErrors(this));
		}, this.ApiHelper.handleErrors(this));
	}

	openCalendar($event) {
		$event.preventDefault();
		$event.stopPropagation();
		this.calendarOpened = true;
	}
}