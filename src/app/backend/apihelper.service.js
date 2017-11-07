import { isObject, isFunction, map, forEach, set } from 'lodash';
import parseUri from 'parse-uri';

export default class ApiHelper {

	constructor($location, ModalService/*, ModalFlashService*/) {
		this.$location = $location;
		this.ModalService = ModalService;
	}

	/**
	 * Reads pagination parameters from provided headers and updates the scope.
	 *
	 * @param scope
	 * @param opts
	 * @param callback
	 * @returns {Function}
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
				scope.pagination.pageCount = Math.ceil(scope.pagination.count / scope.pagination.size)
			}

			if (headers('link')) {
				const links = {};
				map(headers('link').split(','), link => {
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
				scope.loading = false;
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
	 * @param {object} scope Scope where to create the error variables
	 * @param {object} [opt] config options. Valid options: fieldPrefix
	 * @param {function} [postFct] Executed if provided with given scope as argument, after the errors object has been set
	 * @param {function} [preFct] Executed if provided with given scope as argument, before the errors object has been set.
	 */
	handleErrors(scope, opt, postFct, preFct) {
		if (!preFct && isFunction(opt)) {
			preFct = postFct;
			postFct = opt;
		}
		opt = isObject(opt) ? opt : {};
		return function(response) {
			if (!response.data) {
				this.ModalService.error({
					subtitle: "Connection error",
					message: "Looks like a request failed due to network problems. Please try again."
				});
				return;
			}
			if (response.status === 401 && response.data.error === "Token has expired") {
				this.ModalService.error({
					subtitle: "Session timed out",
					message: "Looks like your session has expired. Try logging in again."
				});
				return;
			}
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
				forEach(response.data.errors, function(err) {
					const path = (opt.fieldPrefix || '') + err.field;
					set(scope.errors, path, err.message);
					scope.errors.__count++;
				});
			}
			if (response.data.error) {
				scope.error = response.data.error;
			}
			if (postFct) {
				postFct(scope, response);
			}
		};
	}

	/**
	 * Displays a modal with the received errors from the API.
	 * @param {object} scope Scope where to create the error variables
	 * @param {string} title Title of the modal
	 * @param {function} [callback] Executed if provided with given scope as argument.
	 * @returns {Function}
	 */
	handleErrorsInDialog(scope, title, callback) {
		const that = this;
		return response => {
			let skipError = false;
			if (callback) {
				skipError = callback(response);
			}
			scope.setLoading(false);
			if (!skipError) {
				this.ModalService.error({
					subtitle: title,
					message: that.parseError(response)
				});
			}
		};
	}

	/**
	 * Displays a modal with the received errors from the API, but on a different page
	 * @param {string} path Page where to navigate before displaying the modal
	 * @param {string} title Title of the modal
	 * @returns {Function}
	 */
	handleErrorsInFlashDialog(path, title) {
		return response => {
			this.ModalFlashService.error({
				subtitle: title,
				message: this.parseError(response)
			});
			this.$location.path(path);
		};
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
	 * @returns {string}
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