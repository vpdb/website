import { cloneDeep, pickBy, isObject, isArray, defaultsDeep } from 'lodash';

/**
 * This is a helper class that manages mapping between the URL,
 * the internal data model and the backend's API model, where each
 * might have different names or types.
 *
 * @author freezy <freezy@vpdb.io>
 */
export class Params {

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

export class Param {

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
		this.reqCondition = obj.reqCondition || (v => true);
	}

}