export class ReleaseResource {
	constructor($resource, ConfigService) {
		return $resource(ConfigService.apiUri('/releases/:release'), {}, {
			update: { method: 'PATCH' }
		});
	}
}

export class ReleaseCommentResource {
	constructor($resource, ConfigService) {
		return $resource(ConfigService.apiUri('/releases/:releaseId/comments'), {}, {
		});
	}
}

export class ReleaseRatingResource {
	constructor($resource, ConfigService) {
		return $resource(ConfigService.apiUri('/releases/:releaseId/rating'), {}, {
			update: { method: 'PUT' }
		});
	}
}

export class ReleaseStarResource {
	constructor($resource, ConfigService) {
		return $resource(ConfigService.apiUri('/releases/:releaseId/star'), {}, {
		});
	}
}

export class ReleaseModerationResource {
	constructor($resource, ConfigService) {
		return $resource(ConfigService.apiUri('/releases/:releaseId/moderate'), {}, {
		});
	}
}

export class ReleaseModerationCommentResource {
	constructor($resource, ConfigService) {
		return $resource(ConfigService.apiUri('/releases/:releaseId/moderate/comments'), {}, {
		});
	}
}

export class ReleaseVersionResource {
	constructor($resource, ConfigService) {
		return $resource(ConfigService.apiUri('/releases/:releaseId/versions/:version'), {}, {
			update: { method: 'PATCH' }
		});
	}
}

export class ReleaseFileValidationResource {
	constructor($resource, ConfigService) {
		return $resource(ConfigService.apiUri('/releases/:releaseId/versions/:version/files/:fileId/validate'), {}, {
		});
	}
}