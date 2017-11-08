import { indexOf, find, isArray } from 'lodash';

import BuildAddModalTpl from '../builds/build.add.modal.pug';

export default class ReleaseAddBaseCtrl {

	/**
	 * Parent class constructor
	 *
	 * @param $uibModal
	 * @param {ApiHelper} ApiHelper
	 * @param {AuthService} AuthService
	 * @param {BuildResource} BuildResource
	 * @param {FileResource} FileResource
	 * @param {BootstrapPatcher} BootstrapPatcher
	 */
	constructor($uibModal, ApiHelper, AuthService, BuildResource, FileResource, BootstrapPatcher) {

		BootstrapPatcher.patchCalendar();

		this.$uibModal = $uibModal;
		this.ApiHelper = ApiHelper;
		this.AuthService = AuthService;
		this.BuildResource = BuildResource;
		this.FileResource = FileResource;
	}


	/**
	 * Opens the calendar drop-down.
	 * @param $event
	 */
	openCalendar($event) {
		$event.preventDefault();
		$event.stopPropagation();

		this.calendarOpened = true;
	}

	/**
	 * Returns a date object from the date and time picker.
	 * If empty, returns null.
	 */
	getReleaseDate() {
		if (this.meta.releaseDate || this.meta.releaseTime) {
			const date = this.meta.releaseDate ? new Date(this.meta.releaseDate) : new Date();
			const time = this.meta.releaseTime ? new Date(this.meta.releaseTime) : new Date();
			return new Date(date.getFullYear(), date.getMonth(), date.getDate(), time.getHours(), time.getMinutes());
		}
		return null;
	}

	/**
	 * Splits builds into types (experimental, nightly and release)
	 * and sorts each by date.
	 */
	fetchBuilds() {
		const builds = this.BuildResource.query(() => {
			this.builds = {};
			const types = [];
			builds.forEach(build => {
				if (!this.builds[build.type]) {
					this.builds[build.type] = [];
					types.push(build.type);
				}
				build.built_at = new Date(build.built_at);
				this.builds[build.type].push(build);
			});
			types.forEach(type => {
				this.builds[type].sort((a, b) => a.built_at.getTime() === b.built_at.getTime() ? 0 : (a.built_at.getTime() > b.built_at.getTime() ? -1 : 1));
			});
		});
	}


	/**
	 * Adds or removes a build to/from to a given file of the release
	 * @param {object} metaFile file
	 * @param {object} build
	 */
	toggleBuild(metaFile, build) {
		const releaseFile = this.getReleaseFile(metaFile);
		const idx = releaseFile._compatibility.indexOf(build.id);
		if (idx > -1) {
			releaseFile._compatibility.splice(idx, 1);
		} else {
			releaseFile._compatibility.push(build.id);
		}
	}


	/**
	 * Opens the dialog for creating a new build.
	 */
	addBuild() {
		this.$uibModal.open({
			templateUrl: BuildAddModalTpl,
			controller: 'BuildAddModalCtrl',
			controllerAs: 'vm',
			size: 'lg'
		}).result.then(function(newBuild) {
			// todo
		});
	}

	/**
	 * Deletes an uploaded file from the server and removes it from the list
	 * @param {object} file
	 */
	removeFile(file) {
		this.FileResource.delete({ id: file.storage.id }, () => {
			this.meta.files.splice(this.meta.files.indexOf(file), 1);
			this.releaseVersion.files.splice(indexOf(this.releaseVersion.files, find(this.releaseVersion.files, { id : file.storage.id })), 1);

		}, this.ApiHelper.handleErrorsInDialog(this, 'Error removing file.'));
	}

	/**
	 * Executed just before uploading of a file starts
	 * @param status
	 */
	beforeFileUpload(status) {

		if (/^application\/x-visual-pinball-table/i.test(status.mimeType)) {
			this.releaseVersion.files.push({
				_randomId: status.randomId,
				flavor: {},
				_compatibility: [],
				_playfield_image: null,
				_playfield_video: null
			});
		}
	}

	/**
	 * On error, remove file from release.
	 * @param status
	 */
	onFileUploadError(status) {
		const tableFile = find(this.releaseVersion.files, { _randomId: status.randomId });
		if (tableFile) {
			this.releaseVersion.files.splice(this.releaseVersion.files.indexOf(tableFile), 1);
		}
	}

	/**
	 * Callback when a release file was successfully uploaded.
	 * @param status
	 */
	onFileUpload(status) {
		let tableFile;

		// table files are already there from #beforeFileUpload(), so just find the right one and update
		if (/^application\/x-visual-pinball-table/i.test(status.mimeType)) {
			tableFile = find(this.releaseVersion.files, { _randomId: status.randomId });
			tableFile._file = status.storage.id;

			// get auth tokens for generated screenshot
			if (status.storage.variations && status.storage.variations.screenshot) {
				this.meta.mediaLinks['screenshot:' + status._randomId] = status.storage.variations.screenshot;
				this.AuthService.collectUrlProps(status.storage, true);
			}

			// copy version from table file to form if available
			if (status.storage.metadata && status.storage.metadata.table_version) {
				this.releaseVersion.version = status.storage.metadata.table_version;
			}

			// add author's url as well
			if (this.addLink && isArray(this.release.links) && this.release.links.length === 0 && status.storage.metadata && status.storage.metadata['author_website']) {
				this.addLink({ label: 'Author\'s website', url: status.storage.metadata['author_website'] });
			}

		} else {
			// other files need to be added
			this.releaseVersion.files.push({ _file: status.storage.id });
		}

		// link randomId to storage id
		this.meta.idMap = this.randomIdMap || {};
		this.meta.idMap[status.randomId] = status.storage.id;
	}


