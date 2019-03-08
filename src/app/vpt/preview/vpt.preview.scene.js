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

import {
	AmbientLight,
	DirectionalLight,
	GridHelper,
	LoadingManager,
	PerspectiveCamera,
	Scene,
	Vector3,
	WebGLRenderer
} from 'three';
import {TrackballControls} from 'three/examples/jsm/controls/TrackballControls';
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader';

export class VptPreviewScene {

	constructor(canvasElement) {
		this.renderer = null;
		this.canvas = canvasElement;
		this.aspectRatio = 1;
		this._recalcAspectRatio();

		this.scene = null;
		this.cameraDefaults = {
			posCamera: new Vector3(0.0, 175.0, 500.0),
			posCameraTarget: new Vector3(0, 0, 0),
			near: 0.1,
			far: 10000,
			fov: 45
		};
		this.camera = null;
		this.cameraTarget = this.cameraDefaults.posCameraTarget;
	}

	initGl() {
		this.renderer = new WebGLRenderer({
			canvas: this.canvas,
			antialias: true,
			autoClear: true,
			alpha: true,
		});

		//this.renderer.setClearColor(0xff0000);

		this.scene = new Scene();

		this.camera = new PerspectiveCamera(this.cameraDefaults.fov, this.aspectRatio, this.cameraDefaults.near, this.cameraDefaults.far);
		this._resetCamera();
		this.controls = new TrackballControls(this.camera, this.renderer.domElement);


		const ambientLight = new AmbientLight(0x404040);
		const directionalLight1 = new DirectionalLight(0xC0C090);
		const directionalLight2 = new DirectionalLight(0xC0C090);

		directionalLight1.position.set(-100, -50, 100);
		directionalLight2.position.set(100, 50, -100);

		this.scene.add(directionalLight1);
		this.scene.add(directionalLight2);
		this.scene.add(ambientLight);

		const helper = new GridHelper(1200, 60, 0xFF4444, 0x404040);
		this.scene.add(helper);
	}

	initContent(data) {

		const loader = new OBJLoader();
		for (const primitive of data.primitives) {
			loader.load(primitive.mesh, loadedMesh => { /** @type {Object3D} */
				loadedMesh.position.set(primitive.pos.x, primitive.pos.y, primitive.pos.z);
				loadedMesh.scale.set(primitive.size.x, primitive.size.y, primitive.size.z);
				loadedMesh.rotation.set(
					this._toRadian(primitive.rot.x),
					this._toRadian(primitive.rot.y),
					this._toRadian(primitive.rot.z));
				this.scene.add(loadedMesh);

			}, xhr => {
				if (xhr.lengthComputable) {
					//var percentComplete = xhr.loaded / xhr.total * 100;
					//console.log('model ' + Math.round(percentComplete, 2) + '% downloaded');
				}
			}, err => {
				console.error(err);
			});
		}
	}

	render() {
		if (!this.renderer.autoClear) {
			this.renderer.clear();
		}
		this.controls.update();
		this.renderer.render(this.scene, this.camera);
	}

	resizeDisplayGl() {
		this.controls.handleResize();
		this._recalcAspectRatio();
		this.renderer.setSize(this.canvas.offsetWidth, this.canvas.offsetHeight, false);
		this._updateCamera();
	}

	_recalcAspectRatio() {
		this.aspectRatio = (this.canvas.offsetHeight === 0) ? 1 : this.canvas.offsetWidth / this.canvas.offsetHeight;
	}

	_resetCamera() {
		this.camera.position.copy(this.cameraDefaults.posCamera);
		this.cameraTarget.copy(this.cameraDefaults.posCameraTarget);

		this._updateCamera();
	}

	_updateCamera() {
		this.camera.aspect = this.aspectRatio;
		this.camera.lookAt(this.cameraTarget);
		this.camera.updateProjectionMatrix();
	}

	_toRadian(deg) {
		return deg * Math.PI / 180;
	}
}
