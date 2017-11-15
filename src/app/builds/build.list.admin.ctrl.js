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