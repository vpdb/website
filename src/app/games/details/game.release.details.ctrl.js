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

import { flatten, orderBy } from 'lodash';

/**
 * The release view within the game details view.
 *
 * @author freezy <freezy@vpdb.io>
 */
export default class GameReleaseDetailsCtrl {

	/**
	 * @param $scope
	 * @param {App} App
	 * @param {ReleaseService} ReleaseService
	 * @ngInject
	 */
	constructor($scope, App, ReleaseService) {

		// setup releases
		$scope.$watch('release', release => {

			// sort versions
			this.releaseVersions = orderBy(release.versions, 'released_at', false);
			this.latestVersion = this.releaseVersions[0];
			this.flavorGrid = ReleaseService.flavorGrid(release);

			// get latest shots
			this.shot = orderBy(flatten(this.latestVersion.files.map(file => {
				if (!file.playfield_images) {
					return [];
				}
				return file.playfield_images.map(img => { return {
					type: img.file_type,
					url: App.img(img, 'medium'),
					full: img.variations.full.url
				}; });
			})), 'file_type', true)[0];
		});
	}
}
