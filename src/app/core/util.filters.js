import { filter, includes } from 'lodash';

/**
 * @ngInject
 */
export function bytesFilter() {
	return function(bytes, precision) {
		if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) {
			return '-';
		}
		if (typeof precision === 'undefined') {
			precision = 1;
		}
		const units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
			number = Math.floor(Math.log(bytes) / Math.log(1024));
		return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) + ' ' + units[number];
	}
}

/**
 * @ngInject
 */
export function authorsFilter() {
	return function(authors) {
		let ret = '';
		authors.forEach(author => {
			if (ret) {
				ret += ', ';
			}
			ret += '<user>' + author.user.name + '</user>';
		});
		return ret;
	};
}

/**
 * @ngInject
 */
export function escapeFilter() {
	return window.escape;
}

/**
 * @ngInject
 */
export function hexFilter() {
	return function(data) {
		return data ? data.toString(16) : '';
	}
}

/**
 * @ngInject
 */
export function hashPrefixFilter() {
	return function(data) {
		return '#' + data;
	}
}

/**
 * @ngInject
 */
export function fileExtFilter() {
	return function(files, exts) {
		return filter(files, function(file) {
			const ext = file.name.substr(file.name.lastIndexOf('.') + 1, file.name.length).toLowerCase();
			return includes(exts, ext);
		});
	}
}