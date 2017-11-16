import { isEmpty }  from 'lodash';

export default class LoginService {

	/**
	 * @param {Config} Config
	 * @ngInject
	 */
	constructor(Config) {
		this.loginParams = {
			open: false,
			localOnly: !Config.authProviders.google && !Config.authProviders.github && isEmpty(Config.authProviders.ipboard)
		};
	}
}