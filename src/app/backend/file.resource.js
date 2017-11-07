export class FileResource {
	constructor($resource, ConfigService) {
		return $resource(ConfigService.apiUri('/files/:id'), {}, {
		});
	}
}

export class FileBlockmatchResource {
	constructor($resource, ConfigService) {
		return $resource(ConfigService.apiUri('/files/:id/blockmatch'), {}, {
		});
	}
}
