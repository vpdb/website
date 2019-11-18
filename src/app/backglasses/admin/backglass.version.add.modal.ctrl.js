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

export default class BackglassVersionAddModalCtrl {

	/**
	 * @param $uibModalInstance
	 * @param {App} App
	 * @param {ApiHelper} ApiHelper
	 * @param {AuthService} AuthService
	 * @param {ModalService} ModalService
	 * @param BootstrapPatcher
	 * @param FileResource
	 * @param BackglassVersionResource
	 * @param params
	 * @ngInject
	 */
	constructor($uibModalInstance, App, ApiHelper, AuthService, ModalService, BootstrapPatcher,
				FileResource, BackglassVersionResource, params) {

		this.$uibModalInstance = $uibModalInstance;
		this.App = App;
		this.AuthService = AuthService;
		this.ApiHelper = ApiHelper;
		this.FileResource = FileResource;
		this.BackglassVersionResource = BackglassVersionResource;
		this.ModalService = ModalService;

		BootstrapPatcher.patchCalendar();
		BootstrapPatcher.patchTimePicker();

		this.params = params;
		this.game = params.game;
		this.status = { loading: false, offline: false };

		this.reset();
	}

	/**
	 * Resets all entered data.
	 */
	reset() {

		// delete media if already uploaded
		if (this.backglassVersion && !this.backglassVersion.submitted) {
			if (this.meta.files && this.meta.files.backglass && this.meta.files.backglass.id) {
				this.FileResource.delete({ id: this.meta.files.backglass.id });
			}
		}

		/*
		 * `meta` is all the data we need for displaying the page but that
		 * is not part of the backglass object posted to the API.
		 */
		this.meta = {
			files: { backglass: { variations: { full: false } } }
		};

		this.backglassVersion =  {
			version: '',
			changes: '',
			released_at: new Date(),
		};
		this.errors = {};
	}


	/**
	 * A .directb2s file has been uploaded.
	 * @param status File status
	 */
	onBackglassUpload(status) {
		const bg = status.storage;
		this.AuthService.collectUrlProps(bg, true);
		this.backglassVersion._file = bg.id;
		this.meta.files.backglass = bg;
		this.meta.files.backglass.storage = { id: bg.id }; // so file-upload deletes old file when new one gets dragged over
	}

	submit() {
		this.submitting = true;
		this.BackglassVersionResource.save({ id: this.backglass.id }, this.backglassVersion, result => {

			console.log('posted', result);

			// cleanup
			this.submitting = false;
			this.reset();

			// close dialog
			this.$uibModalInstance.close();

			// show info modal
			this.ModalService.info({
				icon: 'check-circle',
				title: 'Success!',
				subtitle: this.game.title,
				message: 'Successfully uploaded new backglass version.'
			});

		}, this.ApiHelper.handleErrors(this, scope => {
			this.submitting = false;
			if (scope.errors && scope.errors._file === 'You must provide a file reference.') {
				scope.errors._file = 'You need to upload a file!';
			}
		}));
	}
}
