export default class TagAddModalCtrl {

	/**
	 * Class constructor
	 * @param $uibModalInstance
	 * @param {ApiHelper} ApiHelper
	 * @param TagResource
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