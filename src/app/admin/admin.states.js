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
		const module = require('./admin.module');
		$ocLazyLoad.load(module.ADMIN_MODULE);
	}, 'admin');
}

const ADMIN_USERS = {
	name: 'adminUsers',
	url: '/admin/users',
	component: 'userListAdminComponent',
	lazyLoad: loadModule
};

const ADMIN_BUILDS = {
	name: 'adminBuilds',
	url: '/admin/builds',
	component: 'buildListAdminComponent',
	lazyLoad: loadModule
};

const ADMIN_UPLOADS = {
	name: 'adminUploads',
	url: '/admin/uploads',
	component: 'uploadsListAdminComponent',
	lazyLoad: loadModule
};

const ADMIN_TOKENS = {
	name: 'adminTokens',
	url: '/admin/tokens',
	component: 'tokenListAdminComponent',
	lazyLoad: loadModule
};

export { ADMIN_USERS, ADMIN_BUILDS, ADMIN_UPLOADS, ADMIN_TOKENS };