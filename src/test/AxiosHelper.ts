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

import { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

export class AxiosHelper {

	static addErrorHandler(instance:AxiosInstance) {
		instance.interceptors.response.use((response:AxiosResponse) => response, (error:AxiosError) => {
			let err = error.message;
			err += '\n--> ' + error.request._header.replace(/\n/g, '\n--> ');
			if (error.config.data) {
				err += '\n---> ' + error.config.data;
			}
			err += '\n<-- ' + error.response.status + ' ' + error.response.statusText;
			Object.keys(error.response.headers).forEach(name => {
				err += '\n<-- ' + name + ' ' + error.response.headers[name];
			});
			if (error.response.data) {
				err += '\n<--';
				err += '\n<-- ' + JSON.stringify(error.response.data, null, '  ').replace(/\n/g, '\n--> ');
			}
			error.message = err;
			return Promise.reject(error);
		});
	}
}
