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

import angular from 'angular';
import parseUri from 'parse-uri';
import { isObject, isFunction, set } from 'lodash';

/**
 * Helper class for API requests.
 *
 * @author freezy <freezy@vpdb.io>
 */
export default class ApiHelper {

	/**
	 * @param $state
	 * @param $log
	 * @param $q
	 * @param {App} App
	 * @param {ModalService} ModalService
	 * @param {ModalFlashService} ModalFlashService
	 * @ngInject
	 */
	constructor($state, $log, $q, App, ModalService, ModalFlashService) {
		this.$state = $state;
		this.$log = $log;
		this.$q = $q;
		this.App = App;
		this.ModalService = ModalService;
		this.ModalFlashService = ModalFlashService;
	}

	/**
	 * Creates a request.
	 *
	 * @param {function} query Function returning a query object
	 * @param {Object|null}  status Object the status is written to
	 * @param {boolean} status.loading If request is still active
	 * @param {boolean} status.offline When connection broke
	 * @param {string}  [status.error] Returned error message
	 * @param {boolean} [status.errors] Returned validation errors
	 * @param {Object}   [opts] Options
	 * @param {function} [opts.preFct] Executed if provided with given scope as argument, before the errors object has been set.<br>
	 * @param {string}   [opts.fieldPrefix] Added to field name of validation errors
	 * @returns {Promise}
	 */
	request(query, status, opts) {
		return this.paginatedRequest(query, status, null, opts);
	}

	/**
	 * Creates a paginated request.
	 *
	 * @param {function} query Function returning a query object
	 * @param {Object}  status Object the status is written to
	 * @param {boolean} status.loading If request is still active
	 * @param {boolean} status.offline When connection broke
	 * @param {string}  [status.error] Returned error message
	 * @param {boolean} [status.errors] Returned validation errors
	 * @param {Object|null}  pagination Object to update
	 * @param {number}  pagination.count Total number of results
	 * @param {number}  pagination.page Current page
	 * @param {number}  pagination.pageCount Total number of pages
	 * @param {Object}  pagination.links Pagination links, with props "url" and "query".
	 * @param {Object}  pagination.links.next Next page
	 * @param {Object}  pagination.links.prev Previous page
	 * @param {Object}  pagination.links.first First page
	 * @param {Object}  pagination.links.last Last page
	 * @param {Object}   [opts] Options
	 * @param {function} [opts.preFct] Executed if provided with given scope as argument, before the errors object has been set.<br>
	 * @param {string}   [opts.fieldPrefix] Added to field name of validation errors
	 * @returns {Promise}
	 */
	paginatedRequest(query, status, pagination, opts) {
		return this.$q((resolve, reject) => {
			if (status) {
				status.success = false;
				status.loading = true;
				status.offline = false;
				status.error = undefined;
				status.statusCode = undefined;
			}
			return query().$promise.then(response => {
				if (status) {
					status.loading = false;
					status.success = true;
					status.statusCode = response.status;
				}
				if (pagination) {
					this._handlePagination(response.headers, pagination);
				}
				resolve(response.data);

			}).catch(response => {
				if (status) {
					status.loading = false;
					status.success = false;
					status.statusCode = response.status;
				}
				if (response.status === -1) {
					status.offline = true;
				} else {
					this._handleErrors(response, status, opts);
				}
				reject(response);
			});
		});
	}

