import { assign, orderBy } from 'lodash';

import BuildAdminAddModalTpl from './build.admin.add.modal.pug';
import BuildAdminEditModalTpl from './build.admin.edit.modal.pug';

export default class BuildAdminListCtrl {

	/**
	 * Class constructor
	 * @param $uibModal
	 * @param {App} App
	 * @param {BuildResource} BuildResource
	 * @param {TrackerService} TrackerService
	 */
	constructor($uibModal, App, BuildResource, TrackerService) {
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
			templateUrl: BuildAdminEditModalTpl,
			controller: 'BuildAdminEditModalCtrl',
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
			templateUrl: BuildAdminAddModalTpl,
			controller: 'BuildAdminAddModalCtrl',
			controllerAs: 'vm',
			size: 'lg'

		}).result.then(this.refresh.bind(this));
	}
}