export default class FaqCtrl {

	/**
	 * Class constructor
	 * @param {App} App
	 * @param {TrackerService} TrackerService
	 * @ngInject
	 */
	constructor(App, TrackerService) {

		App.theme('dark');
		App.setTitle('FAQ');
		App.setMenu('faq');
		App.setMeta({
			description: 'Terms and conditions of the VPDB website.',
			keywords: 'vpdb, legal, terms of use, terms and conditions'
		});
		TrackerService.trackPage();
	}
}