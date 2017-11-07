import { isUndefined, extend } from 'lodash';

export default class LoginModalCtrl {

	/**
	 * @param $scope
	 * @param $uibModalInstance
	 * @param $window
	 * @param $localStorage
	 * @param {Config} Config
	 * @param {ConfigService} ConfigService
	 * @param {ApiHelper} ApiHelper
	 * @param {AuthService} AuthService
	 * @param {App} App
	 * @param {AuthResource} AuthResource
	 * @param {UserResource} UserResource
	 * @param {{ postLogin:{action:string, params:any}, headMessage:string, topMessage:string, message:string }} opts
	 */
	constructor($scope, $uibModalInstance, $window, $localStorage, Config, ConfigService,
				ApiHelper, AuthService, App, AuthResource, UserResource, opts) {

		opts = opts || {};
		$localStorage.rememberMe = isUndefined($localStorage.rememberMe) ? true : $localStorage.rememberMe;

		this.Config = Config;
		this.ConfigService = ConfigService;
		this.AuthService = AuthService;
		this.ApiHelper = ApiHelper;
		this.AuthResource = AuthResource;
		this.UserResource = UserResource;
		this.$window = $window;
		this.$modal = $uibModalInstance;
		this.$localStorage = $localStorage;

		this.opts = opts || {};
		this.registering = false;
		this.userPass = {};
		this.email = "";
		this.registerUser = {};
		this.message = opts.message || null;
		this.error = null;
		this.errors = {};
		this.topMessage = App.popLoginMessage(opts.topMessage) ;
		this.headMessage = opts.headMessage;
	}

	oauth(providerId) {

		this.AuthService.setPostLoginRedirect();
		if (this.opts.postLogin) {
			this.AuthService.addPostLoginAction(this.opts.postLogin.action, this.opts.postLogin.params);
		}
		this.$window.location.href = this.ConfigService.apiUri('/redirect/' + providerId);
	}

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
			this.$modal.close();
			this.AuthService.runPostLoginActions();

			if (this.$localStorage.rememberMe) {
				this.AuthService.rememberMe();
			}

		}, this.ApiHelper.handleErrors(this, () => {
			this.message2 = null;
		}));
	}

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

	swap() {
		this.registering = !this.registering;
		this.message = null;
		this.message2 = null;
		this.errors = {};
		this.error = null;
	}
}