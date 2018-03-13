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

import { assign, orderBy } from 'lodash';

import BuildAddAdminModalTpl from './build.add.admin.modal.pug';
import BuildEditAdminModalTpl from './build.edit.admin.modal.pug';

export default class BuildListAdminCtrl {

	/**
	 * Class constructor
	 * @param $uibModal
	 * @param {App} App
	 * @param {TrackerService} TrackerService
	 * @param BuildResource
	 * @ngInject
	 */
	constructor($uibModal, App, TrackerService, BuildResource) {
		App.theme('light');
		App.setTitle('Builds');
		App.setMenu('admin');
		TrackerService.trackPage();

		this.$uibModal = $uibModal;
		this.App = App;
		this.BuildResource = BuildResource;

		this.blocks = [];
		this.refresh();
	}

	refresh() {
		this.BuildResource.query(builds => {
			const byType = {};
			const ranges = [];
			orderBy(builds, ['built_at'], ['desc']).forEach(build => {
				if (build.is_range) {
					ranges.push(build);
				} else {
					if (!byType[build.type]) {
						byType[build.type] = [];
					}
					byType[build.type].push(build);
				}
			});
			this.blocks = ([
				{ title: 'Official Releases', builds: byType.release },
				{ title: 'Experimental Releases', builds: byType.experimental },
				{ title: 'Nightly Releases', builds: byType.nightly },
				{ title: 'Ranges', builds: ranges }
			]);
		});
	}

	edit(build) {
		this.$uibModal.open({
			templateUrl: BuildEditAdminModalTpl,
			controller: 'BuildEditAdminModalCtrl',
			controllerAs: 'vm',
			size: 'lg',
			resolve: { build: () => build }

		}).result.then(updatedBuild => {
			if (updatedBuild) {
				assign(build, updatedBuild);
			} else {
				this.refresh();
			}
		});
	}

	add() {
		this.$uibModal.open({
			templateUrl: BuildAddAdminModalTpl,
			controller: 'BuildAddAdminModalCtrl',
			controllerAs: 'vm',
			size: 'lg'

		}).result.then(this.refresh.bind(this));
	}
}