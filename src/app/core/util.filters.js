import { filter, includes } from 'lodash';

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

export function escapeFilter() {
	return window.escape;
}

export function hexFilter() {
	return function(data) {
		return data ? data.toString(16) : '';
	}
}

export function hashPrefixFilter() {
	return function(data) {
		return '#' + data;
	}
}

export function fileExtFilter() {
	return function(files, exts) {
		return filter(files, function(file) {
			const ext = file.name.substr(file.name.lastIndexOf('.') + 1, file.name.length).toLowerCase();
			return includes(exts, ext);
		});
	}
}