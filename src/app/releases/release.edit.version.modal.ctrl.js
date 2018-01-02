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

import { cloneDeep, map, assign, orderBy, find } from 'lodash';
import ReleaseAddBaseCtrl from './release.add.base.ctrl';

export default class ReleaseEditVersionModalCtrl extends ReleaseAddBaseCtrl {

	/**
	 * @param $uibModalInstance
	 * @param {ApiHelper} ApiHelper
	 * @param {AuthService} AuthService
	 * @param {ReleaseMeta} ReleaseMeta
	 * @param {BootstrapPatcher} BootstrapPatcher
	 * @param {ModalService} ModalService
	 * @param game
	 * @param release
	 * @param version
	 * @param FileResource
	 * @param ReleaseVersionResource
	 * @param BuildResource
	 * @ngInject
	 */
	constructor($uibModalInstance, ApiHelper, AuthService, ReleaseMeta, BootstrapPatcher, ModalService,
				game, release, version, FileResource, ReleaseVersionResource, BuildResource) {
		super($uibModal, ApiHelper, AuthService, BootstrapPatcher, BuildResource, FileResource);

		BootstrapPatcher.patchCalendar();

		this.$uibModalInstance = $uibModalInstance;
		this.ApiHelper = ApiHelper;
		this.AuthService = AuthService;
		this.ModalService = ModalService;
		this.ReleaseVersionResource = ReleaseVersionResource;

		this.game = game;
		this.release = release;
		this.releaseVersion = version;
		this.version = map(version, 'released_at', 'changes');
		this.meta = cloneDeep(ReleaseMeta);
		this.pageLoading = false;

		this.meta.files = this.version.files.map(file => {
			file._randomId = file.file.id;
			file.file._randomId = file.file.id;
			const playfieldImageKey = this.getMediaKey(file.file, 'playfield_image');
			this.meta.mediaFiles[playfieldImageKey] = this.createMeta(file.playfield_image, playfieldImageKey);
			this.meta.mediaLinks[playfieldImageKey] = this.createLink(file.playfield_image, 'landscape');
			if (file.playfield_video) {
				const playfieldVideoKey = this.getMediaKey(file.file, 'playfield_video');
				this.meta.mediaFiles[playfieldVideoKey] = this.createMeta(file.playfield_video);
				this.meta.mediaLinks[playfieldVideoKey] = this.createLink(file.playfield_video, 'small-rotated');
			}
			if (file.playfield_image.file_type === 'playfield-fs') {
				this.meta.mediaLinks[playfieldImageKey].rotation = 90;
			}
			return assign(this.createMeta(file.file, { _compatibility: map(file.compatibility, 'id') }));
		});

		version.files.forEach(releaseFile => {
			const mediaFile = this.meta.mediaFiles[this.getMediaKey(releaseFile.file, 'playfield_image')];
			this.updateRotation(releaseFile, mediaFile);
			releaseFile._compatibility = map(releaseFile.compatibility, 'id');
		});

		BuildResource.query(builds => {
			this.builds = {};
			orderBy(builds, ['built_at'], ['desc']).forEach(build => {
				if (!this.builds[build.type]) {
					this.builds[build.type] = [];
				}
				build.built_at = new Date(build.built_at);
				this.builds[build.type].push(build);
			});
		});
	}

	toggleBuild(metaFile, build) {
		const releaseFile = find(this.releaseVersion.files, f => f.file.id === metaFile.storage.id);
		const idx = releaseFile._compatibility.indexOf(build.id);
		if (idx > -1) {
			releaseFile._compatibility.splice(idx, 1);
		} else {
			releaseFile._compatibility.push(build.id);
		}
	}

	save() {

		// get release date
		const releaseDate = this.getReleaseDate();
		if (releaseDate) {
			this.releaseVersion.released_at = releaseDate;
		} else {
			delete this.releaseVersion.released_at;
		}

		// retrieve rotation parameters
		const rotationParams = [];
		this.releaseVersion.files.forEach(file => {
			let playfield_image = file._playfield_image || file.playfield_image;
			if (!playfield_image) {
				return;
			}
			const rotation = this.meta.mediaLinks[this.getMediaKey(file.file, 'playfield_image')].rotation;
			const offset = this.meta.mediaLinks[this.getMediaKey(file.file, 'playfield_image')].offset;
			const relativeRotation = rotation + offset;
			rotationParams.push((playfield_image.id || playfield_image) + ':' + relativeRotation);
		});

		// populate files
		this.version.files = [];
		this.releaseVersion.files.forEach(file => {
			const releaseFile = {
				_file: file.file.id,
				_compatibility: file._compatibility
			};
			if (file._playfield_image) {
				releaseFile._playfield_image = file._playfield_image;
			}
			if (file._playfield_video) {
				releaseFile._playfield_video = file._playfield_video;
			}
			this.version.files.push(releaseFile);
		});

		this.pageLoading = true;
		this.ReleaseVersionResource.update({ releaseId: this.release.id, version: this.releaseVersion.version, rotate: rotationParams.join(',') }, this.version, updatedVersion => {

			this.pageLoading = false;
			this.$uibModalInstance.close(updatedVersion);
			this.ModalService.info({
				icon: 'check-circle',
				title: 'Version updated',
				subtitle: this.game.title,
				message: 'You have successfully updated version ' + this.releaseVersion.version + ' of release "' + this.release.name + '".'
			});

		}, this.ApiHelper.handleErrors(this, null, null, scope, response => {

			this.pageLoading = false;
			if (!response.data.errors) {
				return;
			}

			// rephrase some of the messages from backend
			response.data.errors.forEach(error => {

				if (/orientation is set to FS but playfield image is .playfield-ws./i.test(error.message)) {
					error.message = 'Wrong orientation. Use the rotation button above to rotate the playfield so it\'s oriented as if you would play it. If that\'s the case, then you\'ve uploaded a widescreen (DT) shot for a file marked as portrait (FS).';
				}
				if (/orientation is set to WS but playfield image is .playfield-fs./i.test(error.message)) {
					error.message = 'Wrong orientation. Use the rotation button above to rotate the playfield so it\'s oriented as if you would play it. If that\'s the case, then you\'ve uploaded a portrait (FS) shot for a file marked as widescreen (DT).';
				}
			});
		}));
	};
}