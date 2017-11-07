export class RomResource {
	constructor($resource, ConfigService) {
		return $resource(ConfigService.apiUri('/games/:id/roms'), {}, {
		});
	}
}
