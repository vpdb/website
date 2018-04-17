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

import GameSelectModalTpl from './common/games/game.select.modal.pug';

/**
 * The application controller manages parts of the page that is common to
 * all pages, which is basically menu functionality.
 *
 * @author freezy <freezy@vpdb.io>
 */
export default class AppCtrl {

	/**
	 * @param $rootScope
	 * @param $state
	 * @param $localStorage
	 * @param $uibModal
	 * @param $log
	 * @param {App} App
	 * @param {AuthService} AuthService
	 * @param {Config} Config
	 * @param {BuildConfig} BuildConfig
	 * @ngInject
	 */
	constructor($rootScope, $state, $localStorage, $uibModal, $log, App, AuthService, Config, BuildConfig) {
		this.waitCoolDown = 2000;

		this.$rootScope = $rootScope;
		this.$state = $state;
		this.$uibModal = $uibModal;
		this.$log = $log;
		this.App = App;
		this.AuthService = AuthService;
		this.BuildConfig = BuildConfig;

		// scroll top top when navigating
		$rootScope.$on('$stateChangeSuccess', () => document.body.scrollTop = document.documentElement.scrollTop = 0);

		// legal documents update
		const currentDocumentRevisions = $localStorage.documentRevisions || Config.documentRevisions;
		this.showRulesUpdated = currentDocumentRevisions.rules < Config.documentRevisions.rules;
		this.showPrivacyUpdated = currentDocumentRevisions.privacy < Config.documentRevisions.privacy;
		this.showLegalUpdated = currentDocumentRevisions.legal < Config.documentRevisions.legal;
		$localStorage.documentRevisions = Config.documentRevisions;

		// wait for page load to finish
		this.$rootScope.$on('loading:start', () => {
			if (this.waitTimeout) {
				clearTimeout(this.waitTimeout);
			}
		});
		this.$rootScope.$on('loading:finish', () => {
			if (this.waitTimeout) {
				clearTimeout(this.waitTimeout);
			}
			this.waitTimeout = setTimeout(() => this.installServiceWorker(), this.waitCoolDown);
		});
		this.waitTimeout = setTimeout(() => this.installServiceWorker(), this.waitCoolDown);

		this.$log.info('Application controller loaded.');
	}

	login() {
		this.App.login();
	}

	uploadRelease() {
		this.$uibModal.open({
			templateUrl: GameSelectModalTpl,
			controller: 'GameSelectModalCtrl',
			controllerAs: 'vm',
			windowTopClass: 'modal--with-overflow',
			resolve: {
				params: () => {
					return {
						title: 'Upload Recreation',
						text: 'Search the game of the recreation you want to upload.'
					};
				}
			}
		}).result.then(game => {
			this.$state.go('addRelease', { id: game.id });
		});
	}

	uploadBackglass() {
		this.$uibModal.open({
			templateUrl: GameSelectModalTpl,
			controller: 'GameSelectModalCtrl',
			controllerAs: 'vm',
			windowTopClass: 'modal--with-overflow',
			resolve: {
				params: () => {
					return {
						title: 'Upload Direct B2S Backglass',
						text: 'Search the game of the backglass you want to upload.'
					};
				}
			}
		}).result.then(game => {
			this.$state.go('addBackglass', { id: game.id });
		});
	}

	installServiceWorker() {
		if (!this.BuildConfig.production && !this.serviceWorkerInstalled) {
			this.$log.debug('Not installing service worker on non-production.');
		}
		if (!('serviceWorker' in navigator) && !this.serviceWorkerInstalled) {
			this.$log.warn('Not installing service worker in unsupported browser.');
		}
		if (this.BuildConfig.production && 'serviceWorker' in navigator && !this.serviceWorkerInstalled) {
			this.$log.debug('Registering service worker.');
			navigator.serviceWorker.register('/sw.js').then(reg => {
				// updatefound is fired if service-worker.js changes.
				reg.onupdatefound = () => {
					this.$log.debug('Service worker update found, pulling in changes...');
					// The updatefound event implies that reg.installing is set; see
					// https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-container-updatefound-event
					let installingWorker = reg.installing;
					installingWorker.onstatechange = () => {
						switch (installingWorker.state) {
							case 'installing':
								this.$log.info('Installing service worker...');
								break;
							case 'installed':
								if (navigator.serviceWorker.controller) {
									this.$log.info('Service worker installed.');
								} else {
									// At this point, everything has been precached.
									// It's the perfect time to display a "Content is cached for offline use." message.
									this.$log.info('App is now available offline!');
								}
								break;
							case 'activating':
								this.$log.info('Service worker activating...');
								break;
							case 'activated':
								this.$log.info('Service worker activated.');
								break;
							case 'redundant':
								this.$log.info('The installing service worker became redundant.');
								break;
						}
					};
				};
			}).catch(err => {
				this.$log.error('Error during service worker registration:', err);
			});
		}
		this.serviceWorkerInstalled = true;
	}
}
