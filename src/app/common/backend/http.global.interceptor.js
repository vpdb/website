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
 * @param $q
 * @param $window
 * @param $log
 * @param {Config} Config
 * @param {NetworkService} NetworkService
 * @param {ErrorReportingService} ErrorReportingService
 * @return {{response: response}}
 * @ngInject
 */
export default function($q, $window, $log, Config, NetworkService, ErrorReportingService) {
	return {
		request: config => {
			NetworkService.onRequestStarted(config.url);
			return config || $q.when(config);
		},
		response: response => {
			NetworkService.onRequestFinished(response.config.url);
			return response || $q.when(response);
		},
		requestError: rejection => {
			ErrorReportingService.reportError(rejection, 'Failed $http request.', ['api']);
			return $q.reject(rejection);
		},

		responseError: function(response) {

			// sometimes we expect non 2xx codes and we stil want to resolve.
			if (response.config.noError && response.config.noError.includes(response.status)) {
				if (Config.name === 'local') {
					$log.debug('Not reporting HTTP response.');
				}
				return $q.resolve(response);
			}
			const data = {
				request: {
					method: response.config.method,
					url: response.config.url,
					headers: response.config.headers,
					data: response.config.data
				},
				response: {
					status: response.status + ' ' + response.statusText,
					data: response.data
				}
			};
			const message = response.config.method + ' ' + response.config.url;
			ErrorReportingService.reportError(message, data, ['api']);
			NetworkService.onRequestFinished(response.config.url);
			return $q.reject(response);
		}
	};
}
