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
import { isArray, cloneDeep } from 'lodash';
import BuildAddModalTpl from './build/build.add.modal.pug';

export default class ReleaseBaseCtrl {

	/**
	 * @param $uibModal
	 * @param {ApiHelper} ApiHelper
	 * @param {AuthService} AuthService
	 * @param {ReleaseMeta} ReleaseMeta
	 * @param {BootstrapPatcher} BootstrapPatcher
	 * @param BuildResource
	 * @param FileResource
	 * @ngInject
	 */
	constructor($uibModal, ApiHelper, AuthService, ReleaseMeta, BootstrapPatcher, BuildResource, FileResource) {

		BootstrapPatcher.patchCalendar();
		BootstrapPatcher.patchTimePicker();

		this.$uibModal = $uibModal;
		this.ApiHelper = ApiHelper;
		this.AuthService = AuthService;
		this.BuildResource = BuildResource;
		this.FileResource = FileResource;

		this.meta = cloneDeep(ReleaseMeta);
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
		}).result.then(newBuild => {
			// todo
			console.log(newBuild);
		}).catch(angular.noop);
	}

	/**
	 * Deletes an uploaded file from the server and removes it from the list
	 * @param {object} file
	 */
	removeFile(file) {
		this.FileResource.delete({ id: file.storage.id }, () => {
			this.meta.files.splice(this.meta.files.indexOf(file), 1);
			this.releaseVersion.files.splice(this.releaseVersion.files.indexOf(this.releaseVersion.files.find(f => f.id === file.storage.id)), 1);

		}, this.ApiHelper.handleErrorsInDialog('Error removing file.'));
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
		const tableFile = this.releaseVersion.files.find(f => f._randomId === status.randomId);
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
			tableFile = this.releaseVersion.files.find(f => f._randomId === status.randomId);
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
			this.releaseFileRefs[metaReleaseFile.randomId] = this.releaseVersion.files.find(f => f._randomId === metaReleaseFile.randomId);
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
		return this.releaseVersion.files.find(f => f._randomId === status.key.split(':')[1]);
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
	 * TODO
	 * @param file
	 * @param type
	 */
	onBackglassImageError(file, type) {
		console.error(file, type);
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

		/*
		 * There's two variables:
		 *
		 * 1. The uploaded file can be any rotation, e.g. an FS shot is
		 *    typically already rotated to WS.
		 * 2. In order to display, we always use the landscape variation from
		 *    the backend, which is displayed vertically for FS shots and hence
		 *    needs to be rotated back in order to display.
		 *
		 * The `rotationDiff` variable is the angle the backend needs to apply
		 * to rotate the image to its correct orientation.
		 *
		 * The `rotation` variable tells us how to *display* the image, and the
		 * `offset` variable is used to calculate `rotationDiff` when posting
		 * to the server.
		 *
		 * When the user rotates the image, the `rotation` variable is updated,
		 * resulting in a potentially different rotation than before.
		 */
		let rotationDiff = 0;
		let offset = 0;
		const isPortrait = mediaFile.storage.metadata.size.width < mediaFile.storage.metadata.size.height;

		// we use the landscape image from the backend, so if it's a portrait, set offset
		if (isPortrait) {
			offset = -90;
		}

		// if orientation of the release file is known to be desktop, don't rotate.
		if (releaseFile.flavor && releaseFile.flavor.orientation === 'ws') {
			rotationDiff = 0;

		// otherwise, assume it's a fullscreen release and rotate accordingly.
		} else if (!isPortrait) {
			rotationDiff = 90;
		}

		this.meta.mediaLinks[mediaFile.key].rotation = rotationDiff - offset;
		this.meta.mediaLinks[mediaFile.key].offset = offset;
	}

	createMeta(file, key) {
		return {
			name: file.name,
			bytes: file.bytes,
			mimeType: file.mime_type,
			icon: 'ext-vp' + (/table-x$/i.test(file.mime_type) ? 'x' : 't'),
			randomId: file._randomId,
			storage: file,
			key: key
		};
	}

	createLink(file, variation) {
		return {
			url: file.variations[variation].url,
			is_protected: file.variations[variation].is_protected,
			rotation: 0
		};
	}
}
