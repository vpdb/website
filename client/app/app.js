"use strict"; /* global ga, _ */

// TODO isolate namespace
// common deps
var deps = [
	'ngAnimate',
	'ngSanitize',
	'ngResource',
	'ngStorage',
	'ngDragDrop',
	'angularFileUpload',
	'angularMoment',
	'ui.router',
	'ui.bootstrap',
	'ui.gravatar',
	'angulartics',
	'angulartics.google.analytics',
	'monospaced.elastic',
	'sun.scrollable',
	'growlNotifications'
];

// main application modules
var appDeps = [
	'vpdb.auth',
	'vpdb.login',
	'vpdb.home',
	'vpdb.commons',
	'vpdb.modal',
	'vpdb.games.list',
	'vpdb.games.details',
	'vpdb.games.add',
	'vpdb.profile.settings',
	'vpdb.releases.add',
	'vpdb.users.list',
	'vpdb.users.edit'
];

var common = angular.module('vpdb.commons', []);

/**
 * The VPDB main application.
 */
angular.module('vpdb', deps.concat(appDeps))

	.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

		// routes
		$stateProvider.state('home',             { url: '/',                             templateUrl: '/home/home.html' });
		$stateProvider.state('games',            { url: '/games',                        templateUrl: '/games/list.html' });
		$stateProvider.state('gameDetails',      { url: '/game/:id',                     templateUrl: '/games/details.html' });
		$stateProvider.state('addGame',          { url: '/games/add',                    templateUrl: '/games/add.html' });
		$stateProvider.state('addRelease',       { url: '/game/:id/add-release',         templateUrl: '/releases/add.html' });
		$stateProvider.state('adminUsers',       { url: '/admin/users',                  templateUrl: '/users/list.html' });
		$stateProvider.state('profile',          { url: '/profile',                      templateUrl: '/profile/profile.html' });
		$stateProvider.state('profile.settings',         { url: '/settings',             templateUrl: '/profile/settings.html', controller: 'ProfileSettingsCtrl' });
		$stateProvider.state('profile.stats',            { url: '/stats',                templateUrl: '/profile/stats.html' });
		$stateProvider.state('authCallback',     { url: '/auth/:strategy/callback?code', templateUrl: '/auth/authenticating.html' });
		$stateProvider.state('confirmToken',     { url: '/confirm/:token',               templateUrl: '/auth/confirm.html' });

		//$stateProvider.state('notfound', { templateUrl: '/auth/confirm.html' });
		//$urlRouterProvider.otherwise('/state1'); // $routeProvider.otherwise({ templateUrl: '/errors/404.html' });
		$locationProvider.html5Mode({
			enabled: true,
			requireBase: false
		});
	})

	.config(['msdElasticConfig', function(config) {
		config.append = '\n\n';
	}]);

/**
 * The developer site
 */
angular.module('devsite', deps.concat(appDeps).concat([ 'duScroll', 'vpdb.devsite' ]))

	.config(function($locationProvider) {
		$locationProvider.html5Mode({
			enabled: true,
			requireBase: false
		});
	});


// http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
window.requestAnimFrame = (function() {
	return window.requestAnimationFrame    ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame    ||
		function(callback) {
			window.setTimeout(callback, 1000 / 60);
		};
})();

