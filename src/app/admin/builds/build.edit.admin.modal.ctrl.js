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

import { cloneDeep, pick } from 'lodash';

export default class BuildEditAdminModalCtrl {

	/**
	 * Class constructor
	 * @param $uibModalInstance
	 * @param {App} App
	 * @param {ApiHelper} ApiHelper
	 * @param {BootstrapPatcher} BootstrapPatcher
	 * @param BuildResource
	 * @param ReleaseResource
	 * @param build
	 * @ngInject
	 */
	constructor($uibModalInstance, App, ApiHelper, BootstrapPatcher, BuildResource, ReleaseResource, build) {

		this.$uibModalInstance = $uibModalInstance;
		this.App = App;
		this.ApiHelper = ApiHelper;
		this.BuildResource = BuildResource;

		BootstrapPatcher.patchCalendar();

		this.id = build.id;
		this.build = build;
		this.originalBuild = build;
		this.platforms = [ { id: 'vp', label: 'Visual Pinball' } ];
		this.types = [
			{ id: 'release', label: 'Official Release' },
			{ id: 'experimental', label: 'Experimental Build' },
			{ id: 'nightly', label: 'Nightly Build' }
		];
		this.status = {
			releases: { loading: false, offline: false }
		};
		this.pagination = {};

		this.BuildResource.get({ id: build.id }, b => {
			build = b;
			this.build = cloneDeep(build);
			this.ApiHelper.paginatedRequest(() => ReleaseResource.query({
				moderation: 'all',
				builds: build.id,
				thumb_format: 'square'
			}), this.status.releases, this.pagination)
				.then(releases => this.releases = releases)
				.catch(() => this.releases = []);
		});
	}

	save() {
		const data = pick(this.build, ['id', 'platform', 'major_version', 'label', 'download_url', 'support_url', 'built_at', 'description', 'type', 'is_range', 'is_active']);
		this.BuildResource.update({ id: this.id }, data, updatedBuild => {
			this.$uibModalInstance.close(updatedBuild);
			this.App.showNotification('Successfully updated build.');

		}, this.ApiHelper.handleErrors(this));
	}

	delete(build) {
		this.BuildResource.delete({ id: build.id }, () => {
			this.App.showNotification('Successfully deleted build.');
			this.$uibModalInstance.close();

		}, this.ApiHelper.handleErrorsInDialog('Error deleting build'));
	}

	openCalendar($event) {
		$event.preventDefault();
		$event.stopPropagation();
		this.calendarOpened = true;
	}

	reset() {
		this.build = cloneDeep(this.originalBuild);
	}
}
