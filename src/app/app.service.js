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
import LoginModalTpl from './common/auth/login.modal.pug';

export default class App {
	/**
	 * @param $log
	 * @param $rootScope
	 * @param $window
	 * @param $timeout
	 * @param $uibModal
	 * @param $localStorage
	 * @param $injector
	 * @param {LoginService} LoginService
	 * @param {ModalFlashService} ModalFlashService
	 * @param ProfileResource
	 * @ngInject
	 */
	constructor($rootScope, $window, $timeout, $uibModal, $localStorage, $injector, $log, LoginService, ModalFlashService, ProfileResource) {
		this.$rootScope = $rootScope;
		this.$window = $window;
		this.$timeout = $timeout;
		this.$uibModal = $uibModal;
		this.$log = $log;
		this.LoginService = LoginService;

		this.$rootScope.timeoutNoticeCollapsed = true;
		this.$rootScope.notifications = {};

		$localStorage.showInstructions = $localStorage.showInstructions || {
			release_add: true,
			version_add: true
		};

		// refresh user when updated
		$rootScope.$on('updateUser', () => {
			ProfileResource.get(user => {
				$rootScope.$broadcast('userUpdated', user);
			}, err => {
				$log.error('Error retrieving user profile: ', err);
			});
		});

		// hide timeout notice when navigating
		$rootScope.$on('$stateChangeStart', () => $rootScope.timeoutNoticeCollapsed = true);

		// check for flash messages
		$rootScope.$on('$stateChangeSuccess', () => ModalFlashService.process());

		// download file on event
		$rootScope.$on('downloadFile', (event, file) => $injector.get('DownloadService').downloadFile(file));
	}

	/**
	 * Sets the page title.
	 * @param {string} title
	 */
	setTitle(title) {
		this.$rootScope.pageTitle = title;
	}

	/**
	 * Sets the meta data of the current page
	 * @param {{description:String, keywords:string, [thumbnail]:string}} meta Metadata
	 */
	setMeta(meta) {
		this.$rootScope.meta = meta;
	}

	/**
	 * Activates a menu.
	 * @param {string} menu
	 */
	setMenu(menu) {
		this.$rootScope.menu = menu;
	}

	/**
	 * Sets the theme of the current page.
	 * @param {'dark'|'light'} theme
	 */
	theme(theme) {
		this.$rootScope.themeName = 'theme-' + theme;
	}

	/**
	 * Returns the pixel suffix for bitmap images.
	 * @param name Name of the bitmap
	 * @return {string} Screen density-aware file name
	 */
	pixelSuffix(name) {
		return name + (this.$window.devicePixelRatio > 1 ? '-2x' : '');
	}

	/**
	 * Returns the URL of an image's variation.
	 *
	 * @param {{ variations:object }} image Image object
	 * @param {string} variation Variation
	 */
	img(image, variation) {
		if (!image) {
			return;
		}
		if (!image.variations) {
			this.$log.warn('No variations in ', image);
			return;
		}
		const name = this.pixelSuffix(variation);
		if (!image.variations[name]) {
			this.$log.warn('No variation "%s" in ', variation, image);
			return;
		}
		return image.variations[this.pixelSuffix(variation)].url;
	}

	/**
	 * Returns the provided message or the current login message as fallback and clears the fallback.
	 * @param message Message
	 * @return {*}
	 */
	popLoginMessage(message) {
		let msg = message || this.LoginService.loginParams.message;
		delete this.LoginService.loginParams.message;

		return msg;
	}

	/**
	 * Enables or disables the global loading overlay.
	 *
	 * @param loading
	 */
	setLoading(loading) {
		this.$rootScope.loading = loading;
	}

	showLoginTimeoutMessage() {
		this.$rootScope.timeoutNoticeCollapsed = false;
	}

	showNotification(message, ttl) {
		ttl = ttl || 3000;
		const i = [ 0, ...Object.keys(this.$rootScope.notifications)].map(parseInt).reduce((a, b) => Math.max(a, b)) + 1;
		this.$rootScope.notifications[i] = { message: message, ttl: ttl };
		this.$timeout(() => delete this.$rootScope.notifications[i], ttl);
	}

	downloadLink(link, token, body, callback) {
		this.$rootScope.downloadLink = link;
		this.$rootScope.downloadToken = token || '';
		this.$rootScope.downloadBody = body || '';
		this.$timeout(() => {
			angular.element(document.getElementById('downloadForm'))[0].submit();
			if (callback) {
				callback();
			}
		}, 0);
	}

	/**
	 *
	 * @param {{ postLogin:{action:string, params:any}, headMessage:string, topMessage:string }} [opts]
	 */
	login(opts) {
		this.$uibModal.open({
			templateUrl: LoginModalTpl,
			controller: 'LoginModalCtrl',
			controllerAs: 'vm',
			windowClass: 'theme-light',
			resolve: { opts: () => opts }
		}).result.catch(angular.noop);
	}
}
