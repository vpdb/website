export default class ProfileStatsCtrl {

	constructor(ProfileResource) {
		this.logins = ProfileResource.logs({ event: 'authenticate', per_page: 10 });
	}
}

