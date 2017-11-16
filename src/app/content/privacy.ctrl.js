export default class PrivacyCtrl {

	/**
	 * Class constructor
	 * @param {App} App
	 * @param {TrackerService} TrackerService
	 * @ngInject
	 */
	constructor(App, TrackerService) {

		App.theme('dark');
		App.setTitle('Privacy Policy');
		App.setMenu('privacy');
		App.setMeta({
			description: 'Privacy policy of the VPDB website.',
			keywords: 'vpdb, legal, privacy policy'
		});
		TrackerService.trackPage();
	}
}