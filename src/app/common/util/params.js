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

import { cloneDeep, pickBy, isObject, defaultsDeep } from 'lodash';

/**
 * This is a helper class that manages mapping between the URL,
 * the internal data model and the backend's API model, where each
 * might have different names or types.
 *
 * @author freezy <freezy@vpdb.io>
 */
export default class Params {

	constructor(params) {
		this.defaults = {};
		params.forEach(param => this.defaults[param.name] = param.defaultValue);
		this.value = cloneDeep(this.defaults);
		/** @type {Param[]} */
		this.params = params;
	}

	fromUrl(urlParams) {
		this.params.forEach(param => {
			if (urlParams[param.urlName] && param.fromUrl) {
				if (isObject(param.defaultValue)) {
					this.value[param.name] = defaultsDeep(param.fromUrl(urlParams[param.urlName]), param.defaultValue);
				} else {
					this.value[param.name] = param.fromUrl(urlParams[param.urlName]);
				}

			}
		});
	}

	toRequest() {
		const reqParams = {};
		this.params.forEach(param => {
			const value = this.value[param.name];
			if (param.reqCondition(value) && param.toReq(value)) {
				reqParams[param.reqName] = param.toReq(value);
			}
		});
		return reqParams;
	}

	toUrl(useDefaults = false) {
		const urlParams = {};
		const value = useDefaults ? this.defaults : this.value;
		this.params.forEach(param => {
			if (value[param.name]) {
				urlParams[param.urlName] = param.toUrl(value[param.name]);
			}
		});
		return urlParams;
	}

	getUrl() {
		const defaultUrlQuery = this.toUrl(true);
		return pickBy(this.toUrl(), (value, key) => defaultUrlQuery[key] !== value);
	}
}
