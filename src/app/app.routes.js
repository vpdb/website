import HomeTpl from './home/home.pug';
import GameListTpl from './games/game.list.pug';
import GameDetailsTpl from './games/game.details.pug';
import GameAdminAddTpl from './games/game.admin.add.pug';
import ReleaseListTpl from './releases/release.list.pug';
import ReleaseDetailsTpl from './releases/release.details.pug';
import ReleaseAddTpl from './releases/release.add.pug';
import BackglassAddTpl from './backglasses/backglass.add.pug';
import AuthCallbackTpl from './auth/auth.callback.pug';
import EmailConfirmationTpl from './auth/email.confirmation.pug';
import ProfileCtrl from './profile/profile.pug';
import ProfileSettingsTpl from './profile/profile.settings.pug';
import ProfileDownloadsTpl from './profile/profile.downloads.pug';
import ProfileNotificationsTpl from './profile/profile.notifications.pug';
import ProfileStatsTpl from './profile/profile.stats.pug';
import UserAdminListTpl from './users/user.admin.list.pug';
import BuildAdminListTpl from './builds/build.admin.list.pug';
import UploadsAdminListTpl from './uploads/uploads.admin.list.pug';
import AboutTpl from './content/about.pug';
import RulesTpl from './content/rules.pug';
import FaqTpl from './content/faq.pug';
import LegalTpl from './content/legal.pug';
import PrivacyTpl from './content/privacy.pug';
import Error404Tpl from './errors/error.404.pug';
import ConfigService from './core/config.service';

export default function routes($urlRouterProvider, $locationProvider, $stateProvider, $sceDelegateProvider, Config) {

	// home
	$stateProvider.state('home',           { url: '/', templateUrl: HomeTpl, controller: 'HomeCtrl', controllerAs: 'vm' });

	// games
	$stateProvider.state('games',          { url: '/games', templateUrl: GameListTpl });
	$stateProvider.state('gameDetails',    { url: '/games/:id', templateUrl: GameDetailsTpl });
	$stateProvider.state('addGame',        { url: '/add-game', templateUrl: GameAdminAddTpl });

	// releases
	$stateProvider.state('releases',       { url: '/releases?builds', templateUrl: ReleaseListTpl, reloadOnSearch: false });
	$stateProvider.state('releaseDetails', { url: '/games/:id/releases/:releaseId', templateUrl: ReleaseDetailsTpl, controller: 'ReleaseDetailsCtrl', controllerAs: 'vm' });
	$stateProvider.state('addRelease',     { url: '/games/:id/add-release', templateUrl: ReleaseAddTpl });

	// backglasses
	$stateProvider.state('addBackglass',   { url: '/games/:id/add-backglass', templateUrl: BackglassAddTpl });

	// auth
	$stateProvider.state('authCallback',   { url: '/auth/:strategy/callback?code', templateUrl: AuthCallbackTpl });
	$stateProvider.state('confirmToken',   { url: '/confirm/:token', templateUrl: EmailConfirmationTpl });

	// profile
	$stateProvider.state('profile',        { url: '/profile', templateUrl: ProfileCtrl });
	$stateProvider.state('profile.settings',       { url: '/settings', templateUrl: ProfileSettingsTpl, controller: 'ProfileSettingsCtrl', controllerAs: 'vm' });
	$stateProvider.state('profile.downloads',      { url: '/downloads', templateUrl: ProfileDownloadsTpl, controller: 'ProfileDownloadsCtrl', controllerAs: 'vm' });
	$stateProvider.state('profile.notifications',  { url: '/notifications', templateUrl: ProfileNotificationsTpl, controller: 'ProfileNotificationsCtrl', controllerAs: 'vm' });
	$stateProvider.state('profile.stats',          { url: '/stats', templateUrl: ProfileStatsTpl, controller: 'ProfileStatsCtrl', controllerAs: 'vm' });

	// admin
	$stateProvider.state('adminUsers',     { url: '/admin/users', templateUrl: UserAdminListTpl });
	$stateProvider.state('adminBuilds',    { url: '/admin/builds', templateUrl: BuildAdminListTpl });
	$stateProvider.state('adminUploads',   { url: '/admin/uploads', templateUrl: UploadsAdminListTpl });

	// content
	$stateProvider.state('about',          { url: '/about', templateUrl: AboutTpl });
	$stateProvider.state('rules',          { url: '/rules', templateUrl: RulesTpl });
	$stateProvider.state('faq',            { url: '/faq', templateUrl: FaqTpl });
	$stateProvider.state('legal',          { url: '/legal', templateUrl: LegalTpl });
	$stateProvider.state('privacy',        { url: '/privacy', templateUrl: PrivacyTpl });

	// errors
	$stateProvider.state('404',            { templateUrl: Error404Tpl, params: { url: null } });

	$locationProvider.html5Mode({
		enabled: true,
		requireBase: false
	});

	$urlRouterProvider.otherwise(($injector, $location) => {
		$injector.get('$state').go('404', { url: $location.path() });
		return $location.path();
	});

	$sceDelegateProvider.resourceUrlWhitelist([
		'self', // Allow same origin resource loads.
		ConfigService.uri(Config.apiUri) + '/**',
		ConfigService.uri(Config.storageUri) + '/**',
	]);
}