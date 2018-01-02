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
import AuthService from './auth.service';
import AuthInterceptorService from './auth.interceptor.service';
import AuthInterceptorConfig from './auth.interceptor.config';
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
	.config(AuthInterceptorConfig)
	.name;