	/**
	 * Reads pagination parameters from provided headers and updates the given object.
	 * @param headers Response headers
	 * @param {{ count:number, page:number, size:number, pageCount:number, links:{next:{url:string, query:object}, prev:{url:string, query:object}, first:{url:string, query:object}, last:{url:string, query:object}} }} pagination Object to update
	 * @private
	 */
	_handlePagination(headers, pagination) {
		if (headers('x-list-count')) {
			pagination.count = parseInt(headers('x-list-count'));
			pagination.page = parseInt(headers('x-list-page'));
			pagination.size = parseInt(headers('x-list-size'));
			pagination.pageCount = Math.ceil(pagination.count / pagination.size);
		}
		if (headers('link')) {
			const links = {};
			headers('link').split(',').forEach(link => {
				const m = link.match(/<([^>]+)>\s*;\s*rel="([^"]+)"/);
				const url = m[1];
				links[m[2]] = {
					url: url.replace(/%2C/gi, ','),
					query: parseUri(decodeURIComponent(url)).queryKey
				};
			});
			pagination.links = links;
		}
	}

	_handleErrors(response, status, opts) {
		if (response.status === 401 && response.data.error === 'Token has expired') {
			this.ModalService.error({
				subtitle: 'Session timed out',
				message: 'Looks like your session has expired. Try logging in again.'
			});
			this.logError('Session timed out', response);
			return;
		}
		this.logError('Request error:', response);
		if (status) {
			status.errors = { __count: 0 };
			status.error = null;
		}
		if (response.data.errors) {
			if (opts.preFct) {
				opts.preFct(response, status);
			}
			if (status) {
				response.data.errors.forEach(err => {
					const path = (opts.fieldPrefix || '') + err.field;
					set(status.errors, path, err.message);
					status.errors.__count++;
				});
			}
		}
		if (status && response.data.error) {
			status.error = response.data.error;
		}
	}

	/**
	 * Reads pagination parameters from provided headers and updates the scope.
	 * @param {object} scope Controller instance to which the pagination parameters are applied to.
	 * @param {{ loader:boolean}|function(items:object[], headers:object)} [opts] Options or callback
	 * @param {function(items:object[], headers:object)=undefined} callback Callback
	 * @return {Function}
	 * @deprecated Use {@link paginatedRequest}
	 */
	handlePagination(scope, opts, callback) {
		if (isFunction(opts)) {
			callback = opts;
		} else {
			opts = opts || {};
		}
		return function(items, headers) {

			/** @type {{ count:number, page:number, size:number, pageCount:number, links:{next:{url:string, query:object}, prev:{url:string, query:object}, first:{url:string, query:object}, last:{url:string, query:object}} }} */
			scope.pagination = {};
			if (headers('x-list-count')) {
				scope.pagination.count = parseInt(headers('x-list-count'));
				scope.pagination.page = parseInt(headers('x-list-page'));
				scope.pagination.size = parseInt(headers('x-list-size'));
				scope.pagination.pageCount = Math.ceil(scope.pagination.count / scope.pagination.size);
			}

			if (headers('link')) {
				const links = {};
				headers('link').split(',').forEach(link => {
					const m = link.match(/<([^>]+)>\s*;\s*rel="([^"]+)"/);
					const url = m[1];
					links[m[2]] = {
						url: url.replace(/%2C/gi, ','),
						query: parseUri(decodeURIComponent(url)).queryKey
					};
				});
				scope.pagination.links = links;
			}

			if (callback) {
				callback(items, headers);
			}

			if (opts.loader) {
				scope.pageLoading = false;
			}
			delete scope.error;
		};
	}

	/**
	 * Updates the scope with received errors from the API.
	 *
	 * If there were validation errors, an `errors` tree is created
	 * with the field names as property names, otherwise the `error`
	 * variable is just set to the received error.
	 *
	 * @param {object} scope Controller instance to which the error values are applied to.
	 * @param {object} [opt] config options
	 * @param {string} [opt.fieldPrefix]
	 * @param {boolean} [opt.hideGlobalValidationError]
	 * @param {function(scope:object, response:object)} [postFct] Executed if provided with given scope as argument, after the errors object has been set
	 * @param {function(scope:object, response:object)} [preFct] Executed if provided with given scope as argument, before the errors object has been set.
	 * @return {function(response:object)}
	 * @deprecated Use {@link request} or {@link paginatedRequest}
	 */
	handleErrors(scope, opt, postFct, preFct) {
		if (!preFct && isFunction(opt)) {
			preFct = postFct;
			postFct = opt;
		}
		opt = isObject(opt) ? opt : {};
		return response => {
			if (!response.data) {
				this.ModalService.error({
					subtitle: 'Connection error',
					message: 'Looks like a request failed due to network problems. Please try again.'
				});
				this.logError('Connection error', response);
				return;
			}
			if (response.status === 401 && response.data.error === 'Token has expired') {
				this.ModalService.error({
					subtitle: 'Session timed out',
					message: 'Looks like your session has expired. Try logging in again.'
				});
				this.logError('Session timed out', response);
				return;
			}

			this.logError('Request error', response);
			if (scope.submitting) {
				scope.submitting = false;
			}
			scope.message = null;
			scope.errors = { __count: 0 };
			scope.error = null;
			if (response.data.errors) {
				if (preFct) {
					preFct(scope, response);
				}
				response.data.errors.forEach(err => {
					const path = (opt.fieldPrefix || '') + err.field;
					set(scope.errors, path, err.message);
					scope.errors.__count++;
				});
			}
			if (response.data.error) {
				scope.error = response.data.error;
			}
			if (response.status === 429 && response.data.wait) {
				scope.error = 'Whoa, easy tiger. Try again in ' + response.data.wait + ' seconds.';
			}
			if (postFct) {
				postFct(scope, response);
			}
			if (response.status === 422 && opt.hideGlobalValidationError) {
				delete scope.error;
			}
		};
	}

	/**
	 * Displays a modal with the received errors from the API.
	 * @param {string} title Title of the modal
	 * @param {function(response:object)} [callback] Executed if provided with given scope as argument.
	 * @return {function(response:object)}
	 */
	handleErrorsInDialog(title, callback) {
		return response => {
			this.logError('Request error', response);
			let skipError = false;
			if (callback) {
				skipError = callback(response);
			}
			this.App.setLoading(false);
			if (!skipError) {
				this.ModalService.error({
					subtitle: title,
					message: this.parseError(response)
				});
			}
		};
	}

	/**
	 * Displays a modal with the received errors from the API, but on a different page
	 * @param {string} state Page where to navigate before displaying the modal
	 * @param {string} title Title of the modal
	 * @return {Function}
	 */
	handleErrorsInFlashDialog(state, title) {
		return response => {
			this.logError('Request error', response);
			this.ModalFlashService.error({
				subtitle: title,
				message: this.parseError(response)
			});
			this.$state.go(state);
		};
	}

	/**
	 * Logs the error.
	 * @param {string} message
	 * @param response
	 */
	logError(message, response) {
		this.$log.error(message);
		if (response.config) {
			this.$log.debug('--> %s %s', response.config.method, response.config.url);
			if (response.config.headers) {
				Object.keys(response.config.headers).forEach(key => {
					const val = response.config.headers[key];
					this.$log.debug('--> %s: %s', key, val);
				});
			}
			if (response.config.data) {
				this.$log.debug('-->');
				this.$log.debug('--> %s', angular.toJson(response.config.data, true));
			}
		}
		this.$log.debug('<-- %s %s', response.status, response.statusText);
		const headers = response.headers();
		if (headers) {
			Object.keys(headers).forEach(key => {
				const val = headers[key];
				this.$log.debug('<-- %s: %s', key, val);
			});
		}
		if (response.data) {
			this.$log.debug('<--');
			this.$log.debug(angular.toJson(response.data, true));
		}
	}

	/**
	 * Manually sets an error to be displayed
	 * @param {object} scope Scope where to create the error variables
	 * @param {string} field Name of the field
	 * @param {string} message Error message
	 */
	setError(scope, field, message) {
		scope.errors = scope.errors || { __count: 0 };
		set(scope.errors, field, message);
	}

	/**
	 * Resets error tree.
	 * @param {object} scope Scope of the error variables
	 */
	clearErrors(scope) {
		scope.message = null;
		scope.errors = { __count: 0 };
		scope.error = null;
	}

	/**
	 * Parses error message from response.
	 * @param response
	 * @return {string}
	 */
	parseError(response) {
		if (response.data) {
			if (response.data.error) {
				return response.data.error;
			} else {
				return 'Not sure what the error was but we got this in return: ' + JSON.stringify(response.data);
			}
		} else {
			return 'Connection error. Please try again.';
		}
	}
}
