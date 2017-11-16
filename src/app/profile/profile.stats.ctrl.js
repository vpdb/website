export default class ProfileStatsCtrl {

	/**
	 * @param ProfileResource
	 * @ngInject
	 */
	constructor(ProfileResource) {
		this.logins = ProfileResource.logs({ event: 'authenticate', per_page: 10 });
	}
}

