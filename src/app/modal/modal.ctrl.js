export default class ModalCtrl {

	/**
	 * @param $scope
	 * @param $timeout
	 * @param data
	 * @ngInject
	 */
	constructor($scope, $timeout, data) {
		this.data = data;
		$timeout(() =>$scope.$broadcast('elastic:adjust'), 0);
	}
}