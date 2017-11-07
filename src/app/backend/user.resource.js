export class UserResource {
	constructor($resource, ConfigService) {
		return $resource(ConfigService.apiUri('/users/:userid'), {}, {
			update: { method: 'PUT' },
			register: { method: 'POST' },
			login: { method: 'POST', params: { userid : 'login'} },
			logout: { method: 'POST', params: { userid : 'logout'} }
		});
	}
}

export class UserStarResource {
	constructor($resource, ConfigService) {
		return $resource(ConfigService.apiUri('/users/:userId/star'), {}, {
		});
	}
}

export class UserConfirmationResource {
	constructor($resource, ConfigService) {
		return $resource(ConfigService.apiUri('/users/:userId/send-confirmation'), {}, {
			send: { method: 'POST' }
		});
	}
}
