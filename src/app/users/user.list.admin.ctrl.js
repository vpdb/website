import { includes, debounce } from 'lodash';

import UserEditAdminModalTpl from './user.edit.admin.modal.pug';

export default class UserListAdminCtrl {

	/**
	 * Class constructor
	 * @param $scope
	 * @param $uibModal
	 * @param {App} App
	 * @param {TrackerService} TrackerService
	 * @param UserResource
	 * @param RolesResource
	 */
	constructor($scope, $uibModal, TrackerService, App, UserResource, RolesResource) {

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
			templateUrl: UserEditAdminModalTpl,
			controller: 'UserEditAdminModalCtrl',
			controllerAs: 'vm',
			size: 'lg',
			resolve: {
				user: () => user,
				roles: () => this.roles
			}
		});
	}

	refresh() {
		const query = {};
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