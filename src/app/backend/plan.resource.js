export class PlanResource {
	constructor($resource, ConfigService) {
		return $resource(ConfigService.apiUri('/plans'), {}, {
		});
	}
}
