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

import {VptPreviewScene} from './vpt.preview.scene';

export default class VptPreviewCtrl {

	/**
	 *
	 * @param $scope
	 * @param $stateParams
	 * @param {App} App
	 * @param {ApiHelper} ApiHelper
	 * @param {VpResource} VpResource
	 * @ngInject
	 */
	constructor($scope, $stateParams, App, ApiHelper, VpResource) {

		App.theme('dark');
		App.setTitle('VPT Preview');
		App.setMenu('releases');

		const fileId = $stateParams.fileId;

		this.scene = new VptPreviewScene(document.getElementById('gl-view'));

		this.scene.initGl();
		this.scene.resizeDisplayGl();

		VpResource.get({ fileId: fileId }, data => {
			this.scene.initContent(data);
			console.log(data);
		}, ApiHelper.handleErrorsInDialog('3D Table Preview'));

		this.render();
	}

	render() {
		requestAnimationFrame(this.render.bind(this));
		this.scene.render();
	};
}
