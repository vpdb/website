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

export default class BuildAddModalCtrl {

	/**
	 * @param $uibModalInstance
	 * @param {ApiHelper} ApiHelper
	 * @param BuildResource
	 * @param {BootstrapPatcher} BootstrapPatcher
	 * @ngInject
	 */
	constructor($uibModalInstance, ApiHelper, BuildResource, BootstrapPatcher) {

		BootstrapPatcher.patchCalendar();

		this.$uibModalInstance = $uibModalInstance;
		this.ApiHelper = ApiHelper;
		this.BuildResource = BuildResource;

		this.build = {
			platform: 'vp'
		};
		this.types = [ 'release', 'nightly', 'experimental' ];
		this.majorVersions = [
			{ label: 'v8.x.x', value: '8' },
			{ label: 'v9.x.x', value: '9' },
			{ label: 'v10.x.x', value: '10' } ];
	}

	openCalendar($event) {
		$event.preventDefault();
		$event.stopPropagation();
		this.calendarOpened = true;
	};

	add() {
		this.BuildResource.save(this.build, build => {
			this.$uibModalInstance.close(build);

		}, this.ApiHelper.handleErrors(this));
	}
}