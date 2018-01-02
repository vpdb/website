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

/**
 * Tracker service.
 *
 * @see https://developers.google.com/analytics/devguides/collection/analyticsjs/
 * @author freezy <freezy@vpdb.io>
 */
export default class TrackerService {

	/**
	 * @param $rootScope
	 * @param {Config} Config
	 * @param {AuthService} AuthService
	 * @ngInject
	 */
	constructor($rootScope, Config, AuthService) {

		this.$rootScope = $rootScope;
		this.Config = Config;

		if (this.Config.ga && this.Config.ga.enabled) {
			if (AuthService.user) {
				ga('create', this.Config.ga.id, 'auto', { userId: AuthService.user.id });
			} else {
				ga('create', this.Config.ga.id, 'auto');
			}
			this.$rootScope.$on('userUpdated', (event, user) => {
				if (user) {
					ga('set', 'userId', user.id);
				}
			});

		} else {
			console.info('Google Analytics disabled.');
		}
	}

	/**
	 * Tracks a page view.
	 */
	trackPage() {
		if (this.Config.ga && this.Config.ga.enabled) {
			ga('send', 'pageview');
		}
	}
}