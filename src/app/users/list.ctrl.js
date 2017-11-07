import { includes, debounce } from 'lodash';

const editUserModalTpl = require('./edit.modal.pug')();

export default class AdminUserListCtrl {

	/**
	 * Class constructor
	 * @param $scope
	 * @param $uibModal
	 * @param {App} App
	 * @param {UserResource} UserResource
	 * @param {RolesResource} RolesResource
	 * @param {TrackerService} TrackerService
	 */
	constructor($scope, $uibModal, App, UserResource, RolesResource, TrackerService) {

		App.theme('light');
		App.setTitle('Users');
		App.setMenu('admin');

		this.$scope = $scope;
		this.$uibModal = $uibModal;
		this.UserResource = UserResource;
		this.RolesResource = RolesResource;
		TrackerService.trackPage();

		this.users = this.UserResource.query();
		this.roles = this.RolesResource.query();

		this.filterRole = [];
		this.firstLoad = true;
		this.query = '';

		$scope.$watch(() => this.query, debounce(() => {
			if (!this.firstLoad || this.query) {
				this.refresh();
			}
		}, 350), true);

		$scope.$on('dataToggleRole', (event, role) => {
			if (includes(this.filterRole, role)) {
				this.filterRole.splice(this.filterRole.indexOf(role), 1);
			} else {
				this.filterRole.push(role);
			}
			$scope.$apply();
			this.refresh();
		});
	}

	edit(user) {
		this.$uibModal.open({
			template: editUserModalTpl,
			controller: 'AdminUserEditCtrl',
			controllerAs: 'vm',
			size: 'lg',
			resolve: {
				user: () => user,
				roles: () => this.roles
			}
		});
	}

	refresh() {
		var query = {};
		if (!this.firstLoad || this.query) {
			query.q = this.query;
			this.firstLoad = false;
		}
		if (this.filterRole.length > 0) {
			query.roles = this.filterRole.join(',');
		}
		this.users = this.UserResource.query(query);
	}
}