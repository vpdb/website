/*
 * VPDB - Virtual Pinball Database
 * Copyright (C) 2019 freezy <freezy@vpdb.io>
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

function loadModule($transition$) {
	const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
	return require.ensure([], () => {
		// load whole module
		const module = require('./profile.module');
		$ocLazyLoad.load(module.PROFILE_MODULE);
	}, 'profile');
}

const PROFILE_ROOT = {
	name: 'profile',
	url: '/profile',
	component: 'profileComponent',
	lazyLoad: loadModule
};
const PROFILE_SETTINGS = {
	name: 'profile.settings',
	url: '/settings',
	component: 'profileSettingsComponent',
	lazyLoad: loadModule
};
const PROFILE_CONTENT = {
	name: 'profile.content',
	url: '/content',
	component: 'profileContentComponent',
	lazyLoad: loadModule
};
const PROFILE_DOWNLOADS = {
	name: 'profile.downloads',
	url: '/downloads',
	component: 'profileDownloadsComponent',
	lazyLoad: loadModule
};
const PROFILE_NOTIFICATIONS = {
	name: 'profile.notifications',
	url: '/notifications',
	component: 'profileNotificationsComponent',
	lazyLoad: loadModule
};
const PROFILE_STATS = {
	name: 'profile.stats',
	url: '/stats',
	component: 'profileStatsComponent',
	lazyLoad: loadModule
};

export { PROFILE_ROOT, PROFILE_SETTINGS, PROFILE_CONTENT, PROFILE_DOWNLOADS, PROFILE_NOTIFICATIONS, PROFILE_STATS };
