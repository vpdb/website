export default class RulesCtrl {

	/**
	 * Class constructor
	 * @param {App} App
	 * @param {TrackerService} TrackerService
	 */
	constructor(App, TrackerService) {

		App.theme('dark');
		App.setTitle('VPDB Rules');
		App.setMenu('rules');
		App.setMeta({
			description: 'It is a great community but a few rules are important nevertheless.',
			keywords: 'vpdb, rules, stern sam'
		});
		TrackerService.trackPage();
	}
}