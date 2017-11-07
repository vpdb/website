export class RolesResource {
	constructor($resource, ConfigService) {
		return $resource(ConfigService.apiUri('/roles/:role'), {}, {
		});
	}
}
