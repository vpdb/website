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
 * @param $rootScope
 * @param $q
 * @param {NetworkService} NetworkService
 * @return {{response: response}}
 * @ngInject
 */
export default function($rootScope, $q, NetworkService) {
	return {
		request: function(config) {
			NetworkService.onRequestStarted(config.url);
			return config || $q.when(config);
		},
		response: function(response) {
			NetworkService.onRequestFinished(response.config.url);
			return response || $q.when(response);
		},
		responseError: function(response) {
			NetworkService.onRequestFinished(response.config.url);
			return $q.reject(response);
		}
	};
}
