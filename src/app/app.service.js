import angular from 'angular';
import { max, map, keys, isEmpty } from 'lodash';

const loginModelTpl = require('./auth/login.modal.pug')();

export default class App {

	constructor($rootScope, $window, $timeout, $uibModal, $localStorage, Config) {
		this.$rootScope = $rootScope;
		this.$window = $window;
		this.$timeout = $timeout;
		this.$uibModal = $uibModal;

		this.$rootScope.loginParams = {
			open: false,
			localOnly: !Config.authProviders.google && !Config.authProviders.github && isEmpty(Config.authProviders.ipboard)
		};

		this.$rootScope.timeoutNoticeCollapsed = true;
		this.$rootScope.notifications = {};

		$localStorage.show_instructions = $localStorage.show_instructions || {
			release_add: true,
			version_add: true
		};
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
	 * Returns the provided message or the current login message as fallback and clears the fallback.
	 * @param message Message
	 * @return {*}
	 */
	popLoginMessage(message) {
		let msg = message || this.$rootScope.loginParams.message;
		delete this.$rootScope.loginParams.message;

		return msg;
	}

	setLoading(loading) {
		this.$rootScope.loading = loading;
	};

	showLoginTimeoutMessage() {
		this.$rootScope.timeoutNoticeCollapsed = false;
	}

	showNotification(message, ttl) {
		ttl = ttl || 3000;
		const i = max(map(keys(this.$rootScope.notifications).concat([0]), parseInt)) + 1;
		this.$rootScope.notifications[i] = { message: message, ttl: ttl };
		this.$timeout(() => {
			delete this.$rootScope.notifications[i];
		}, ttl);
	};

	downloadLink(link, token, body, callback) {
		$rootScope.downloadLink = link;
		$rootScope.downloadToken = token || '';
		$rootScope.downloadBody = body || '';
		this.$timeout(() => {
			angular.element('#downloadForm').submit();
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
			template: loginModelTpl,
			controller: 'LoginModalCtrl',
			controllerAs: 'vm',
			windowClass: 'theme-light',
			resolve: { opts: () => opts }
		});
	};
}
