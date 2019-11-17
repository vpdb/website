/*
 * VPDB - Virtual Pinball Database
 * Copyright (C) 2019 freezy <freezy@vpdb.io>
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

import { isUndefined } from 'lodash';

/**
 * The login modal opening when the user clicks on "login".
 *
 * @author freezy <freezy@vpdb.io>
 */
export default class LoginModalCtrl {

	/**
	 * @param {Window} $window
	 * @param $uibModalInstance
	 * @param {*} $localStorage
	 * @param {Config} Config
	 * @param {ConfigService} ConfigService
	 * @param {LoginService} LoginService
	 * @param {ModalService} ModalService
	 * @param {App} App
	 * @param {ApiHelper} ApiHelper
	 * @param {AuthService} AuthService
	 * @param AuthResource
	 * @param ProfileResource
	 * @param UserResource
	 * @param {{ postLogin:{action:string, params:any}, headMessage:string, topMessage:string, message:string }} opts
	 * @ngInject
	 */
	constructor($window, $uibModalInstance, $localStorage, Config, ConfigService, LoginService, ModalService,
				App, ApiHelper, AuthService, AuthResource, ProfileResource, UserResource, opts) {

		opts = opts || {};
		$localStorage.rememberMe = isUndefined($localStorage.rememberMe) ? true : $localStorage.rememberMe;

		this.Config = Config;
		this.ConfigService = ConfigService;
		this.LoginService = LoginService;
		this.ModalService = ModalService;
		this.AuthService = AuthService;
		this.ApiHelper = ApiHelper;
		this.AuthResource = AuthResource;
		this.ProfileResource = ProfileResource;
		this.UserResource = UserResource;
		this.$window = $window;
		this.$uibModalInstance = $uibModalInstance;
		this.$localStorage = $localStorage;

		this.opts = opts || {};

		/** @type {{ username:string, password:string}} */
		this.userPass = {};
		this.mode = 'login';
		this.email = '';
		this.message = opts.message || null;
		this.error = null;
		this.errors = {};
		this.topMessage = App.popLoginMessage(opts.topMessage) ;
		this.headMessage = opts.headMessage;
	}

	/**
	 * Logs in using one of the supported OAuth providers.
	 * @param {string} providerId One of `google`, `github` or an IPB ID.
	 */
	oauth(providerId) {

		this.setRedirect();
		this.$window.location.href = this.ConfigService.apiUri('/v1/redirect/' + providerId);
	}

	/**
	 * Locally authenticates a user through the backend.
	 */
	login() {

		this.setRedirect();
		this.loading = true;
		this.AuthResource.authenticate(this.userPass, response => {
			this.loading = false;
			if (response.status >= 200 && response.status < 300) {
				this.errors = {};
				this.error = null;
				this.message2 = null;
				this.AuthService.authenticated(response.data);
				this.$uibModalInstance.close();
				this.AuthService.runPostLoginActions();
				if (this.$localStorage.rememberMe) {
					this.AuthService.rememberMe();
				}
			} else {
				this.ApiHelper.handleErrors(this, () => { this.message2 = null; })(response);
			}

		}, this.ApiHelper.handleErrors(this, () => {
			this.loading = false;
			this.message2 = null;
		}));
	}

	/**
	 * Locally registers a new user at the backend.
	 */
	register() {

		this.setRedirect();

		this.UserResource.register(Object.assign(this.userPass, { email: this.email }), () => {
			this.errors = {};
			this.error = null;
			this.userPass = {};
			this.email = '';
			this.message = 'Registration successful.';
			this.message2 = 'You will get an email shortly.<br>Once you have confirmed it, you\'re good to go!';
			this.mode = 'login';
		}, this.ApiHelper.handleErrors(this));
	}

	/**
	 * Requests a password reset.
	 */
	reset() {
		this.ProfileResource.requestResetPassword({ email: this.email }, result => {
			this.errors = {};
			this.error = null;
			this.userPass = {};
			this.email = '';
			this.message = result.message;
			this.mode = 'login';
			this.$uibModalInstance.dismiss();
			this.ModalService.info({
				title: 'Password Reset',
				subtitle: 'Success!',
				message: result.message
			});
		}, this.ApiHelper.handleErrors(this, { hideGlobalValidationError: true }));
	}

	setRedirect() {
		this.AuthService.setPostLoginRedirect();
		if (this.opts.postLogin) {
			this.AuthService.addPostLoginAction(this.opts.postLogin.action, this.opts.postLogin.params);
		}
	}

	/**
	 * Toggles between reset, register and login view.
	 */
	swap(mode) {
		this.mode = mode ? mode : this.mode === 'login' ? 'register' : 'login';
		this.message = null;
		this.message2 = null;
		this.errors = {};
		this.error = null;
	}
}
