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
 * Sends events when downloads have finished. Works for the API as well as for
 * images using the `img-bg` directive.
 *
 * The goal is to install the service worker only when all other requests have
 * finished in order not to compete with the page load.
 */
export default class NetworkService {

	/**
	 * @param $rootScope
	 * @ngInject
	 */
	constructor($rootScope) {
		this.$rootScope = $rootScope;
		this.loadingCount = 0;
	}

	onRequestStarted(url) {
		if (this.loadingCount++ === 0) {
			this.$rootScope.$broadcast('loading:start', url);
		}
	}

	onRequestFinished(url) {
		if (--this.loadingCount === 0) {
			this.$rootScope.$broadcast('loading:finish', url);
		}
	}
}