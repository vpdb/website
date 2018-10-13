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

import { orderBy, pick } from 'lodash';
import ReleaseBaseCtrl from '../release.base.ctrl';

export default class ReleaseEditVersionModalCtrl extends ReleaseBaseCtrl {

	/**
	 * @param $uibModalInstance
	 * @param $uibModal
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
	constructor($uibModalInstance, $uibModal, ApiHelper, AuthService, ReleaseMeta, BootstrapPatcher, ModalService,
				game, release, version, FileResource, ReleaseVersionResource, BuildResource) {
		super($uibModal, ApiHelper, AuthService, ReleaseMeta, BootstrapPatcher, BuildResource, FileResource);

		this.$uibModalInstance = $uibModalInstance;
		this.ApiHelper = ApiHelper;
		this.AuthService = AuthService;
		this.ModalService = ModalService;
		this.ReleaseVersionResource = ReleaseVersionResource;

		version.released_at = new Date(version.released_at);

		this.pageLoading = false;
		this.game = game;
		this.release = release;
		this.releaseVersion = version;

		/** The object posted to the server. **/
		this.version = pick(version, [ 'released_at', 'changes' ]);

		this.meta.files = version.files.map(file => {
			file._randomId = file.file.id;
			file.file._randomId = file.file.id;
			const playfieldImageKey = this.getMediaKey(file.file, 'playfield_image');
			this.meta.mediaFiles[playfieldImageKey] = this.createMeta(file.playfield_images[0], playfieldImageKey);
			this.meta.mediaLinks[playfieldImageKey] = this.createLink(file.playfield_images[0], 'landscape');
			if (file.playfield_videos && file.playfield_videos.length) {
				const playfieldVideoKey = this.getMediaKey(file.file, 'playfield_video');
				this.meta.mediaFiles[playfieldVideoKey] = this.createMeta(file.playfield_videos[0]);
				this.meta.mediaLinks[playfieldVideoKey] = this.createLink(file.playfield_videos[0], 'small-rotated');
			}
			if (file.playfield_images[0].file_type === 'playfield-fs') {
				this.meta.mediaLinks[playfieldImageKey].rotation = 90;
			}
			return Object.assign(this.createMeta(file.file, { _compatibility: file.compatibility.map(c => c.id) }));
		});

		version.files.forEach(releaseFile => {
			const mediaFile = this.meta.mediaFiles[this.getMediaKey(releaseFile.file, 'playfield_image')];
			this.updateRotation(releaseFile, mediaFile);
			releaseFile._compatibility = releaseFile.compatibility.map(c => c.id);
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
		const releaseFile = this.releaseVersion.files.find(f => f.file.id === metaFile.storage.id);
		const idx = releaseFile._compatibility.indexOf(build.id);
		if (idx > -1) {
			releaseFile._compatibility.splice(idx, 1);
		} else {
			releaseFile._compatibility.push(build.id);
		}
	}

	save() {

		// retrieve rotation parameters
		const rotationParams = [];
		this.releaseVersion.files.forEach(file => {
			let playfield_images = file._playfield_images || file.playfield_images;
			if (!playfield_images || !playfield_images.length) {
				return;
			}
			const rotation = this.meta.mediaLinks[this.getMediaKey(file.file, 'playfield_image')].rotation;
			const offset = this.meta.mediaLinks[this.getMediaKey(file.file, 'playfield_image')].offset;
			const relativeRotation = (rotation + offset + 360) % 360;
			rotationParams.push((playfield_images[0].id || playfield_images[0]) + ':' + relativeRotation);
		});

		// populate files
		this.version.files = [];
		this.releaseVersion.files.forEach(file => {
			const releaseFile = {
				_file: file.file.id,
				_compatibility: file._compatibility
			};
			if (file._playfield_images) {
				releaseFile._playfield_images = file._playfield_images;
			}
			if (file._playfield_videos) {
				releaseFile._playfield_videos = file._playfield_videos;
			}
			this.version.files.push(releaseFile);
		});

		this.pageLoading = true;
		this.ReleaseVersionResource.update({
			releaseId: this.release.id,
			version: this.releaseVersion.version,
			rotate: rotationParams.join(',')
		}, this.version, updatedVersion => {

			this.pageLoading = false;
			this.$uibModalInstance.close(updatedVersion);
			this.ModalService.info({
				icon: 'check-circle',
				title: 'Version updated',
				subtitle: this.game.title,
				message: 'You have successfully updated version ' + this.releaseVersion.version + ' of release "' + this.release.name + '".'
			});

		}, this.ApiHelper.handleErrors(this, {}, null, (scope, response) => {

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
	}
}
