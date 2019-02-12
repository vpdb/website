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

const { existsSync } = require('fs');
const { execSync } = require('child_process');
const axios = require('axios');

const websiteConfig = require(process.env.WEBSITE_CONFIG && existsSync(process.env.WEBSITE_CONFIG)
	? process.env.WEBSITE_CONFIG
	: '../config/vpdb.prod.json');

const buildConfig = require(process.env.BUILD_CONFIG && existsSync(process.env.BUILD_CONFIG)
	? process.env.BUILD_CONFIG
	: '../config/build.prod.json');

if (websiteConfig.rollbar && websiteConfig.rollbar.enabled && buildConfig.rollbar && buildConfig.rollbar.serverAccessToken) {
	(async () => {
		try {
			const client = axios.create({ baseURL: 'https://api.rollbar.com/api/1' });
			const gitHash = execSync('git rev-parse HEAD').toString().trim();
			await client.post('/deploy', {
				access_token: buildConfig.rollbar.serverAccessToken,
				environment: websiteConfig.rollbar.environment,
				revision: gitHash,
				local_username: process.env.USER || 'freezy'
			}, {
				headers: { 'Content-Type': 'application/json' }
			});
			// eslint-disable-next-line no-console
			console.log('Rollbar deployment successful.');
			process.exit(0);

		} catch (err) {
			// eslint-disable-next-line no-console
			console.error('Rollbar error: %s', JSON.stringify(err));
			process.exit(1);
		}
	})();
}