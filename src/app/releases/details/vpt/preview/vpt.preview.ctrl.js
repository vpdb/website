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

export default class VptPreviewCtrl {

	/**
	 * @param $scope
	 * @param $stateParams
	 * @param $uibModal
	 * @param {App} App
	 * @param {AuthService} AuthService
	 * @param {ApiHelper} ApiHelper
	 * @param {ReleaseResource} ReleaseResource
	 * @param {TrackerService} TrackerService
	 * @ngInject
	 */
	constructor($scope, $stateParams, $uibModal, App, AuthService, ApiHelper, ReleaseResource, TrackerService) {

		App.theme('dark');
		App.setTitle('VPT Preview');
		App.setMenu('releases');
		App.enableScrollbars(false);

		this.$scope = $scope;
		this.gameId = $stateParams.gameId;
		this.releaseId = $stateParams.releaseId;
		this.version = $stateParams.version;
		this.fileId = $stateParams.fileId;

		this.percentLoaded = 0;
		this.isLoaded = false;
		this.errorTitle = null;
		this.errorMessage = null;
		this.glView = document.getElementById('gl-view');
		this.scene = new VptPreviewScene(this.glView);

		const renderer = this.scene.initGl();
		renderer.context.canvas.addEventListener('webglcontextlost', function(event) {
			event.preventDefault();
			this.errorTitle = 'Rendering Failed.';
			this.errorMessage = 'WebGL context was lost, this can happen on low-end devices.';
			cancelAnimationFrame(this.animationId);
		}, false);
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
						if (err) {
							this.errorTitle = 'Authentication error';
							this.errorMessage = err.message;
							return;
						}
						this.scene.loadContent(gltf.url + '?token=' + tokens[gltf.url], this.onLoaded.bind(this), this.onProgress.bind(this), this.onError.bind(this));
					});

				} else {
					this.errorTitle = 'Sorry!';
					throw new Error('You gotta be logged to see this 3D model.');
				}
			} else {
				this.scene.loadContent(gltf.url, this.onLoaded.bind(this), this.onProgress.bind(this), this.onError.bind(this));
			}

			const title = release.game.title + ' · ' + release.name + ' · 3D Preview';
			const meta = {
				description: `${release.game.title} (${release.game.manufacturer} ${release.game.year}) - ${release.name} ${release.versions[0].version} by ${release.authors.map(a => a.user.name).join(', ')}`,
				keywords: [release.game.title, release.name, '3D', '3D Model', 'GLTF', 'GLB'].join(','),
			};
			this.release = release;
			App.setTitle(title);

			// seo structured data
			this.ldRelease.name = title;
			if (release.description) {
				this.ldRelease.description = release.description;
			}
			this.ldRelease.brand = release.authors.map(a => a.user.name).join(', ');

			App.setMeta(meta);
			TrackerService.trackPage();

		}).catch(err => {
			this.errorTitle = this.errorTitle || 'Error retrieving release';
			this.errorMessage = err.message;
			this.release = null;
		});

		window.addEventListener( 'resize', () => this.scene.resizeDisplayGl(), false );

		this.render();
	}

	onLoaded() {
		if (!this.errorMessage) {
			this.isLoaded = true;
			this.scene.globalLightsSliderOptions.disabled = false;
			this.scene.bulbLightsSliderOptions.disabled = false;
			this.$scope.$apply();
		}
	}

	onProgress(progress) {
		this.percentLoaded = progress.loaded / progress.total * 100;
		this.$scope.$apply();
	}

	onError(err) {
		this.errorTitle = 'Error loading model';
		if (err.currentTarget) {
			this.errorMessage = err.currentTarget.status + ' ' + err.currentTarget.statusText + '.';
		} else {
			this.errorMessage = err && err.message ? err.message : (err ? err : 'Something went wrong!');
		}

		this.$scope.$apply();
	}

	render() {
		this.animationId = requestAnimationFrame(this.render.bind(this));
		this.scene.render();
	}
}
