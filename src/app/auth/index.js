import angular from 'angular';
import AuthService from './auth.service';
import AuthInterceptorService from './auth.interceptor.service';
import AuthCallbackCtrl from './auth.callback.ctrl';
import LoginService from './login.service';
import LoginModalCtrl from './login.modal.ctrl';
import TokenCreateModalCtrl from './token.create.modal.ctrl';
import EmailConfirmationCtrl from './email.confirmation.ctrl';

export default angular
	.module('vpdb.auth', [])
	.service('AuthService', AuthService)
	.service('AuthInterceptorService', AuthInterceptorService)
	.service('LoginService', LoginService)
	.controller('AuthCallbackCtrl', AuthCallbackCtrl)
	.controller('LoginModalCtrl', LoginModalCtrl)
	.controller('TokenCreateModalCtrl', TokenCreateModalCtrl)
	.controller('EmailConfirmationCtrl', EmailConfirmationCtrl)
	.config(function($httpProvider) {
		$httpProvider.interceptors.push('AuthInterceptorService');
	})
	.name;