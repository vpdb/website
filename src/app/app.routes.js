routing.$inject = ['$urlRouterProvider', '$locationProvider', '$stateProvider'];

export default function routing($urlRouterProvider, $locationProvider, $stateProvider) {

	// home
	$stateProvider.state('home',           { url: '/',
	                                         template: require('./home/home.pug'), controller: 'HomeCtrl', controllerAs: 'vm' });

	// games
	$stateProvider.state('games',          { url: '/games',
	                                         template: require('./games/list.pug'), controller: 'GameListCtrl', controllerAs: 'vm' });
	$stateProvider.state('gameDetails',    { url: '/games/:id',
	                                         template: require('./games/details.pug'), controller: 'GameDetailsCtrl', controllerAs: 'vm' });
	$stateProvider.state('addGame',        { url: '/add-game',
	                                         template: require('./games/add.pug'), controller: 'AdminGameAddCtrl', controllerAs: 'vm' });

	// releases
	$stateProvider.state('releases',       { url: '/releases?builds',
	                                         template: require('./releases/list.pug'), controller: 'ReleaseListCtrl', controllerAs: 'vm', reloadOnSearch: false });
	$stateProvider.state('releaseDetails', { url: '/games/:id/releases/:releaseId',
	                                         template: require('./releases/details.pug'), controller: 'ReleaseDetailsCtrl', controllerAs: 'vm' });
	$stateProvider.state('addRelease',     { url: '/games/:id/add-release',
	                                         template: require('./releases/add.pug'), controller: 'ReleaseAddCtrl', controllerAs: 'vm' });

	// backglasses
	$stateProvider.state('addBackglass',   { url: '/games/:id/add-backglass',
	                                         template: require('./backglasses/add.pug'), controller: 'BackglassAddCtrl', controllerAs: 'vm' });



	// auth
	$stateProvider.state('authCallback',   { url: '/auth/:strategy/callback?code',
	                                         template: require('./auth/auth.callback.pug'), controller: 'AuthCallbackCtrl', controllerAs: 'vm' });

	// profile
	$stateProvider.state('profile',        { url: '/profile',
	                                         template: require('./profile/profile.pug'), controller: 'ProfileCtrl', controllerAs: 'vm' });
	$stateProvider.state('profile.settings',       { url: '/settings',
	                                                 template: require('./profile/profile.settings.pug'), controller: 'ProfileSettingsCtrl', controllerAs: 'vm' });
	$stateProvider.state('profile.downloads',      { url: '/downloads',
	                                                 template: require('./profile/profile.downloads.pug'), controller: 'ProfileDownloadsCtrl', controllerAs: 'vm' });
	$stateProvider.state('profile.notifications',  { url: '/notifications',
	                                                 template: require('./profile/profile.notifications.pug'), controller: 'ProfileNotificationsCtrl', controllerAs: 'vm' });
	$stateProvider.state('profile.stats',          { url: '/stats',
	                                                 template: require('./profile/profile.stats.pug'), controller: 'ProfileStatsCtrl', controllerAs: 'vm' });

	// admin
	$stateProvider.state('adminUsers',     { url: '/admin/users',
	                                         template: require('./users/list.pug'), controller: 'AdminUserListCtrl', controllerAs: 'vm' });
	$stateProvider.state('adminBuilds',    { url: '/admin/builds',
	                                         template: require('./builds/list.pug'), controller: 'AdminBuildListCtrl', controllerAs: 'vm' });
	$stateProvider.state('adminUploads',   { url: '/admin/uploads',
	                                         template: require('./uploads/list.pug'), controller: 'AdminUploadsCtrl', controllerAs: 'vm' });

	// content
	$stateProvider.state('about',          { url: '/about',
	                                         template: require('./content/about.pug'), controller: 'AboutCtrl', controllerAs: 'vm' });
	$stateProvider.state('rules',          { url: '/about',
	                                         template: require('./content/rules.pug'), controller: 'RulesCtrl', controllerAs: 'vm' });
	$stateProvider.state('faq',            { url: '/faq',
	                                         template: require('./content/faq.pug'), controller: 'FaqCtrl', controllerAs: 'vm' });
	$stateProvider.state('legal',          { url: '/legal',
	                                         template: require('./content/legal.pug'), controller: 'LegalCtrl', controllerAs: 'vm' });
	$stateProvider.state('privacy',        { url: '/privacy',
	                                         template: require('./content/privacy.pug'), controller: 'PrivacyCtrl', controllerAs: 'vm' });

	$locationProvider.html5Mode(true);
	$urlRouterProvider.otherwise('/');
}