export class AuthResource {
	/**
	 * @param $resource
	 * @param {ConfigService} ConfigService
	 * @ngInject
	 */
	constructor($resource, ConfigService) {
		return $resource(ConfigService.apiUri('/v1/authenticate/:strategy'), {}, {
			authenticate: { method: 'POST' },
			authenticateCallback: { method: 'GET' }
		});
	}
}

export class AuthRedirectResource {
	/**
	 * @param $resource
	 * @param {ConfigService} ConfigService
	 * @ngInject
	 */
	constructor($resource, ConfigService) {
		return $resource(ConfigService.apiUri('/v1/redirect/:strategy'), {}, {
		});
	}
}

export class TokenResource {
	/**
	 * @param $resource
	 * @param {ConfigService} ConfigService
	 * @ngInject
	 */
	constructor($resource, ConfigService) {
		return $resource(ConfigService.apiUri('/v1/tokens/:id'), { }, {
			update: { method: 'PATCH' }
		});
	}
}

export class ProfileResource {
	/**
	 * @param $resource
	 * @param {ConfigService} ConfigService
	 * @ngInject
	 */
	constructor($resource, ConfigService) {
		return $resource(ConfigService.apiUri('/v1/user/:action/:id'), {}, {
			patch: { method: 'PATCH' },
			confirm: { method: 'GET', params: { action: 'confirm' }},
			logs: { method: 'GET', params: { action: 'logs' }, isArray: true }
		});
	}
}
