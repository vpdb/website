export class BuildResource {
	/**
	 * @param $resource
	 * @param {ConfigService} ConfigService
	 * @ngInject
	 */
	constructor($resource, ConfigService) {
		return $resource(ConfigService.apiUri('/v1/builds/:id'), {}, {
			update: { method: 'PATCH' }
		});
	}
}
