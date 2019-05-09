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

import { orderBy, flatten, isEmpty } from 'lodash';

/**
 * The game's details view.
 *
 * @author freezy <freezy@vpdb.io>
 */
export default class ReleaseService {

	/**
	 * @param {$log}
	 * @param {AuthService} AuthService
	 * @param {Flavors} Flavors
	 * @param {ModalService} ModalService
	 * @param ReleaseStarResource
	 * @ngInject
	 */
	constructor($log, AuthService, Flavors, ModalService, ReleaseStarResource) {
		this.$log = $log;
		this.AuthService = AuthService;
		this.Flavors = Flavors;
		this.ModalService = ModalService;
		this.ReleaseStarResource = ReleaseStarResource;
	}

	/**
	 * Stars or unstars a release depending if game is already starred.
	 */
	toggleReleaseStar(release, $event) {
		const err = err => {
			if (err.data && err.data.error) {
				this.ModalService.error({
					subtitle: 'Error starring release.',
					message: err.data.error
				});
			} else {
				this.$log.error(err);
			}
		};
		if (this.AuthService.hasPermission('releases/star')) {
			if ($event) {
				$event.stopPropagation();
			}
			if (release.starred) {
				this.ReleaseStarResource.delete({ releaseId: release.id }, {}, () => {
					release.starred = false;
					release.counter.stars--;
				}, err);
			} else {
				this.ReleaseStarResource.save({ releaseId: release.id }, {}, result => {
					release.starred = true;
					release.counter.stars = result.total_stars;
				}, err);
			}
		}
	}

	getTableFiles(release) {
		const files = [];
		for (const version of release.versions) {
			files.push(...version.files.filter(f => f.file.mime_type.startsWith('application/x-visual-pinball-table')));
		}
		return files;
	}

	flavorGrid(release) {

		const flavors = orderBy(flatten(release.versions.map(v => v.files)), 'released_at', true);
		const flavorGrid = {};
		flavors.filter(file => !isEmpty(file.flavor)).forEach(file => {
			const compat = file.compatibility.map(fc => fc.id);
			compat.sort();
			let flavor = '';
			Object.keys(file.flavor).sort().forEach(key => {
				flavor += key + ':' + file.flavor[key] + ',';
			});
			let key = compat.join('/') + '-' + flavor;
			const short = file.flavor.orientation === 'any' && file.flavor.lighting === 'any'
				? 'Universal'
				: this.Flavors.orientation.values[file.flavor.orientation].short + ' / ' + this.Flavors.lighting.values[file.flavor.lighting].name;
			flavorGrid[key] = {
				file: file,
				orientation: this.Flavors.orientation.values[file.flavor.orientation],
				lighting: this.Flavors.lighting.values[file.flavor.lighting],
				version: this.getVersion(release, file),
				short: short
			};
		});

		return orderBy(Object.keys(flavorGrid).map(e => flavorGrid[e]), 'released_at', false);
	}

	getVersion(release, file) {
		return release.versions.find(version => version.files.filter(f => file.file.id === f.file.id).length > 0);
	}
}
