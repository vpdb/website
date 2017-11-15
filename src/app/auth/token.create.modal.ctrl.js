export default class TokenCreateModalCtrl {

	/**
	 * Class constructor
	 * @param $uibModalInstance
	 * @param {ApiHelper} ApiHelper
	 * @param TokenResource
	 */
	constructor($uibModalInstance, ApiHelper, TokenResource) {

		this.$uibModalInstance = $uibModalInstance;
		this.ApiHelper = ApiHelper;
		this.TokenResource = TokenResource;

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