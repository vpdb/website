export class IpdbResource {
	constructor($resource, ConfigService) {
		return $resource(ConfigService.apiUri('/ipdb/:id'), {}, {
		});
	}
}
