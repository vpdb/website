export class GameResource {
	constructor($resource, ConfigService) {
		return $resource(ConfigService.apiUri('/games/:id'), {}, {
			head: { method: 'HEAD' },
			update: { method: 'PATCH' }
		});
	}
}

export class GameRatingResource {
	constructor($resource, ConfigService) {
		return $resource(ConfigService.apiUri('/games/:gameId/rating'), {}, {
			'update': { method: 'PUT' }
		});
	}
}

export class GameStarResource {
	constructor($resource, ConfigService) {
		return $resource(ConfigService.apiUri('/games/:gameId/star'), {}, {
		});
	}
}

export class GameRequestResource {
	constructor($resource, ConfigService) {
		return $resource(ConfigService.apiUri('/game_requests/:id'), {}, {
			update: { method: 'PATCH' }
		});
	}
}

export class GameReleaseNameResource {
	constructor($resource, ConfigService) {
		return $resource(ConfigService.apiUri('/games/:gameId/release-name'), {}, {});
	}
}
