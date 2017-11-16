import { pick, omit } from 'lodash';

import TokenCreateModalTpl from '../auth/token.create.modal.pug';

export default class ProfileSettingsCtrl {

	/**
	 * @param $scope
	 * @param $uibModal
	 * @param {App} App
	 * @param {AuthService} AuthService
	 * @param {ApiHelper} ApiHelper
	 * @param {ModalService} ModalService
	 * @param {TrackerService} TrackerService
	 * @param ProfileResource
	 * @param TokenResource
	 * @ngInject
	 */
	constructor($scope, $uibModal, App, AuthService, ApiHelper, ModalService, TrackerService,
				ProfileResource, TokenResource) {

		App.theme('dark');
		App.setTitle('Your Profile');
		TrackerService.trackPage();

		this.$uibModal = $uibModal;
		this.App = App;
		this.AuthService = AuthService;
		this.ApiHelper = ApiHelper;
		this.ModalService = ModalService;
		this.ProfileResource = ProfileResource;
		this.TokenResource = TokenResource;

		this.localUser = {};                                          // local user for changing password
		this.localCredentials = {};                                   // local credentials object
		this.tokens = [];

		$scope.$watch(() => this.AuthService.user, value => {
			this.updatedUser = pick(value, 'name', 'location', 'email');
		});

		this.fetchUser();
	}

	fetchUser() {
		this.AuthService.refreshUser(err => {

			if (err) {
				return console.error(err);
			}

			this.providers = this.AuthService.getProviders(this.AuthService.user);
			const allProviders = this.AuthService.getProviders();

			if (this.AuthService.user.plan.app_tokens_enabled) {
				this.tokens = this.TokenResource.query({ type: 'access' });
			}

			this.showTokenAlert = false;

			// pre-fill (local) username from first provider we find.
			let i, provider;
			for (i = 0; i < allProviders.length; i++) {
				provider = allProviders[i];
				if (this.AuthService.user[provider.id] && this.AuthService.user[provider.id].username) {
					this.localCredentials.username = this.AuthService.user[provider.id].username;
					break;
				}
			}
		});
	}

	/**
	 * First block: Update "public" user profile data
	 */
	updateUserProfile() {

		const updatedUser = this.AuthService.user.email_status && this.AuthService.user.email_status.code === 'pending_update' ? omit(this.updatedUser, 'email') : this.updatedUser;
		this.ProfileResource.patch(updatedUser, user => {

			if (user.email_status && user.email_status.code === 'pending_update' && !this.AuthService.user.email_status) {
				this.App.showNotification('User Profile successfully saved.<br>A confirmation mail has been sent to your new email address so we can make sure we got the right one.', 10000);
			} else {
				this.App.showNotification('User Profile successfully saved.');
			}
			this.AuthService.saveUser(user);
			this.ApiHelper.clearErrors(this);

		}, this.ApiHelper.handleErrors(this));
	}


	/**
	 * CHANGE PASSWORD
	 * Updates local password.
	 */
	changePassword() {

		this.ApiHelper.clearErrors(this);

		// password match is checked locally, no such test on server side.
		if (!this.checkPasswordConfirmation(this.localUser)) {
			return;
		}

		// update server side
		this.ProfileResource.patch({
			current_password: this.localUser.currentPassword,
			password: this.localUser.password1
		}, () => {
			this.localUser = {};
			this.ApiHelper.clearErrors(this);
			this.App.showNotification('Password successfully changed.', 3000);

		}, this.ApiHelper.handleErrors(this));
	}


	/**
	 * LOCAL CREDENTIALS
	 * Create new local credentials if the user was only registered via
	 * OAuth2.
	 */
	createLocalCredentials() {

		this.ApiHelper.clearErrors(this);

		// password match is checked locally, no such test on server side.
		if (!this.checkPasswordConfirmation(this.localCredentials)) {
			return;
		}

		// update server side
		this.ProfileResource.patch({
			username: this.localCredentials.username,
			password: this.localCredentials.password1
		}, function(user) {
			this.AuthService.saveUser(user);
			this.ApiHelper.clearErrors(this);
			this.App.showNotification('Local credentials successfully created. You may login with username <strong>' + this.localCredentials.username + '</strong> now.', 5000);

		}, this.ApiHelper.handleErrors(this));
	}

	abortEmailUpdate() {
		this.ModalService.question({
			title: 'Cancel Email Update?',
			message: 'You have asked to change your email address to "' + this.AuthService.user.email_status.value + '" but we\'re still waiting for you to confirm the mail we\'ve sent you.',
			question: 'Do you want to set your email back to "' + this.AuthService.user.email + '"?'
		}).result.then(() => {
			this.ProfileResource.patch({ email: this.AuthService.user.email }, user => {
				this.AuthService.saveUser(user);
				this.ApiHelper.clearErrors(this);
				this.App.showNotification('Email is set back to <b>' + this.AuthService.user.email + '</b>.');
			});
		});
	}

	createToken() {
		this.$uibModal.open({
			templateUrl: TokenCreateModalTpl,
			controller: 'TokenCreateModalCtrl',
			controllerAs: 'vm'

		}).result.then(token => {
			this.tokens.unshift(token);
			this.showTokenAlert = true;
		});
	}

	toggleToken(token) {
		this.TokenResource.update({ id: token.id }, { is_active: !token.is_active }, () => {
			token.is_active = !token.is_active;
		}, this.ApiHelper.handleErrorsInDialog('Error toggling token.'));
	}

	deleteToken(token) {
		return this.ModalService.question({
			title: 'Delete application access token',
			message: 'Any application or script using this token will no longer be able to access the VPDB API. You cannot undo this action.',
			question: 'Are you sure you want to delete this token?'
		}).result.then(() => {
			this.TokenResource.delete({ id: token.id }, () => {
				this.tokens.splice(this.tokens.indexOf(token), 1);
				this.App.showNotification('Token successfully deleted.');

			}, this.ApiHelper.handleErrorsInDialog('Error deleting token.'));
		}, () => {});
	}

	onTokenCopied() {
		this.App.showNotification('Token copied to clipboard.');
	}

	/**
	 * Checks that two passwords field are filled and equal and applies
	 * errors to scope.
	 *
	 * @param {object} credentials Objection containing `password1` and `password2`.
	 * @return {boolean} True on success, false otherwise.
	 */
	checkPasswordConfirmation(credentials) {
		if (!credentials.password1) {
			this.ApiHelper.setError(this, 'password', "You must provide your new password.");
			return false;
		}
		if (!credentials.password2) {
			this.ApiHelper.setError(this, 'password2', "You must confirm your new password.");
			return false;
		}
		if (credentials.password1 !== credentials.password2) {
			this.ApiHelper.setError(this, 'password2', "The second password must match the first password.");
			return false;
		}
		return true;
	}
}