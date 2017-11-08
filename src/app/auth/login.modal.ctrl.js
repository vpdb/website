import { isUndefined, extend } from 'lodash';

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
	 * @param {App} App
	 * @param {ApiHelper} ApiHelper
	 * @param {AuthService} AuthService
	 * @param {AuthResource} AuthResource
	 * @param {UserResource} UserResource
	 * @param {{ postLogin:{action:string, params:any}, headMessage:string, topMessage:string, message:string }} opts
	 */
	constructor($window, $uibModalInstance, $localStorage, Config, ConfigService,
				App, ApiHelper, AuthService, AuthResource, UserResource, opts) {

		opts = opts || {};
		$localStorage.rememberMe = isUndefined($localStorage.rememberMe) ? true : $localStorage.rememberMe;

		this.Config = Config;
		this.ConfigService = ConfigService;
		this.AuthService = AuthService;
		this.ApiHelper = ApiHelper;
		this.AuthResource = AuthResource;
		this.UserResource = UserResource;
		this.$window = $window;
		this.$uibModalInstance = $uibModalInstance;
		this.$localStorage = $localStorage;

		this.opts = opts || {};

		/** @type {{ username:string, password:string}} */
		this.userPass = {};
		this.registering = false;
		this.email = "";
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

		this.AuthService.setPostLoginRedirect();
		if (this.opts.postLogin) {
			this.AuthService.addPostLoginAction(this.opts.postLogin.action, this.opts.postLogin.params);
		}
		this.$window.location.href = this.ConfigService.apiUri('/redirect/' + providerId);
	}

	/**
	 * Locally authenticates a user through the backend.
	 */
	login() {

		this.AuthService.setPostLoginRedirect();
		if (this.opts.postLogin) {
			this.AuthService.addPostLoginAction(this.opts.postLogin.action, this.opts.postLogin.params);
		}
		// noinspection JSUnresolvedFunction
		this.AuthResource.authenticate(this.userPass, result => {
			this.errors = {};
			this.error = null;
			this.message2 = null;
			this.AuthService.authenticated(result);
			this.$uibModalInstance.close();
			this.AuthService.runPostLoginActions();

			if (this.$localStorage.rememberMe) {
				this.AuthService.rememberMe();
			}

		}, this.ApiHelper.handleErrors(this, () => {
			this.message2 = null;
		}));
	}

	/**
	 * Locally registers a new user at the backend.
	 */
	register() {

		this.AuthService.setPostLoginRedirect();
		if (this.opts.postLogin) {
			this.AuthService.addPostLoginAction(this.opts.postLogin.action, this.opts.postLogin.params);
		}
		// noinspection JSUnresolvedFunction
		this.UserResource.register(extend(this.userPass, { email: this.email }), () => {
			this.errors = {};
			this.error = null;
			this.userPass = {};
			this.email = "";
			this.message = 'Registration successful.';
			this.message2 = 'You will get an email shortly.<br>Once you have confirmed it, you\'re good to go!';
			this.registering = !this.registering;
		}, this.ApiHelper.handleErrors(this));
	}

	/**
	 * Toggles between register and login view.
	 */
	swap() {
		this.registering = !this.registering;
		this.message = null;
		this.message2 = null;
		this.errors = {};
		this.error = null;
	}
}