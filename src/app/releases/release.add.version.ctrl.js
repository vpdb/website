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

import { values, map, orderBy, cloneDeep, isEmpty, isArray } from 'lodash';
import ReleaseSelectPlayfieldModalTpl from './release.select.playfield.modal.pug';
import ReleaseBaseCtrl from './release.base.ctrl';

export default class ReleaseAddVersionCtrl extends ReleaseBaseCtrl {

	/**
	 * @param $scope
	 * @param $uibModal
	 * @param $state
	 * @param $stateParams
	 * @param $localStorage
	 * @param {App} App
	 * @param {ApiHelper} ApiHelper
	 * @param {AuthService} AuthService
	 * @param {ModalService} ModalService
	 * @param {ReleaseMeta} ReleaseMeta
	 * @param {Flavors} Flavors
	 * @param {BootstrapPatcher} BootstrapPatcher
	 * @param BuildResource
	 * @param FileResource
	 * @param GameResource
	 * @param ReleaseResource
	 * @param ReleaseVersionResource
	 * @param {TrackerService} TrackerService
	 * @ngInject
	 */
	constructor($scope, $uibModal, $state, $stateParams, $localStorage,
				App, ApiHelper, AuthService, ModalService, ReleaseMeta, Flavors, BootstrapPatcher,
				BuildResource, FileResource, GameResource, ReleaseResource, ReleaseVersionResource, TrackerService) {

		super($uibModal, ApiHelper, AuthService, BootstrapPatcher, BuildResource, FileResource);

		App.theme('light');
		App.setTitle('Upload Files');
		App.setMenu('releases');

		this.$uibModal = $uibModal;
		this.$state = $state;
		this.$localStorage = $localStorage;
		this.App = App;
		this.ApiHelper = ApiHelper;
		this.ModalService = ModalService;
		this.ReleaseVersionResource = ReleaseVersionResource;
		this.ReleaseMeta = ReleaseMeta;

		// define flavors and builds
		this.flavors = values(Flavors);
		this.fetchBuilds();

		// statuses
		this.submitting = false;
		this.showHelp = this.$localStorage.showInstructions.version_add;
		$scope.$watch(() => this.showHelp, () => this.$localStorage.showInstructions.version_add = this.showHelp);

		// fetch game info
		this.gameId = $stateParams.id;
		this.releaseId = $stateParams.releaseId;
		this.release = ReleaseResource.get({ release: this.releaseId }, () => {
			App.setTitle('Upload Files - ' + this.game.title + ' (' + this.release.name + ')');
			TrackerService.trackPage();

			// populate versions
			this.versions = map(orderBy(this.release.versions, 'released_at', false), 'version');

			// init data: either copy from local storage or reset.
			if (this.$localStorage.release_version && this.$localStorage.release_version[this.releaseId]) {
				this.releaseVersion = this.$localStorage.release_version[this.releaseId];
				this.meta = this.$localStorage.release_version_meta[this.releaseId];
				AuthService.collectUrlProps(this.meta, true);
			} else {
				this.reset();
			}
		});
		this.game = GameResource.get({ id: this.gameId });

		// steps
		this.step = {
			files: 1,
			flavors: 2,
			compat: 3,
			media: 4
		};
	}

	selectPlayfield(file) {
		this.$uibModal.open({
			templateUrl: ReleaseSelectPlayfieldModalTpl,
			controller: 'ReleaseSelectPlayfieldModalCtrl',
			controllerAs: 'vm',
			resolve: {
				params: () => {
					return {
						release: this.release,
						file
					};
				}
			}
		}).result.then(playfieldImage => {
			const playfieldImageKey = this.getMediaKey(file, 'playfield_image');
			this.meta.mediaFiles[playfieldImageKey] = this.createMeta(playfieldImage, playfieldImageKey);
			this.meta.mediaLinks[playfieldImageKey] = this.createLink(playfieldImage, 'landscape');
			if (playfieldImage.file_type === 'playfield-fs') {
				this.meta.mediaLinks[playfieldImageKey].rotation = 90;
				this.meta.mediaLinks[playfieldImageKey].offset = -90;
			}
			file._playfield_image = playfieldImage.id;
		});
	}

