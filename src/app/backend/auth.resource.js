export class AuthResource {
	constructor($resource, ConfigService) {
		return $resource(ConfigService.apiUri('/authenticate/:strategy'), {}, {
			authenticate: { method: 'POST' },
			authenticateCallback: { method: 'GET' }
		});
	}
}

export class AuthRedirectResource {
	constructor($resource, ConfigService) {
		return $resource(ConfigService.apiUri('/redirect/:strategy'), {}, {
		});
	}
}

export class TokenResource {
	constructor($resource, ConfigService) {
		return $resource(ConfigService.apiUri('/tokens/:id'), { }, {
			update: { method: 'PATCH' }
		});
	}
}

export class ProfileResource {
	constructor($resource, ConfigService) {
		return $resource(ConfigService.apiUri('/user/:action/:id'), {}, {
			patch: { method: 'PATCH' },
			confirm: { method: 'GET', params: { action: 'confirm' }},
			logs: { method: 'GET', params: { action: 'logs' }, isArray: true }
		});
	}
}
