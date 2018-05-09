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

const { existsSync } = require('fs');
const axios = require('axios');

const websiteConfig = require(process.env.WEBSITE_CONFIG && existsSync(process.env.WEBSITE_CONFIG)
	? process.env.WEBSITE_CONFIG
	: '../config/vpdb.prod.json');

const buildConfig = require(process.env.BUILD_CONFIG && existsSync(process.env.BUILD_CONFIG)
	? process.env.BUILD_CONFIG
	: '../config/build.prod.json');

if (buildConfig.cloudflare && buildConfig.cloudflare.enabled && buildConfig.cloudflare.authKey) {
	(async () => {
		try {
			const client = axios.create({
				baseURL: 'https://api.cloudflare.com/client/v4',
				headers: {
					'X-Auth-Key': buildConfig.cloudflare.authKey,
					'X-Auth-Email': buildConfig.cloudflare.authEmail,
					'Content-Type': 'application/json'
				}
			});

			// purge cache
			await client.post('/zones/' + buildConfig.cloudflare.zoneId + '/purge_cache', { purge_everything: true });

			// eslint-disable-next-line no-console
			console.log('Purged Cloudflare cache for %s.', websiteConfig.webUri.hostname);
			process.exit(0);

		} catch (err) {
			// eslint-disable-next-line no-console
			console.error('Cloudflare error: %s', err);
			// eslint-disable-next-line no-console
			console.error(err && err.response && err.response.data ? JSON.stringify(err.response.data, null,  '  ') : err);
			process.exit(1);
		}
	})();
}
