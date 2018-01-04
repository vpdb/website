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

import axios, { AxiosError, AxiosResponse } from 'axios';

export class Bootstrap {

	static isBootstrapped = false;

	static bootstrap() {
		if (Bootstrap.isBootstrapped) {
			console.log('Axios already set up.');
			return;
		}
		axios.interceptors.response.use((response:AxiosResponse) => response, (error:AxiosError) => {
			console.log('--> %s %s', error.request.method, error.request.uri);
			error.request.headers.forEach(header => {
				console.log('--> %s', header);
			});
			if (error.request.data) {
				console.log('-->');
				console.log('--> %s', JSON.stringify(error.request.data, null, '  '));
			}
			console.log('---');
			console.log('<-- %s %s\n', error.response.status, error.response.statusText);
			error.response.headers.forEach(header => {
				console.log('<-- %s', header);
			});
			if (error.response.data) {
				console.log('<--');
				console.log('<-- %s', JSON.stringify(error.response.data, null, '  '));
			}
			return Promise.reject(error);
		});
		Bootstrap.isBootstrapped = true;
		console.log('Axios set up.');
	}
}