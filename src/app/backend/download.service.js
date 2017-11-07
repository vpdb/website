export default class DownloadService {

	/**
	 * Class constructor.
	 * @param {App} App
	 * @param {AuthService} AuthService
	 * @param {ConfigService} ConfigService
	 */
	constructor(App, AuthService, ConfigService) {
		this.App = App;
		this.AuthService = AuthService;
		this.ConfigService = ConfigService;
	}

	/**
	 * Downloads a file from VPDB.
	 *
	 * @param file
	 * @param [callback]
	 */
	downloadFile(file, callback) {

		if (file.is_protected) {
			if (this.AuthService.isAuthenticated) {
				this.AuthService.fetchUrlTokens(file.url, (err, tokens) => {
					// todo treat error
					this.App.downloadLink(file.url, tokens[file.url], null, callback);
				});

			} else {
				this.App.login({
					headMessage: 'In order to download this file, you need to be logged in. You can register for free just below.',
					postLogin: { action: 'downloadFile', params: file }
				});
			}

		} else {
			this.App.downloadLink(file.url, null, null, callback);
		}
	}

	downloadRelease(releaseId, downloadRequest, callback) {

		const path = '/releases/' + releaseId;
		const url = this.ConfigService.storageUri(path);
		this.AuthService.fetchUrlTokens(url, (err, tokens) => {
			// todo treat error
			this.App.downloadLink(this.ConfigService.storageUri(path, true), tokens[url], JSON.stringify(downloadRequest), callback);
		});
	}
}