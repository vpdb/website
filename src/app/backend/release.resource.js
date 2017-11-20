export class ReleaseResource {
	/**
	 * @param $resource
	 * @param {ConfigService} ConfigService
	 * @ngInject
	 */
	constructor($resource, ConfigService) {
		return $resource(ConfigService.apiUri('/v1/releases/:release'), {}, {
			update: { method: 'PATCH' }
		});
	}
}

export class ReleaseCommentResource {
	/**
	 * @param $resource
	 * @param {ConfigService} ConfigService
	 * @ngInject
	 */
	constructor($resource, ConfigService) {
		return $resource(ConfigService.apiUri('/v1/releases/:releaseId/comments'), {}, {
		});
	}
}

export class ReleaseRatingResource {
	/**
	 * @param $resource
	 * @param {ConfigService} ConfigService
	 * @ngInject
	 */
	constructor($resource, ConfigService) {
		return $resource(ConfigService.apiUri('/v1/releases/:releaseId/rating'), {}, {
			update: { method: 'PUT' }
		});
	}
}

export class ReleaseStarResource {
	/**
	 * @param $resource
	 * @param {ConfigService} ConfigService
	 * @ngInject
	 */
	constructor($resource, ConfigService) {
		return $resource(ConfigService.apiUri('/v1/releases/:releaseId/star'), {}, {
		});
	}
}

export class ReleaseModerationResource {
	/**
	 * @param $resource
	 * @param {ConfigService} ConfigService
	 * @ngInject
	 */
	constructor($resource, ConfigService) {
		return $resource(ConfigService.apiUri('/v1/releases/:releaseId/moderate'), {}, {
		});
	}
}

export class ReleaseModerationCommentResource {
	/**
	 * @param $resource
	 * @param {ConfigService} ConfigService
	 * @ngInject
	 */
	constructor($resource, ConfigService) {
		return $resource(ConfigService.apiUri('/v1/releases/:releaseId/moderate/comments'), {}, {
		});
	}
}

export class ReleaseVersionResource {
	/**
	 * @param $resource
	 * @param {ConfigService} ConfigService
	 * @ngInject
	 */
	constructor($resource, ConfigService) {
		return $resource(ConfigService.apiUri('/v1/releases/:releaseId/versions/:version'), {}, {
			update: { method: 'PATCH' }
		});
	}
}

export class ReleaseFileValidationResource {
	/**
	 * @param $resource
	 * @param {ConfigService} ConfigService
	 * @ngInject
	 */
	constructor($resource, ConfigService) {
		return $resource(ConfigService.apiUri('/v1/releases/:releaseId/versions/:version/files/:fileId/validate'), {}, {
		});
	}
}