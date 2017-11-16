/**
 * Tracker service.
 *
 * @see https://developers.google.com/analytics/devguides/collection/analyticsjs/
 * @author freezy <freezy@vpdb.io>
 */
export default class TrackerService {

	/**
	 * @param $rootScope
	 * @param {Config} Config
	 * @param {AuthService} AuthService
	 * @ngInject
	 */
	constructor($rootScope, Config, AuthService) {

		this.$rootScope = $rootScope;
		this.Config = Config;

		if (this.Config.ga && this.Config.ga.enabled) {
			if (AuthService.user) {
				ga('create', this.Config.ga.id, 'auto', { userId: AuthService.user.id });
			} else {
				ga('create', this.Config.ga.id, 'auto');
			}
			this.$rootScope.$on('userUpdated', (event, user) => {
				if (user) {
					ga('set', 'userId', user.id);
				}
			});

		} else {
			console.info('Google Analytics disabled.');
		}
	}

	/**
	 * Tracks a page view.
	 */
	trackPage() {
		if (this.Config.ga && this.Config.ga.enabled) {
			ga('send', 'pageview');
		}
	}
}