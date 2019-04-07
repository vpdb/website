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

import {VptPreviewScene} from './vpt.preview.scene';
import VptLoadingModalTpl from './vpt.loading.modal.pug';

export default class VptPreviewCtrl {

	/**
	 *
	 * @param $scope
	 * @param $stateParams
	 * @param {App} App
	 * @param {ApiHelper} ApiHelper
	 * @param {ReleaseResource} ReleaseResource
	 * @ngInject
	 */
	constructor($scope, $stateParams, $uibModal, App, AuthService, ApiHelper, ReleaseResource, TrackerService) {

		App.theme('dark');
		App.setTitle('VPT Preview');
		App.setMenu('releases');

		this.gameId = $stateParams.gameId;
		this.releaseId = $stateParams.releaseId;
		this.version = $stateParams.version;
		this.fileId = $stateParams.fileId;

		this.scene = new VptPreviewScene(document.getElementById('gl-view'));

		this.scene.initGl();
		this.scene.resizeDisplayGl();

		// setup statuses
		this.status = {
			release: { loading: false, offline: false },
			game: { loading: false, offline: false },
		};

		// seo structured data
		this.ldRelease = {
			'@context': 'http://schema.org/',
			'@type': 'Product'
		};

		const modal = $uibModal.open({
			templateUrl: VptLoadingModalTpl,
			controller: 'vptLoadingModalCtrl',
			controllerAs: 'vm',
			size: 'sm',
			resolve: {
				params: () => {
					return {
						scene: this.scene,
					};
				}
			}
		});

		ApiHelper.request(() => ReleaseResource.get({ release: this.releaseId }), this.status.release).then(release => {

			const version = release.versions.find(v => v.version === this.version);
			if (!version) {
				throw new Error('No such version "' + this.version + '" for this release.');
			}
			const file = version.files.find(f => f.file.id === this.fileId);
			if (!file) {
				throw new Error('No such file "' + this.fileId + '" for version ' + this.version);
			}

			const gltf = file.file.variations.gltf;
			if (!gltf) {
				throw new Error('Seems like there is no GLTF variation of this release.');
			}

			if (gltf.is_protected) {
				if (AuthService.isAuthenticated) {
					AuthService.fetchUrlTokens(gltf.url, (err, tokens) => {
						// todo treat error
						this.scene.initContent(gltf.url + '?token=' + tokens[gltf.url], () => modal.close());
					});

				} else {
					App.login({
						headMessage: 'You gotta be logged to see 3D models of this release.',
						//postLogin: { action: 'downloadFile', params: file }
					});
				}
			}
			// if (gltf.is_protected) {
			// 	AuthService.addUrlToken(gltf.url,url => this.scene.initContent(url, () => modal.close()));
			// } else {
			// 	this.scene.initContent(gltf.url, () => modal.close());
			// }

			const title = release.game.title + ' · ' + release.name + ' · 3D Preview';
			const meta = {
				description: `${release.game.title} (${release.game.manufacturer} ${release.game.year}) - ${release.name} ${release.versions[0].version} by ${release.authors.map(a => a.user.name).join(', ')}`,
				keywords: [release.game.title, release.name, '3D', 'GLTF', 'GLB'].join(','),
			};
			this.release = release;
			App.setTitle(title);

			// seo structured data
			this.ldRelease.name = title;
			if (release.description) {
				this.ldRelease.description = release.description;
			}
			this.ldRelease.brand = release.authors.map(a => a.user.name).join(', ');

			let playfieldImage;
			release.versions.forEach(version => {
				version.files.forEach(file => {
					// prefer landscape shot
					if (!playfieldImage || (file.playfield_image.file_type === 'playfield-ws' && playfieldImage.file_type !== 'playfield-ws')) {
						playfieldImage = file.playfield_image;
					}
				});
			});
			if (playfieldImage) {
				this.ldRelease.image = playfieldImage.variations['medium'].url;
				meta.thumbnail = playfieldImage.variations['medium'].url;
			}
			App.setMeta(meta);
			TrackerService.trackPage();

		}).catch(() => this.release = null);

		this.render();
	}

	render() {
		requestAnimationFrame(this.render.bind(this));
		this.scene.render();
	}
}
