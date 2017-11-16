export default class LegalCtrl {

	/**
	 * Class constructor
	 * @param {App} App
	 * @param {ConfigService} ConfigService
	 * @param {TrackerService} TrackerService
	 * @ngInject
	 */
	constructor(App, ConfigService, TrackerService) {

		App.theme('dark');
		App.setTitle('Terms of Use');
		App.setMenu('legal');
		App.setMeta({
			description: 'Answers to the most frequently asked questions.',
			keywords: 'vpdb, faq'
		});
		this.privacyUrl = ConfigService.webUri('/privacy');
		TrackerService.trackPage();
	}
}