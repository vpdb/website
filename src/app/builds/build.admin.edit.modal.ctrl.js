import { cloneDeep, pick } from 'lodash';

export default class BuildAdminEditModalCtrl {

	/**
	 * Class constructor
	 * @param $uibModalInstance
	 * @param {App} App
	 * @param {ApiHelper} ApiHelper
	 * @param {BootstrapPatcher} BootstrapPatcher
	 * @param {BuildResource} BuildResource
	 * @param {ReleaseResource} ReleaseResource
	 * @param build
	 */
	constructor($uibModalInstance, App, ApiHelper, BootstrapPatcher, BuildResource, ReleaseResource, build) {

		this.$uibModalInstance = $uibModalInstance;
		this.App = App;
		this.ApiHelper = ApiHelper;
		this.BuildResource = BuildResource;

		BootstrapPatcher.patchCalendar();

		this.id = build.id;
		this.build = build;
		this.originalBuild = build;
		this.platforms = [ { id: 'vp', label: 'Visual Pinball' } ];
		this.types = [
			{ id: 'release', label: 'Official Release' },
			{ id: 'experimental', label: 'Experimental Build' },
			{ id: 'nightly', label: 'Nightly Build' }
		];

		this.BuildResource.get({ id: build.id }, b => {
			build = b;
			this.build = cloneDeep(build);
			this.releases = ReleaseResource.query({
				moderation: 'all',
				builds: build.id,
				thumb_format: 'square'
			}, ApiHelper.handlePagination(this));
		});
	}

	save() {
		const data = pick(this.build, ["id", "platform", "major_version", "label", "download_url", "support_url", "built_at", "description", "type", "is_range", "is_active"]);
		this.BuildResource.update({ id: this.id }, data, updatedBuild => {
			this.$uibModalInstance.close(updatedBuild);
			this.App.showNotification('Successfully updated build.');

		}, this.ApiHelper.handleErrors(this));
	}

	delete(build) {
		this.BuildResource.delete({ id: build.id }, () => {
			this.App.showNotification('Successfully deleted build.');
			this.$uibModalInstance.close();

		}, this.ApiHelper.handleErrorsInDialog('Error deleting build'));
	}

	openCalendar($event) {
		$event.preventDefault();
		$event.stopPropagation();
		this.calendarOpened = true;
	}

	reset() {
		this.build = cloneDeep(this.originalBuild);
	}
}