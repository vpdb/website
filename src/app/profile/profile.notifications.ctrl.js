export default class ProfileNotificationsCtrl {

	/**
	 * Class constructor
	 * @param {App} App
	 * @param {AuthService} AuthService
	 * @param {ApiHelper} ApiHelper
	 * @param ProfileResource
	 */
	constructor(App, AuthService, ApiHelper, ProfileResource) {

		this.App = App;
		this.AuthService = AuthService;
		this.ApiHelper = ApiHelper;
		this.ProfileResource = ProfileResource;

		this.init();
	}

	init() {
		this.updatedPreferences = this.AuthService.getUser().preferences || {};
	}

	updateUserPreferences() {
		this.ProfileResource.patch({ preferences: this.updatedPreferences }, user => {

			this.App.showNotification('Notification Preferences successfully saved');
			this.AuthService.saveUser(user);
			this.ApiHelper.clearErrors(this);
			this.init();

		}, this.ApiHelper.handleErrors(this));
	}
}