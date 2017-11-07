export default class AboutCtrl {

	/**
	 * Class constructor
	 * @param {App} App
	 * @param {TrackerService} TrackerService
	 */
	constructor(App, TrackerService) {

		App.theme('dark');
		App.setTitle('About VPDB');
		App.setMenu('about');
		App.setMeta({
			description: 'What VPDB is about and how it came to life.',
			keywords: 'vpdb, about, open source, accessible, beautiful, fast'
		});
		TrackerService.trackPage();
	}
}