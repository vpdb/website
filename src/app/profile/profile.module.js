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
import angular from 'angular';
import 'magnific-popup';

import ProfileComponent from './profile.component';
import ProfileSettingsComponent from './settings/profile.settings.component';
import ProfileDownloadsComponent from './downloads/profile.downloads.component';
import ProfileNotificationsComponent from './notifications/profile.notifications.component';
import ProfileStatsComponent from './stats/profile.stats.component';

const PROFILE_MODULE = angular
	.module('vpdb.profile', [ ])
	.component('profileComponent', new ProfileComponent())
	.component('profileSettingsComponent', new ProfileSettingsComponent())
	.component('profileDownloadsComponent', new ProfileDownloadsComponent())
	.component('profileNotificationsComponent', new ProfileNotificationsComponent())
	.component('profileStatsComponent', new ProfileStatsComponent());

export { PROFILE_MODULE };
