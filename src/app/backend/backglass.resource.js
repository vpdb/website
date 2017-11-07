export class BackglassResource {
	constructor($resource, ConfigService) {
		return $resource(ConfigService.apiUri('/backglasses/:id'), {}, {
			update: { method: 'PATCH' }
		});
	}
}

export class BackglassModerationResource {
	constructor($resource, ConfigService) {
		return $resource(ConfigService.apiUri('/backglasses/:id/moderate'), {}, {
		});
	}
}
