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

export default class ErrorReportingService {

	/**
	 * @param $log
	 * @param {Window} $window
	 * @param {Config} Config
	 * @ngInject
	 */
	constructor($log, $window, Config) {
		this.$log = $log;
		this.$window = $window;
		this.Config = Config;

		if (Config.rollbar && Config.rollbar.enabled && $window.Rollbar) {
			$log.info('Rollbar enabled.');
		} else {
			if (Config.rollbar && Config.rollbar.enabled && !$window.Rollbar) {
				$log.warn('Rollbar enabled but SDK not loaded.');
			} else if ((!Config.rollbar || !Config.rollbar.enabled) && $window.Rollbar) {
				$log.warn('Rollbar disabled but SDK loaded.');
			} else {
				$log.info('Rollbar disabled.');
			}
		}
		if (Config.raygun && Config.raygun.enabled && $window.rg4js) {
			$log.info('Raygun enabled.');
		} else {
			if (Config.raygun && Config.raygun.enabled && !$window.rg4js) {
				$log.warn('Raygun enabled but SDK not loaded.');
			} else if ((!Config.raygun || !Config.raygun.enabled) && $window.rg4js) {
				$log.warn('Raygun disabled but SDK loaded.');
			} else {
				$log.info('Raygun disabled.');
			}
		}
	}

	/**
	 * Sends an error to all enabled error reporting services.
	 * It also logs it to the console.
	 *
	 * @param {Error|string} error Error to send
	 * @param {string|object} [data] Optional message or custom data to include
	 * @param {string[]} [tags] Optional tags
	 */
	reportError(error, data, tags) {
		if (this._isRollbarEnabled()) {
			this.$window.Rollbar.error(error, data);
		}
		if (this._isRaygunEnabled()) {
			const body = {
				error: error,
			};
			if (data) {
				body.customData = data;
			}
			if (tags) {
				body.tags = tags;
			}
			this.$window.rg4js('send', body);
		}
	}

	/**
	 * Sets the authenticated user.
	 * @param user
	 */
	setUser(user) {
		if (this._isRollbarEnabled()) {
			this.$window.Rollbar.configure({
				payload: {
					person: {
						id: user.id,
						username: user.name,
						email: user.email
					}
				}
			});
		}
		if (this._isRaygunEnabled()) {
			this.$window.rg4js('setUser', {
				identifier: user.id,
				isAnonymous: false,
				email: user.email,
				firstName: user.name
			});
		}
	}

	/**
	 * Checks if Rollbar is enabled and the SDK loaded.
	 * @returns {boolean} True if enabled, false otherwise.
	 * @private
	 */
	_isRollbarEnabled() {
		return this.Config.rollbar && this.Config.rollbar.enabled && this.$window.Rollbar;
	}

	/**
	 * Checks if Raygun is enabled and the SDK loaded.
	 * @returns {boolean} True if enabled, false otherwise.
	 * @private
	 */
	_isRaygunEnabled() {
		return this.Config.raygun && this.Config.raygun.enabled && this.$window.rg4js;
	}
}