	canSelectPlayfield(file) {
		return this.getCompatiblePlayfieldImages(this.release, file).length > 0;
	}

	/** Resets all entered data */
	reset() {

		// meta
		if (!this.$localStorage.release_version_meta) {
			this.$localStorage.release_version_meta = {};
		}
		this.meta = this.$localStorage.release_version_meta[this.releaseId] = cloneDeep(this.ReleaseMeta);
		this.meta.mode = 'newFile';
		this.meta.version = this.versions[0];
		this.meta.idMap = {};

		// release
		if (!this.$localStorage.release_version) {
			this.$localStorage.release_version = {};
		}
		this.releaseVersion = this.$localStorage.release_version[this.releaseId] = {
			version: '',
			changes: '*New update!*\n\nChanges:\n\n- Added 3D objects\n- Table now talks.',
			files: [ ]
		};
		this.errors = {};
		this.filesError = null;
		this.releaseFileRefs = {};

		// TODO remove files via API (playfield only when not copied)
	}

	/** Posts the release add form to the server. */
	submit() {

		// retrieve rotation parameters
		const rotationParams = [];
		this.releaseVersion.files.forEach(file => {
			if (!file._playfield_image) {
				return;
			}
			const rotation = this.meta.mediaLinks[this.getMediaKey(file, 'playfield_image')].rotation;
			const offset = this.meta.mediaLinks[this.getMediaKey(file, 'playfield_image')].offset || 0;
			const relativeRotation = rotation + offset;
			rotationParams.push(file._playfield_image + ':' + relativeRotation);
		});

		// only post files
		if (this.meta.mode === 'newFile') {

			if (isEmpty(this.releaseVersion.files)) {
				this.filesError = 'You should probably try adding at least one file...';
				return;
			}

			this.submitting = true;
			this.ReleaseVersionResource.update({ releaseId: this.releaseId, version: this.meta.version, rotate: rotationParams.join(',') }, { files: this.releaseVersion.files }, () => {
				this.submitting = false;
				this.reset();
				this.ModalService.info({
					icon: 'check-circle',
					title: 'Success!',
					subtitle: this.game.title + ' - ' + this.release.name,
					message: 'Successfully uploaded new files to version ' + this.meta.version + '.'
				});

				// go to game page
				this.$state.go('releaseDetails', { id: this.gameId, releaseId: this.releaseId });

			}, this.ApiHelper.handleErrors(this, { fieldPrefix: 'versions.0.' }, scope => {
				this.submitting = false;
				// if it's an array, those area displayed below
				if (!isArray(scope.errors.versions[0].files)) {
					scope.filesError = scope.errors.versions[0].files;
				} else {
					scope.filesError = null;
				}
			}));

		// post whole version
		} else {

			// get release date
			const releaseDate = this.getReleaseDate();
			if (releaseDate) {
				this.releaseVersion.released_at = releaseDate;
			} else {
				delete this.releaseVersion.released_at;
			}

			this.submitting = true;
			this.ReleaseVersionResource.save({ releaseId: this.releaseId, rotate: rotationParams.join(',') }, this.releaseVersion, () => {
				this.submitting = false;
				this.reset();
				this.ModalService.info({
					icon: 'check-circle',
					title: 'Success!',
					subtitle: this.game.title + ' - ' + this.release.name,
					message: 'Successfully uploaded new release version.'
				});

				// go to game page
				this.$state.go('releaseDetails', { id: this.gameId, releaseId: this.releaseId });

			}, this.ApiHelper.handleErrors(this, { fieldPrefix: 'versions.0.' }, scope => {
				this.submitting = false;
				// if it's an array, those area displayed below
				if (!isArray(scope.errors.versions[0].files)) {
					scope.filesError = scope.errors.versions[0].files;
				} else {
					scope.filesError = null;
				}
			}));
		}
	}

	getCompatiblePlayfieldImages(release, file) {
		const images = [];
		release.versions.forEach(version => {
			version.files.forEach(f => {
				if ((f.flavor.orientation === 'any' || f.flavor.orientation === file.flavor.orientation) && (f.flavor.lighting === 'any' || f.flavor.lighting === file.flavor.lighting)) {
					images.push({ version: version, image: f.playfield_image });
				}
			});
		});
		return images;
	}
}
