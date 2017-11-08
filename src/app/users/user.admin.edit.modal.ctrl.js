import angular from 'angular';
import { pick, cloneDeep } from 'lodash';

export default class UserAdminEditModalCtrl {

	/**
	 * Class constructor
	 * @param $uibModalInstance
	 * @param {App} App
	 * @param {AuthService} AuthService
	 * @param {ApiHelper} ApiHelper
	 * @param {UserResource} UserResource
	 * @param {UserConfirmationResource} UserConfirmationResource
	 * @param {PlanResource} PlanResource
	 * @param user
	 * @param roles
	 */
	constructor($uibModalInstance, App, AuthService, ApiHelper,
				UserResource, UserConfirmationResource, PlanResource, user, roles) {

		this.$uibModalInstance = $uibModalInstance;
		this.App = App;
		this.AuthService = AuthService;
		this.ApiHelper = ApiHelper;
		this.UserResource = UserResource;
		this.UserConfirmationResource = UserConfirmationResource;
		this.roles = roles;

		this.fields = [ 'id', 'name', 'email', 'username', 'is_active', 'roles', '_plan' ];

		this.originalUser = user;
		this.originalName = user.name;
		this.roles = roles;

		this.reset();

		this.plans = PlanResource.query();
	}

	toggleSelection(roleName) {
		const idx = this.user.roles.indexOf(roleName);
		// is currently selected
		if (idx > -1) {
			this.user.roles.splice(idx, 1);
		}
		// is newly selected
		else {
			this.user.roles.push(roleName);
		}
	};

	save() {
		const updatedUser = this.UserResource.update({ userid: this.user.id }, this.user, () => {
			angular.copy(updatedUser, user);
			if (this.AuthService.user.id === this.user.id) {
				this.AuthService.user = updatedUser;
			}
			this.$uibModalInstance.close();
		}, this.ApiHelper.handleErrors(this));
	};

	sendConfirmation() {
		this.UserConfirmationResource.send({ userId: this.user.id }, {}, () => {
			this.App.showNotification('Notification mail sent.');

		}, this.ApiHelper.handleErrors(this));
	};

	reset() {
		const user = cloneDeep(this.originalUser);
		this.user = pick(user, this.fields);
		this.user._plan = user.plan.id;
	};
}