import GameSelectModalTpl from './games/game.select.modal.pug';

/**
 * The application controller manages parts of the page that is common to
 * all pages, which is basically menu functionality.
 *
 * @author freezy <freezy@vpdb.io>
 */
export default class AppCtrl {

	/**
	 * @param $rootScope
	 * @param $state
	 * @param $localStorage
	 * @param $uibModal
	 * @param {App} App
	 * @param {AuthService} AuthService
	 * @param {Config} Config
	 */
	constructor($rootScope, $state, $localStorage, $uibModal, App, AuthService, Config) {
		console.log('Application controller loaded.');

		this.$state = $state;
		this.$uibModal = $uibModal;
		this.App = App;
		this.AuthService = AuthService;

		// scroll top top when navigating
		$rootScope.$on('$stateChangeSuccess', () => document.body.scrollTop = document.documentElement.scrollTop = 0);

		// legal documents update
		const currentDocumentRevisions = $localStorage.documentRevisions || Config.documentRevisions;
		this.showRulesUpdated = currentDocumentRevisions.rules < Config.documentRevisions.rules;
		this.showPrivacyUpdated = currentDocumentRevisions.privacy < Config.documentRevisions.privacy;
		this.showLegalUpdated = currentDocumentRevisions.legal < Config.documentRevisions.legal;
		$localStorage.documentRevisions = Config.documentRevisions;
	}

	login() {
		this.App.login();
	}

	uploadRelease() {
		this.$uibModal.open({
			templateUrl: GameSelectModalTpl,
			controller: 'GameSelectModalCtrl',
			controllerAs: 'vm',
			windowTopClass: 'modal--with-overflow',
			resolve: {
				params: () => {
					return {
						title: 'Upload Recreation',
						text: 'Search the game of the recreation you want to upload.'
					};
				}
			}
		}).result.then(game => {
			this.$state.go('addRelease', { id: game.id });
		});
	}

	uploadBackglass() {
		this.$uibModal.open({
			templateUrl: GameSelectModalTpl,
			controller: 'GameSelectModalCtrl',
			controllerAs: 'vm',
			windowTopClass: 'modal--with-overflow',
			resolve: {
				params: () => {
					return {
						title: 'Upload Direct B2S Backglass',
						text: 'Search the game of the backglass you want to upload.'
					};
				}
			}
		}).result.then(game => {
			this.$state.go('addBackglass', { id: game.id });
		});
	}
}
