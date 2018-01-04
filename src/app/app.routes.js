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
import GameListTpl from './games/game.list.pug';
import GameDetailsTpl from './games/game.details.pug';
import GameAddAdminTpl from './games/game.add.admin.pug';
import ReleaseListTpl from './releases/release.list.pug';
import ReleaseDetailsTpl from './releases/release.details.pug';
import ReleaseAddTpl from './releases/release.add.pug';
import ReleaseAddVersionTpl from './releases/release.add.version.pug';
import ReleaseEditFileTpl from './releases/release.edit.file.pug';
import BackglassAddTpl from './backglasses/backglass.add.pug';
import AuthCallbackTpl from './auth/auth.callback.pug';
import EmailConfirmationTpl from './auth/email.confirmation.pug';
import ProfileCtrl from './profile/profile.pug';
import ProfileSettingsTpl from './profile/profile.settings.pug';
import ProfileDownloadsTpl from './profile/profile.downloads.pug';
import ProfileNotificationsTpl from './profile/profile.notifications.pug';
import ProfileStatsTpl from './profile/profile.stats.pug';
import UserListAdminTpl from './users/user.list.admin.pug';
import BuildListAdminTpl from './builds/build.list.admin.pug';
import UploadsListAdminTpl from './uploads/uploads.list.admin.pug';
import AboutTpl from './content/about.pug';
import RulesTpl from './content/rules.pug';
import FaqTpl from './content/faq.pug';
import LegalTpl from './content/legal.pug';
import PrivacyTpl from './content/privacy.pug';
import Error404Tpl from './errors/error.404.pug';
import ConfigService from './core/config.service';

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

	// games
	$stateProvider.state('games',             { url: '/games', templateUrl: GameListTpl });
	$stateProvider.state('gameDetails',       { url: '/games/:id', templateUrl: GameDetailsTpl });
	$stateProvider.state('addGame',           { url: '/add-game', templateUrl: GameAddAdminTpl });

	// releases
	$stateProvider.state('releases',          { url: '/releases?builds', templateUrl: ReleaseListTpl, reloadOnSearch: false });
	$stateProvider.state('releaseDetails',    { url: '/games/:id/releases/:releaseId', templateUrl: ReleaseDetailsTpl, controller: 'ReleaseDetailsCtrl', controllerAs: 'vm' });
	$stateProvider.state('addRelease',        { url: '/games/:id/add-release', templateUrl: ReleaseAddTpl });
	$stateProvider.state('addReleaseVersion', { url: '/games/:id/releases/:releaseId/add', templateUrl: ReleaseAddVersionTpl });
	$stateProvider.state('editRelease',       { url: '/games/:id/releases/:releaseId/edit', templateUrl: ReleaseEditFileTpl });

	// backglasses
	$stateProvider.state('addBackglass',      { url: '/games/:id/add-backglass', templateUrl: BackglassAddTpl });

	// auth
	$stateProvider.state('authCallback',      { url: '/auth/:strategy/callback?code', templateUrl: AuthCallbackTpl });
	$stateProvider.state('confirmToken',      { url: '/confirm/:token', templateUrl: EmailConfirmationTpl });

	// profile
	$stateProvider.state('profile',           { url: '/profile', templateUrl: ProfileCtrl });
	$stateProvider.state('profile.settings',       { url: '/settings', templateUrl: ProfileSettingsTpl, controller: 'ProfileSettingsCtrl', controllerAs: 'vm' });
	$stateProvider.state('profile.downloads',      { url: '/downloads', templateUrl: ProfileDownloadsTpl, controller: 'ProfileDownloadsCtrl', controllerAs: 'vm' });
	$stateProvider.state('profile.notifications',  { url: '/notifications', templateUrl: ProfileNotificationsTpl, controller: 'ProfileNotificationsCtrl', controllerAs: 'vm' });
	$stateProvider.state('profile.stats',          { url: '/stats', templateUrl: ProfileStatsTpl, controller: 'ProfileStatsCtrl', controllerAs: 'vm' });

	// admin
	$stateProvider.state('adminUsers',        { url: '/admin/users', templateUrl: UserListAdminTpl });
	$stateProvider.state('adminBuilds',       { url: '/admin/builds', templateUrl: BuildListAdminTpl });
	$stateProvider.state('adminUploads',      { url: '/admin/uploads', templateUrl: UploadsListAdminTpl });

	// content
	$stateProvider.state('about',             { url: '/about', templateUrl: AboutTpl });
	$stateProvider.state('rules',             { url: '/rules', templateUrl: RulesTpl });
	$stateProvider.state('faq',               { url: '/faq', templateUrl: FaqTpl });
	$stateProvider.state('legal',             { url: '/legal', templateUrl: LegalTpl });
	$stateProvider.state('privacy',           { url: '/privacy', templateUrl: PrivacyTpl });

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