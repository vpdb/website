export default class TagAddModalCtrl {

	/**
	 * @param $uibModalInstance
	 * @param {ApiHelper} ApiHelper
	 * @param TagResource
	 * @ngInject
	 */
	constructor($uibModalInstance, ApiHelper, TagResource) {

		this.$uibModalInstance = $uibModalInstance;
		this.ApiHelper = ApiHelper;
		this.TagResource = TagResource;

		this.tag = {};
	}

	create() {
		this.TagResource.save(this.tag, tag => {
			this.$uibModalInstance.close(tag);

		}, this.ApiHelper.handleErrors(this));
	}
}