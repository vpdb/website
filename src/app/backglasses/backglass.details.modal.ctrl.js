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

import angular from 'angular';
import BackglassEditModalTpl from './admin/backglass.edit.modal.pug';

/**
 * Shows backglass details in a modal dialog.
 * @todo Make EDIT button conditional and show only when dependency loaded.
 */
export default class BackglassDetailsModalCtrl {

	/**
	 * @param $uibModal
	 * @param $uibModalInstance
	 * @param {AuthService} AuthService
	 * @param {DownloadService} DownloadService
	 * @param params
	 * @ngInject
	 */
	constructor($uibModal, $uibModalInstance, AuthService, DownloadService, params) {

		this.$uibModal = $uibModal;
		this.$uibModalInstance = $uibModalInstance;
		this.AuthService = AuthService;
		this.DownloadService = DownloadService;

		this.backglass = params.backglass;
		this.game = params.game;
		this.file = this.backglass.versions[0].file;
		this.numDownloads = 0;
		this.backglass.versions.forEach(version => {
			this.numDownloads += version.file.counter.downloads;
		});
	}

	download(file) {
		this.DownloadService.downloadFile(file, () => {
			file.counter.downloads++;
			this.numDownloads++;
		});
	}

	edit(backglass) {
		this.$uibModalInstance.close();
		this.$uibModal.open({
			templateUrl: BackglassEditModalTpl,
			controller: 'BackglassEditModalCtrl',
			controllerAs: 'vm',
			size: 'md',
			resolve: {
				params: () => {
					return {
						backglass: backglass,
						game: this.game,
					};
				}
			}
		}).result.then(result => {
			if (!result) {
				this.game.backglasses.splice(this.game.backglasses.findIndex(bg => bg.id === backglass.id), 1);
			}
		}).catch(angular.noop);
	}
}
