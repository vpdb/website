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

import { pick } from 'lodash';

export default class BuildAddAdminModalCtrl {

	/**
	 * Class constructor
	 * @param $uibModal
	 * @param $uibModalInstance
	 * @param {App} App
	 * @param {ApiHelper} ApiHelper
	 * @param BuildResource
	 * @param {BootstrapPatcher} BootstrapPatcher
	 * @ngInject
	 */
	constructor($uibModal, $uibModalInstance, App, ApiHelper, BuildResource, BootstrapPatcher) {

		this.$uibModal = $uibModal;
		this.$uibModalInstance = $uibModalInstance;
		this.App = App;
		this.ApiHelper = ApiHelper;
		this.BuildResource = BuildResource;

		BootstrapPatcher.patchCalendar();

		this.build = {};
		this.platforms = [ { id: 'vp', label: 'Visual Pinball' } ];
		this.types = [
			{ id: 'release', label: 'Official Release' },
			{ id: 'experimental', label: 'Experimental Build' },
			{ id: 'nightly', label: 'Nightly Build' }
		];
	}

	submit() {
		const data = pick(this.build, ['id', 'platform', 'major_version', 'label', 'download_url', 'support_url', 'built_at', 'description', 'type', 'is_range', 'is_active']);
		this.BuildResource.save(data, build => {
			this.BuildResource.update({ id: build.id }, { is_active: true }, () => {
				this.$uibModalInstance.close();
				this.App.showNotification('Successfully added build.');

			}, this.ApiHelper.handleErrors(this));
		}, this.ApiHelper.handleErrors(this));
	}

	openCalendar($event) {
		$event.preventDefault();
		$event.stopPropagation();
		this.calendarOpened = true;
	}
}