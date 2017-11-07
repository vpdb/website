export default class ModalCtrl {

	constructor($scope, $timeout, data) {
		this.data = data;
		$timeout(function() {
			$scope.$broadcast('elastic:adjust');
		}, 0);
	}
}