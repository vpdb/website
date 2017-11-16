export default class BuildAddModalCtrl {

	/**
	 * @param $uibModalInstance
	 * @param {ApiHelper} ApiHelper
	 * @param BuildResource
	 * @param {BootstrapPatcher} BootstrapPatcher
	 * @ngInject
	 */
	constructor($uibModalInstance, ApiHelper, BuildResource, BootstrapPatcher) {

		BootstrapPatcher.patchCalendar();

		this.$uibModalInstance = $uibModalInstance;
		this.ApiHelper = ApiHelper;
		this.BuildResource = BuildResource;

		this.build = {
			platform: 'vp'
		};
		this.types = [ 'release', 'nightly', 'experimental' ];
		this.majorVersions = [
			{ label: 'v8.x.x', value: '8' },
			{ label: 'v9.x.x', value: '9' },
			{ label: 'v10.x.x', value: '10' } ];
	}

	openCalendar($event) {
		$event.preventDefault();
		$event.stopPropagation();
		this.calendarOpened = true;
	};

	add() {
		this.BuildResource.save(this.build, build => {
			this.$uibModalInstance.close(build);

		}, this.ApiHelper.handleErrors(this));
	}
}