	/**
	 * Callback when a media file was successfully uploaded.
	 * @param status
	 */
	onMediaUpload(status) {

		// update links
		if (/^image\//.test(status.mimeType)) {
			this.meta.mediaLinks[status.key] = status.storage.variations['landscape'];

		} else if (/^video\//.test(status.mimeType)) {
			this.meta.mediaLinks[status.key] = status.storage.variations['still'];

		} else {
			this.meta.mediaLinks[status.key] = status.storage;
		}

		// add to release object
		const releaseFile = this.getReleaseFileForMedia(status);
		const mediaType = status.key.split(':')[0];
		releaseFile['_' + mediaType] = status.storage.id;

		// figure out rotation
		if (/^image\//.test(status.mimeType)) {
			this.updateRotation(releaseFile, status);
		}

		this.AuthService.collectUrlProps(status.storage, true);
	}


	/**
	 * Callback when media gets deleted before it gets re-uploaded.
	 * @param key
	 */
	onMediaClear(key) {
		this.meta.mediaLinks[key] = false;
	}


	/**
	 * Resets orientation settings.
	 * @param file Release file meta data
	 */
	onOrientationChanged(file) {
		const releaseFile = this.getReleaseFile(file);
		const mediaFile = this.meta.mediaFiles[this.getMediaKey(releaseFile, 'playfield_image')];
		if (mediaFile) {
			this.updateRotation(releaseFile, mediaFile);
		}
	}


	/**
	 * Returns the file object of the release object that is sent to the
	 * API for given meta file info stored at this.meta.files.
	 *
	 * @param metaReleaseFile
	 * @return {*}
	 */
	getReleaseFile(metaReleaseFile) {
		this.releaseFileRefs = this.releaseFileRefs || {};
		if (!this.releaseFileRefs[metaReleaseFile.randomId]) {
			this.releaseFileRefs[metaReleaseFile.randomId] = find(this.releaseVersion.files, { _randomId: metaReleaseFile.randomId });
		}
		return this.releaseFileRefs[metaReleaseFile.randomId];
	}


	/**
	 * Returns the file object of the release object that is sent to the
	 * API for given meta file info stored at this.meta.mediaFiles.
	 * @param status Media file
	 * @return {*}
	 */
	getReleaseFileForMedia(status) {
		return find(this.releaseVersion.files, { _randomId: status.key.split(':')[1] });
	}


	/**
	 * Returns the playfield type for a give meta file at this.meta.files.
	 *
	 * @param metaReleaseFile
	 * @return {string}
	 */
	getPlayfieldType(metaReleaseFile) {
		const releaseFile = this.getReleaseFile(metaReleaseFile);
		// fullscreen per default
		return 'playfield-' + (releaseFile && releaseFile.flavor && releaseFile.flavor.orientation === 'ws' ? 'ws' : 'fs');
	}


	/**
	 * Returns the key for media files stored at this.meta.mediaFiles.
	 * @param file File status as returned by the file-upload module
	 * @param type media type
	 * @return {string}
	 */
	getMediaKey(file, type) {
		return type + ':' + (file.randomId || file._randomId);
	}


	/**
	 * Removes the media link from meta data in case a file failed to load
	 * @param file
	 * @param type
	 */
	onBackglassImageError(file, type) {
		//delete this.meta.mediaLinks[this.getMediaKey(file, type)];
	}


	/**
	 * Updates the rotation offset of an image.
	 *
	 * Updates the `rotation` parameter of the media link, which is used to
	 *
	 *   1. Apply the CSS class for the given rotation to the image's parent
	 *   2. Retrieve pre-processing rotation when posting the release
	 *
	 * @param file Release file
	 * @param type Media type (only "playfield_image" supported for far)
	 * @param angle Angle - either 90 or -90
	 */
	rotate(file, type, angle) {
		const rotation = this.meta.mediaLinks[this.getMediaKey(file, type)].rotation;
		this.meta.mediaLinks[this.getMediaKey(file, type)].rotation = (rotation + angle + 360) % 360;
	}


	/**
	 * Best-guesses the rotation of an uploaded playfield.
	 * Run this after media upload or orientation change.
	 *
	 * @param releaseFile File object posted to the API
	 * @param mediaFile Media meta data ("status")
	 */
	updateRotation(releaseFile, mediaFile) {

		let rotation = 0;
		let offset = 0;

		// we use the landscape image from the backend, so if it's a portrait, set offset
		if (mediaFile.storage.metadata.size.width < mediaFile.storage.metadata.size.height) {
			offset = -90;
		}

		// if orientation of the release file is known to be desktop, don't rotate.
		if (releaseFile.flavor && releaseFile.flavor.orientation === 'ws') {
			rotation = 0;

			// otherwise, assume it's a fullscreen release and rotate accordingly.
		} else if (mediaFile.storage.metadata.size.width > mediaFile.storage.metadata.size.height) {
			rotation = 90;
		}

		this.meta.mediaLinks[mediaFile.key].rotation = rotation - offset;
		this.meta.mediaLinks[mediaFile.key].offset = offset;
	}
}