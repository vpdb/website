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

/**
 * @param msdElasticConfig
 * @ngInject
 */
export function msdElasticConfig(msdElasticConfig) {
	msdElasticConfig.append = '\n\n';
}

/**
 * @param timeAgoSettings
 * @ngInject
 */
export function timeAgoConfig(timeAgoSettings) {
	timeAgoSettings.allowFuture = true;
	timeAgoSettings.overrideLang = 'en_US';
	timeAgoSettings.strings.en_US = {
		prefixAgo: null,
		prefixFromNow: 'in',
		suffixAgo: 'ago',
		suffixFromNow: null,
		seconds: 'less than a minute',
		minute: 'about a minute',
		minutes: '%d minutes',
		hour: 'about an hour',
		hours: 'about %d hours',
		day: 'a day',
		days: '%d days',
		month: 'about a month',
		months: '%d months',
		year: 'about a year',
		years: '%d years',
		numbers: []
	};
}
