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

import AuthCallbackTpl from './auth/auth.callback.pug';
import EmailConfirmationTpl from './auth/email.confirmation.pug';
import ResetPasswordModalTpl from './auth/reset.password.modal.pug';
import HomeTpl from '../home/home.pug';

const HOME = {
	name: 'home',
	url: '/',
	templateUrl: HomeTpl,
	controller: 'HomeCtrl',
	controllerAs: 'vm',
};

const AUTH_CALLBACK = {
	name: 'authCallback',
	url: '/auth/:strategy/callback',
	templateUrl: AuthCallbackTpl,
};

const CONFIRM_TOKEN = {
	name: 'confirmToken',
	url: '/confirm/:token',
	templateUrl: EmailConfirmationTpl,
};

const RESET_PASSWORD = {
	name: 'resetPassword',
	url: '/reset-password/:token',
	templateUrl: HomeTpl,
	controller: 'HomeCtrl',
	controllerAs: 'vm',
	params: {
		modal: {
			templateUrl: ResetPasswordModalTpl,
			controller: 'ResetPasswordModalCtrl',
			controllerAs: 'vm',
			windowClass: 'theme-light',
		}
	}
};

export { HOME, AUTH_CALLBACK, CONFIRM_TOKEN, RESET_PASSWORD };
