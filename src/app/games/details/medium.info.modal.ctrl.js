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

import angular from 'angular';

export default class MediumInfoModalCtrl {

	/**
	 * @param $uibModalInstance
	 * @param $timeout
	 * @param {App} App
	 * @param {ApiHelper} ApiHelper
	 * @param {AuthService} AuthService
	 * @param {DownloadService} DownloadService
	 * @param {ModalService} ModalService
	 * @param {Lightbox} Lightbox
	 * @param MediumResource
	 * @param params
	 * @ngInject
	 */
	constructor($uibModalInstance, $timeout, App, ApiHelper, AuthService, DownloadService, ModalService, Lightbox, MediumResource, params) {

		this.$uibModalInstance = $uibModalInstance;

		this.AuthService = AuthService;
		this.ApiHelper = ApiHelper;
		this.DownloadService = DownloadService;
		this.ModalService = ModalService;
		this.Lightbox = Lightbox;
		this.MediumResource = MediumResource;

		this.medium = params.medium;
		this.game = params.game;
		this.onDelete = params.onDelete;

		this.shot = {
			thumbUrl: App.img(this.medium.file, 'medium-2x'),
			url: this.medium.file.variations.full ? App.img(this.medium.file, 'full') : undefined
		};
	}

	download(file) {
		this.DownloadService.downloadFile(file, () => {
			this.medium.file.counter.downloads++;
		});
	}

	delete(medium) {
		const what = medium.category.replace('_', ' ');
		return this.ModalService.question({
			title: 'Delete medium',
			message: 'You\'re about to delete this ' + what + '.',
			question: 'You sure about that?'
		}).result.then(() => {
			this.MediumResource.delete({ id: medium.id }, () => {
				this.onDelete();
				this.$uibModalInstance.dismiss();
			}, this.ApiHelper.handleErrorsInDialog('Error deleting ' + what + '.'));
		}).catch(angular.noop);
	}

}
