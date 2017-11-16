export class BuildResource {
	/**
	 * @param $resource
	 * @param {ConfigService} ConfigService
	 * @ngInject
	 */
	constructor($resource, ConfigService) {
		return $resource(ConfigService.apiUri('/builds/:id'), {}, {
			update: { method: 'PATCH' }
		});
	}
}
