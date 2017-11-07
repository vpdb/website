import $ from 'jquery';

export default class GameMediumDetailsModalCtrl {

	/**
	 * Class constructor
	 * @param $timeout
	 * @param {DownloadService} DownloadService
	 * @param params
	 */
	constructor($timeout, DownloadService, params) {

		this.DownloadService = DownloadService;

		this.medium = params.medium;
		this.game = params.game;

		if (this.medium.file.variations.full) {
			$timeout(() => $('#lightbox').magnificPopup({ type: 'image' }));
		}
	}

	download(file) {
		this.DownloadService.downloadFile(file, () => {
			this.medium.file.counter.downloads++;
		});
	}
}