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

import { init as initApm } from '@elastic/apm-rum';

let apm = false;

// eslint-disable-next-line
const rumConfig = WEBSITE_CONFIG.rum;
if (rumConfig && rumConfig.elastic) {
	apm = initApm({
		// eslint-disable-next-line
		serviceName: WEBSITE_CONFIG.name,
		// eslint-disable-next-line
		serviceVersion: BUILD_CONFIG.revision.hash,
		serverUrl: rumConfig.elastic,
		distributedTracingOrigins: [
			// eslint-disable-next-line
			WEBSITE_CONFIG.apiUri.protocol + '://' + WEBSITE_CONFIG.apiUri.hostname + ':' + WEBSITE_CONFIG.apiUri.port,
			// eslint-disable-next-line
			WEBSITE_CONFIG.storageUri.protocol + '://' + WEBSITE_CONFIG.storageUri.hostname + ':' + WEBSITE_CONFIG.storageUri.port,
		],
	});
	apm.setInitialPageLoadName('Init');
}

export default apm;
