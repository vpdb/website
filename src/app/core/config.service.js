export default class ConfigService {

	/**
	 * @param {Config} Config
	 * @ngInject
	 */
	constructor(Config) {

		this.Config = Config;

		this.apiSameHost =
			this.Config.webUri.protocol === this.Config.apiUri.protocol &&
			this.Config.webUri.hostname === this.Config.apiUri.hostname &&
			this.Config.webUri.port === this.Config.apiUri.port;

		this.storageSameHost =
			this.Config.webUri.protocol === this.Config.storageUri.protocol &&
			this.Config.webUri.hostname === this.Config.storageUri.hostname &&
			this.Config.webUri.port === this.Config.storageUri.port;
	}

	apiUri(path) {
		if (this.apiSameHost) {
			return this.Config.apiUri.pathname + (path || '');
		} else {
			return ConfigService.uri(this.Config.apiUri) + (path || '');
		}
	}

	storageUri(path, fullPath) {
		if (this.storageSameHost && !fullPath) {
			return this.Config.storageUri.pathname + (path || '');
		} else {
			return ConfigService.uri(this.Config.storageUri) + (path || '');
		}
	}

	webUri(path) {
		return ConfigService.uri(this.Config.webUri) + (path || '');
	}

	static uri(uri) {
		const port = (uri.protocol === 'http' && uri.port === 80) || (uri.protocol === 'https' && uri.port === 443) ? false : uri.port;
		return uri.protocol + '://' + uri.hostname + (port ? ':' + port : '') + (uri.pathname || '');
	}

	isApiUrl(urlOrPath) {
		let uri;
		if (urlOrPath[0] === '/') {
			uri = this.Config.apiUri.pathname;
			if (urlOrPath.substr(0, uri.length) === uri) {
				return true;
			}
		} else {
			uri = ConfigService.uri(this.Config.apiUri);
			if (urlOrPath.substr(0, uri.length) === uri) {
				return true;
			}
		}
		return false;
	}

	isStorageUrl(urlOrPath) {
		let uri;
		if (urlOrPath[0] === '/') {
			uri = this.Config.storageUri.pathname;
			if (urlOrPath.substr(0, uri.length) === uri) {
				return true;
			}

		} else {
			uri = ConfigService.uri(this.Config.storageUri);
			if (urlOrPath.substr(0, uri.length) === uri) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Checks if the URL is either from the API or the storage API
	 * @param {string} urlOrPath URL or path to check
	 */
	isAnyApiUrl(urlOrPath) {

		return this.isApiUrl(urlOrPath) || this.isStorageUrl(urlOrPath);
	}

	isAuthUrl(urlOrPath) {
		if (urlOrPath[0] === '/') {
			return urlOrPath === this.Config.apiUri.pathname + '/v1/authenticate';
		} else {
			return urlOrPath === ConfigService.uri(this.Config.apiUri) + '/v1/authenticate';
		}
	}
}