export default class Error404Ctrl {

	/**
	 * @param $stateParams
	 * @ngInject
	 */
	constructor($stateParams) {
		this.url = $stateParams.url;
	}
}