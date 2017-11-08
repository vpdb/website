export default class TokenCreateModalCtrl {

	/**
	 * Class constructor
	 * @param $uibModalInstance
	 * @param {TokenResource} TokenResource
	 * @param {ApiHelper} ApiHelper
	 */
	constructor($uibModalInstance, TokenResource, ApiHelper) {

		this.$uibModalInstance = $uibModalInstance;
		this.TokenResource = TokenResource;
		this.ApiHelper = ApiHelper;

		this.token = { type: 'access' };
	}

	create() {
		this.TokenResource.save(this.token, token => {
			this.$uibModalInstance.close(token);

		}, this.ApiHelper.handleErrors(this, (scope, response) => {
			if (/password/i.test(response.data.error)) {
				scope.errors.password = response.data.error;
			}
		}));
	}
}