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

import { isArray } from 'lodash';

export default class Param {

	/**
	 * @param {{ name:string, defaultValue:*, [urlName]:string, [reqName]:string, [fromUrl]:function, [toUrl]:function, [toReq]:function, [reqCondition]:function }} obj
	 */
	constructor(obj) {
		/**
		 * The name in our internal mode, i.e. what's accessible in the view.
		 * @type {string}
		 */
		this.name = obj.name;

		/**
		 * The initial value without user interaction.
		 * @type {*}
		 */
		this.defaultValue = obj.defaultValue;

		/**
		 * The name of the variable in the backend's API.
		 * @type {string}
		 */
		this.reqName = obj.reqName || obj.name;

		/**
		 * The name of the variable when passed through the URL.
		 * @type {string}
		 */
		this.urlName = obj.urlName || this.reqName;

		/**
		 * Converts the value from the URL to the model. If null, value is never read from the URL.
		 * @type {function}
		 */
		this.fromUrl = obj.fromUrl || (isArray(this.defaultValue) ? b => b.split(',') : (v => v));

		/**
		 * Converts the value from the model to the backend API.
		 * @type {function}
		 */
		this.toReq = obj.toReq || (isArray(this.defaultValue) ? b => b.join(',') : (v => v));

		/**
		 * Converts the value from the model to the URL.
		 * @type {function}
		 */
		this.toUrl = obj.toUrl || this.toReq;

		/**
		 * Condition for the request variable to be added.
		 * @type {function}
		 */
		this.reqCondition = obj.reqCondition || (() => true);
	}

}
