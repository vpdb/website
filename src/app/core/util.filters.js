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