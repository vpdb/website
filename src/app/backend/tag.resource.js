export class TagResource {
	constructor($resource, ConfigService) {
		return $resource(ConfigService.apiUri('/tags/:id'), {}, {
		});
	}
}
