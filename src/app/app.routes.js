/*
 * VPDB - Virtual Pinball Database
 * Copyright (C) 2018 freezy <freezy@vpdb.io>
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.
 */

import HomeTpl from './home/home.pug';
import Error404Tpl from './errors/error.404.pug';
import ConfigService from './core/config.service';

import { GAME_LIST, GAME_DETAILS } from './games/game.states';
import { GAME_ADMIN_ADD, GAME_ADMIN_EDIT } from './games/admin/game.admin.states';
import { RELEASE_LIST, RELEASE_DETAILS } from './releases/release.states';
import { RELEASE_ADD, RELEASE_VERSION_ADD, RELEASE_EDIT } from './releases/admin/release.admin.states';
import { BACKGLASS_ADD } from './backglasses/admin/backglass.admin.states';
import { AUTH_CALLBACK, CONFIRM_TOKEN } from './common/common.states';
import { PROFILE_DOWNLOADS, PROFILE_NOTIFICATIONS, PROFILE_ROOT, PROFILE_SETTINGS, PROFILE_STATS } from './profile/profile.states';
import { ADMIN_BUILDS, ADMIN_USERS, ADMIN_UPLOADS, ADMIN_TOKENS } from './admin/admin.states';
import { CONTENT_ABOUT, CONTENT_FAQ, CONTENT_LEGAL, CONTENT_PRIVACY, CONTENT_RULES } from './content/content.states';

/**
 * @param $urlRouterProvider
 * @param $locationProvider
 * @param $stateProvider
 * @param $sceDelegateProvider
 * @param {Config} Config
 * @ngInject
 */
export default function routes($urlRouterProvider, $locationProvider, $stateProvider, $sceDelegateProvider, Config) {

	// home
	$stateProvider.state('home',              { url: '/', templateUrl: HomeTpl, controller: 'HomeCtrl', controllerAs: 'vm' });

	// games (lazy loaded)
	$stateProvider.state(GAME_LIST);
	$stateProvider.state(GAME_DETAILS);
	$stateProvider.state(GAME_ADMIN_ADD);
	$stateProvider.state(GAME_ADMIN_EDIT);

	// releases (lazy loaded)
	$stateProvider.state(RELEASE_LIST);
	$stateProvider.state(RELEASE_DETAILS);
	$stateProvider.state(RELEASE_ADD);
	$stateProvider.state(RELEASE_VERSION_ADD);
	$stateProvider.state(RELEASE_EDIT);

	// backglasses (lazy loaded)
	$stateProvider.state(BACKGLASS_ADD);

	// auth
	$stateProvider.state(AUTH_CALLBACK);
	$stateProvider.state(CONFIRM_TOKEN);

	// profile (lazy loaded)
	$stateProvider.state(PROFILE_ROOT);
	$stateProvider.state(PROFILE_SETTINGS);
	$stateProvider.state(PROFILE_DOWNLOADS);
	$stateProvider.state(PROFILE_NOTIFICATIONS);
	$stateProvider.state(PROFILE_STATS);

	// admin
	$stateProvider.state(ADMIN_USERS);
	$stateProvider.state(ADMIN_BUILDS);
	$stateProvider.state(ADMIN_UPLOADS);
	$stateProvider.state(ADMIN_TOKENS);

	// content
	$stateProvider.state(CONTENT_ABOUT);
	$stateProvider.state(CONTENT_RULES);
	$stateProvider.state(CONTENT_FAQ);
	$stateProvider.state(CONTENT_LEGAL);
	$stateProvider.state(CONTENT_PRIVACY);

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
