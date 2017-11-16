export class BackglassResource {
	/**
	 * @param $resource
	 * @param {ConfigService} ConfigService
	 * @ngInject
	 */
	constructor($resource, ConfigService) {
		return $resource(ConfigService.apiUri('/backglasses/:id'), {}, {
			update: { method: 'PATCH' }
		});
	}
}

export class BackglassModerationResource {
	/**
	 * @param $resource
	 * @param {ConfigService} ConfigService
	 * @ngInject
	 */
	constructor($resource, ConfigService) {
		return $resource(ConfigService.apiUri('/backglasses/:id/moderate'), {}, {
		});
	}
}
