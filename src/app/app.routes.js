routing.$inject = ['$urlRouterProvider', '$locationProvider', '$stateProvider'];

export default function routing($urlRouterProvider, $locationProvider, $stateProvider) {

	// home
	$stateProvider.state('home',           { url: '/', template: require('./home/home.pug'), controller: 'HomeCtrl', controllerAs: 'vm' });

	// games
	$stateProvider.state('games',          { url: '/games', template: require('./games/game.list.pug') });
	$stateProvider.state('gameDetails',    { url: '/games/:id', template: require('./games/game.details.pug') });
	$stateProvider.state('addGame',        { url: '/add-game', template: require('./games/game.admin.add.pug') });

	// releases
	$stateProvider.state('releases',       { url: '/releases?builds', template: require('./releases/release.list.pug'), reloadOnSearch: false });
	$stateProvider.state('releaseDetails', { url: '/games/:id/releases/:releaseId', template: require('./releases/release.details.pug'), controller: 'ReleaseDetailsCtrl', controllerAs: 'vm' });
	$stateProvider.state('addRelease',     { url: '/games/:id/add-release', template: require('./releases/release.add.pug') });

	// backglasses
	$stateProvider.state('addBackglass',   { url: '/games/:id/add-backglass', template: require('./backglasses/backglass.add.pug') });

	// auth
	$stateProvider.state('authCallback',   { url: '/auth/:strategy/callback?code', template: require('./auth/auth.callback.pug') });

	// profile
	$stateProvider.state('profile',        { url: '/profile', template: require('./profile/profile.pug') });
	$stateProvider.state('profile.settings',       { url: '/settings', template: require('./profile/profile.settings.pug'), controller: 'ProfileSettingsCtrl', controllerAs: 'vm' });
	$stateProvider.state('profile.downloads',      { url: '/downloads', template: require('./profile/profile.downloads.pug'), controller: 'ProfileDownloadsCtrl', controllerAs: 'vm' });
	$stateProvider.state('profile.notifications',  { url: '/notifications', template: require('./profile/profile.notifications.pug'), controller: 'ProfileNotificationsCtrl', controllerAs: 'vm' });
	$stateProvider.state('profile.stats',          { url: '/stats', template: require('./profile/profile.stats.pug'), controller: 'ProfileStatsCtrl', controllerAs: 'vm' });

	// admin
	$stateProvider.state('adminUsers',     { url: '/admin/users', template: require('./users/user.admin.list.pug') });
	$stateProvider.state('adminBuilds',    { url: '/admin/builds', template: require('./builds/build.admin.list.pug') });
	$stateProvider.state('adminUploads',   { url: '/admin/uploads', template: require('./uploads/uploads.admin.list.pug') });

	// content
	$stateProvider.state('about',          { url: '/about', template: require('./content/about.pug') });
	$stateProvider.state('rules',          { url: '/rules', template: require('./content/rules.pug') });
	$stateProvider.state('faq',            { url: '/faq', template: require('./content/faq.pug') });
	$stateProvider.state('legal',          { url: '/legal', template: require('./content/legal.pug') });
	$stateProvider.state('privacy',        { url: '/privacy', template: require('./content/privacy.pug') });

	$locationProvider.html5Mode(true);
	$urlRouterProvider.otherwise('/');
}