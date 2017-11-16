import { findIndex } from 'lodash';

import BackglassEditModalTpl from './backglass.edit.modal.pug';

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
				this.game.backglasses.splice(findIndex(this.game.backglasses, { id: backglass.id }), 1);
			}
		});
	}
}