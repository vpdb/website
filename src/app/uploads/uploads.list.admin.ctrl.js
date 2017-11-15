export default class UploadsListAdminCtrl {

	/**
	 * Class constructor
	 * @param $scope
	 * @param {App} App
	 * @param {TrackerService} TrackerService
	 */
	constructor($scope, App, TrackerService) {

		App.theme('light');
		App.setTitle('Uploads');
		App.setMenu('admin');
		TrackerService.trackPage();

		this.$scope = $scope;

		this.$scope.filters = { status: 'pending' };
		this.$scope.numItems = 5;
	}

	refresh() {
		this.$scope.$broadcast('refresh');
	}
}