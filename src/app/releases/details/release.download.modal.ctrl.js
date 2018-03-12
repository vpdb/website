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

import { includes, isEmpty, filter, values, map } from 'lodash';

export default class ReleaseDownloadModalCtrl {

	/**
	 * @param $scope
	 * @param $timeout
	 * @param $uibModalInstance
	 * @param {App} App
	 * @param {DownloadService} DownloadService
	 * @param {Flavors} Flavors
	 * @param RomResource
	 * @param params
	 * @ngInject
	 */
	constructor($scope, $timeout, $uibModalInstance, App, DownloadService, Flavors, RomResource, params) {

		this.$timeout = $timeout;
		this.$uibModalInstance = $uibModalInstance;
		this.App = App;
		this.DownloadService = DownloadService;
		this.Flavors = Flavors;
		this.RomResource = RomResource;

		this.game = params.game;
		this.release = params.release;
		this.latestVersion = params.latestVersion;
		this.includeGameMedia = false;

		this.gameMedia = this.game.media;
		this.roms = RomResource.query({ id: this.game.id });

		this.downloadFiles = {};
		this.downloadRequest = {
			files: [],
			media: {
				playfield_image: true,
				playfield_video: false
			},
			backglass: null,
			game_media: [],
			roms: []
		};

		$scope.$watch(() => this.includeGameMedia, () => {
			this.downloadRequest.game_media = [];
			if (this.includeGameMedia) {
				const addedCategories = [];
				this.gameMedia.forEach(media => {
					if (!includes(addedCategories, media.category)) {
						this.downloadRequest.game_media.push(media.id);
					}
					addedCategories.push(media.category);
				});
			}
		});

		if (!isEmpty(this.gameMedia)) {
			this.includeGameMedia = true;
		}

		const tableFiles = filter(this.latestVersion.files, this.tableFile);
		if (tableFiles.length === 1) {
			this.toggleFile(tableFiles[0]);
		}
	}

	// todo refactor (make it more useful)
	tableFile(file) {
		return file.file.mime_type && /^application\/x-visual-pinball-table/i.test(file.file.mime_type);
	}

	download() {
		this.DownloadService.downloadRelease(this.release.id, this.downloadRequest, () => {
			this.$uibModalInstance.close(true);
		});
	}

	toggleFile(file) {
		if (this.downloadFiles[file.file.id]) {
			delete this.downloadFiles[file.file.id];
		} else {
			this.downloadFiles[file.file.id] = file;
		}
		this.downloadRequest.files = values(map(map(this.downloadFiles, 'file'), 'id'));
	}

	selectBackglass(backglass) {
		if (backglass.id === this.downloadRequest.backglass) {
			this.downloadRequest.backglass = null;
		} else {
			this.downloadRequest.backglass = backglass.id;
		}
	}

	toggleRom(rom) {
		if (!includes(this.downloadRequest.roms, rom.id)) {
			this.downloadRequest.roms.push(rom.id);
		} else {
			this.downloadRequest.roms.splice(this.downloadRequest.roms.indexOf(rom.id), 1);
		}
	}
}

export { ReleaseDownloadModalCtrl };
