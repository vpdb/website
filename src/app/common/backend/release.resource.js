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

export class ReleaseResource {
	/**
	 * @param $resource
	 * @param {ConfigService} ConfigService
	 * @ngInject
	 */
	constructor($resource, ConfigService) {
		return $resource(ConfigService.apiUri('/v1/releases/:release'), {}, {
			get: { method: 'GET', interceptor: { response: res => res } },
			query: { method: 'GET', isArray:true, interceptor: { response: res => res } },
			update: { method: 'PATCH' }
		});
	}
}

export class ReleaseCommentResource {
	/**
	 * @param $resource
	 * @param {ConfigService} ConfigService
	 * @ngInject
	 */
	constructor($resource, ConfigService) {
		return $resource(ConfigService.apiUri('/v1/releases/:releaseId/comments'), {}, {
		});
	}
}

export class ReleaseRatingResource {
	/**
	 * @param $resource
	 * @param {ConfigService} ConfigService
	 * @ngInject
	 */
	constructor($resource, ConfigService) {
		return $resource(ConfigService.apiUri('/v1/releases/:releaseId/rating'), {}, {
			get: { method: 'GET', noError: [ 404 ] },
			update: { method: 'PUT' }
		});
	}
}

export class ReleaseStarResource {
	/**
	 * @param $resource
	 * @param {ConfigService} ConfigService
	 * @ngInject
	 */
	constructor($resource, ConfigService) {
		return $resource(ConfigService.apiUri('/v1/releases/:releaseId/star'), {}, {
		});
	}
}

export class ReleaseModerationResource {
	/**
	 * @param $resource
	 * @param {ConfigService} ConfigService
	 * @ngInject
	 */
	constructor($resource, ConfigService) {
		return $resource(ConfigService.apiUri('/v1/releases/:releaseId/moderate'), {}, {
		});
	}
}

export class ReleaseModerationCommentResource {
	/**
	 * @param $resource
	 * @param {ConfigService} ConfigService
	 * @ngInject
	 */
	constructor($resource, ConfigService) {
		return $resource(ConfigService.apiUri('/v1/releases/:releaseId/moderate/comments'), {}, {
		});
	}
}

export class ReleaseVersionResource {
	/**
	 * @param $resource
	 * @param {ConfigService} ConfigService
	 * @ngInject
	 */
	constructor($resource, ConfigService) {
		return $resource(ConfigService.apiUri('/v1/releases/:releaseId/versions/:version'), {}, {
			update: { method: 'PATCH' }
		});
	}
}

export class ReleaseFileValidationResource {
	/**
	 * @param $resource
	 * @param {ConfigService} ConfigService
	 * @ngInject
	 */
	constructor($resource, ConfigService) {
		return $resource(ConfigService.apiUri('/v1/releases/:releaseId/versions/:version/files/:fileId/validate'), {}, {
		});
	}
}
