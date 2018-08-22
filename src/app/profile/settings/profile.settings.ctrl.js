/*
 * VPDB - Virtual Pinball Database
 * Copyright (C) 2018 freezy <freezy@vpdb.io>
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.
 */

import angular from 'angular';
import { pick, omit } from 'lodash';

import TokenCreateModalTpl from './token.create.modal.pug';

export default class ProfileSettingsCtrl {

	/**
	 * @param $scope
	 * @param $uibModal
	 * @param $window
	 * @param $log
	 * @param {App} App
	 * @param {AuthService} AuthService
	 * @param {ApiHelper} ApiHelper
	 * @param {ConfigService} ConfigService
	 * @param {ModalService} ModalService
	 * @param {TrackerService} TrackerService
	 * @param ProfileResource
	 * @param TokenResource
	 * @ngInject
	 */
	constructor($scope, $uibModal, $window, $log, App, AuthService, ApiHelper, ConfigService, ModalService, TrackerService,
				ProfileResource, TokenResource) {

		App.theme('dark');
		App.setTitle('Your Profile');
		TrackerService.trackPage();

		this.$uibModal = $uibModal;
		this.$window = $window;
		this.$log = $log;
		this.App = App;
		this.AuthService = AuthService;
		this.ApiHelper = ApiHelper;
		this.ConfigService = ConfigService;
		this.ModalService = ModalService;
		this.ProfileResource = ProfileResource;
		this.TokenResource = TokenResource;

		this.localUser = {};                                          // local user for changing password
		this.localCredentials = {};                                   // local credentials object
		this.tokens = [];

		$scope.$watch(() => this.AuthService.user, value => {
			this.updatedUser = pick(value, [ 'name', 'location', 'email' ]);
		});

		this.fetchUser();

		this.unlinkedProviders = AuthService.getProviders(AuthService.user, true);
	}

	fetchUser() {
		this.AuthService.refreshUser(err => {

			if (err) {
				return this.$log.error(err);
			}

			// personal tokens
			if (this.AuthService.user.plan.app_tokens_enabled) {
				this.TokenResource.query({ type: 'personal', scopes: ['all'] }, tokens => {
					this.tokens = tokens.map(token => this.addTokenIcon(token));
					this.hasAppTokens = tokens.filter(token => token.scopes.includes('all')).length > 0;
					this.hasLoginTokens = tokens.filter(token => token.scopes.includes('login')).length > 0;
				});
			}
			this.showTokenAlert = false;


			// linked accounts
			this.providers = this.AuthService.getProviders(this.AuthService.user);
			const allProviders = this.AuthService.getProviders();

			// pre-fill (local) username from first provider we find.
			let i, provider;
			for (i = 0; i < allProviders.length; i++) {
				provider = allProviders[i];
				if (this.AuthService.user.providers[provider.id] && this.AuthService.user.providers[provider.id].name) {
					this.localCredentials.username = this.AuthService.user.providers[provider.id].username;
					break;
				}
			}
		});
	}

	/**
	 * First block: Update "public" user profile data
	 */
	updateUserProfile() {

		const updatedUser = this.AuthService.user.email_status && this.AuthService.user.email_status.code === 'pending_update' ? omit(this.updatedUser, ['email']) : this.updatedUser;
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
		}).catch(angular.noop);
	}

	createToken() {
		this.$uibModal.open({
			templateUrl: TokenCreateModalTpl,
			controller: 'TokenCreateModalCtrl',
			controllerAs: 'vm'

		}).result.then(token => {
			this.tokens.unshift(token);
			this.hasAppTokens = true;
			this.showTokenAlert = true;

		}).catch(angular.noop);
	}

	toggleToken(token) {
		this.TokenResource.update({ id: token.id }, { is_active: !token.is_active }, () => {
			token.is_active = !token.is_active;
		}, this.ApiHelper.handleErrorsInDialog('Error toggling token.'));
	}

	deleteAppToken(token) {
		return this.ModalService.question({
			title: 'Delete application token',
			message: 'Any application or script using this token will no longer be able to access the VPDB API. You cannot undo this action.',
			question: 'Are you sure you want to delete this token?'
		}).result.then(() => {
			this.TokenResource.delete({ id: token.id }, () => {
				this.tokens.splice(this.tokens.indexOf(token), 1);
				this.hasAppTokens = this.tokens.filter(token => token.scopes.includes('all')).length > 0;
				this.App.showNotification('Token successfully deleted.');

			}, this.ApiHelper.handleErrorsInDialog('Error deleting token.'));

		}).catch(angular.noop);
	}

	deleteLoginToken(token) {
		return this.ModalService.question({
			title: 'Remove browser access',
			message: 'You will need to re-login the next time you\'re using that browser. Are you sure?'
		}).result.then(() => {
			this.TokenResource.delete({ id: token.id }, () => {
				this.tokens.splice(this.tokens.indexOf(token), 1);
				this.hasLoginTokens = this.tokens.filter(token => token.scopes.includes('login')).length > 0;
				this.App.showNotification('Browser access successfully deleted.');

				// clear own login token if it's the deleted one
				if (this.AuthService.hasLoginToken(token)) {
					this.AuthService.clearLoginToken();
				}

			}, this.ApiHelper.handleErrorsInDialog('Error deleting token.'));

		}).catch(angular.noop);
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
			this.ApiHelper.setError(this, 'password', 'You must provide your new password.');
			return false;
		}
		if (!credentials.password2) {
			this.ApiHelper.setError(this, 'password2', 'You must confirm your new password.');
			return false;
		}
		if (credentials.password1 !== credentials.password2) {
			this.ApiHelper.setError(this, 'password2', 'The second password must match the first password.');
			return false;
		}
		return true;
	}

	addTokenIcon(token) {
		const ua = token.browser;
		if (!ua) {
			return token;
		}
		const browserIcons = {
			'Chrome': 'chrome',
			'Firefox': 'firefox',
			'IE': 'internet-explorer',
			'Edge': 'edge',
			'Safari': 'safari',
			'Opera': 'opera'
		};
		if (ua.browser.name && browserIcons[ua.browser.name]) {
			ua.browser.icon = browserIcons[ua.browser.name];
		}
		return token;
	}

	linkAccount(provider) {
		this.AuthService.setPostLoginRedirect();
		this.$window.location.href = this.ConfigService.apiUri('/v1/redirect/' + provider.id);
	}
}
