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
 * Provides easy access to downloading files or releases.
 *
 * @author freezy <freezy@vpdb.io>
 */
export default class DownloadService {

	/**
	 * @param {App} App
	 * @param {AuthService} AuthService
	 * @param {ConfigService} ConfigService
	 * @ngInject
	 */
	constructor(App, AuthService, ConfigService) {
		this.App = App;
		this.AuthService = AuthService;
		this.ConfigService = ConfigService;
	}

	/**
	 * Downloads a file from VPDB.
	 * @param file
	 * @param [callback]
	 */
	downloadFile(file, callback) {

		if (file.is_protected) {
			if (this.AuthService.isAuthenticated) {
				this.AuthService.fetchUrlTokens(file.url, (err, tokens) => {
					// todo treat error
					this.App.downloadLink(file.url, tokens[file.url], null, callback);
				});

			} else {
				this.App.login({
					headMessage: 'In order to download this file, you need to be logged in. You can register for free just below.',
					postLogin: { action: 'downloadFile', params: file }
				});
			}

		} else {
			this.App.downloadLink(file.url, null, null, callback);
		}
	}

	/**
	 * Downloads a release from VPDBP.
	 * @param {string} releaseId Release ID
	 * @param {object} downloadRequest
	 * @param {function} callback
	 */
	downloadRelease(releaseId, downloadRequest, callback) {

		const path = '/v1/releases/' + releaseId;
		const url = this.ConfigService.storageUri(path);
		this.AuthService.fetchUrlTokens(url, (err, tokens) => {
			// todo treat error
			this.App.downloadLink(this.ConfigService.storageUri(path, true), tokens[url], JSON.stringify(downloadRequest), callback);
		});
	}
}