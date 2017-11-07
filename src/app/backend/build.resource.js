export class BuildResource {
	constructor($resource, ConfigService) {
		return $resource(ConfigService.apiUri('/builds/:id'), {}, {
			update: { method: 'PATCH' }
		});
	}
}
