import angular from 'angular';
import AuthService from './auth.service';
import AuthInterceptorService from './auth.interceptor.service';
import AuthCallbackCtrl from './auth.callback.ctrl';
import LoginModalCtrl from './login.modal.ctrl';
import TokenCreateModalCtrl from './token.create.modal.ctrl';

export default angular
	.module('vpdb.auth', [])
	.service('AuthService', AuthService)
	.service('AuthInterceptorService', AuthInterceptorService)
	.controller('AuthCallbackCtrl', AuthCallbackCtrl)
	.controller('LoginModalCtrl', LoginModalCtrl)
	.controller('TokenCreateModalCtrl', TokenCreateModalCtrl)
	.config(function($httpProvider) {
		$httpProvider.interceptors.push('AuthInterceptorService');
	})
	.name;