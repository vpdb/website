export class GameResource {
	/**
	 * @param $resource
	 * @param {ConfigService} ConfigService
	 * @ngInject
	 */
	constructor($resource, ConfigService) {
		return $resource(ConfigService.apiUri('/v1/games/:id'), {}, {
			head: { method: 'HEAD' },
			update: { method: 'PATCH' }
		});
	}
}

export class GameRatingResource {
	/**
	 * @param $resource
	 * @param {ConfigService} ConfigService
	 * @ngInject
	 */
	constructor($resource, ConfigService) {
		return $resource(ConfigService.apiUri('/v1/games/:gameId/rating'), {}, {
			'update': { method: 'PUT' }
		});
	}
}

export class GameStarResource {
	/**
	 * @param $resource
	 * @param {ConfigService} ConfigService
	 * @ngInject
	 */
	constructor($resource, ConfigService) {
		return $resource(ConfigService.apiUri('/v1/games/:gameId/star'), {}, {
		});
	}
}

export class GameRequestResource {
	/**
	 * @param $resource
	 * @param {ConfigService} ConfigService
	 * @ngInject
	 */
	constructor($resource, ConfigService) {
		return $resource(ConfigService.apiUri('/v1/game_requests/:id'), {}, {
			update: { method: 'PATCH' }
		});
	}
}

export class GameReleaseNameResource {
	/**
	 * @param $resource
	 * @param {ConfigService} ConfigService
	 * @ngInject
	 */
	constructor($resource, ConfigService) {
		return $resource(ConfigService.apiUri('/v1/games/:gameId/release-name'), {}, {});
	}
}
