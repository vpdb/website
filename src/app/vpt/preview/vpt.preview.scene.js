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

import {TrackballControls} from 'three/examples/jsm/controls/TrackballControls';
import {PCFSoftShadowMap} from 'three/src/constants';
import {Vector3} from 'three/src/math/Vector3';
import {Vector2} from 'three/src/math/Vector2';
import {WebGLRenderer} from 'three/src/renderers/WebGLRenderer';
import {Scene} from 'three/src/scenes/Scene';
import {PerspectiveCamera} from 'three/src/cameras/PerspectiveCamera';
import {AmbientLight} from 'three/src/lights/AmbientLight';
import {DirectionalLight} from 'three/src/lights/DirectionalLight';
import {Raycaster} from 'three/src/core/Raycaster';
import {VptLoader} from './vpt.loader';

export class VptPreviewScene {

	constructor(canvasElement) {
		this.renderer = null;
		this.canvas = canvasElement;
		this.aspectRatio = 1;
		this._recalcAspectRatio();

		this.scene = null;
		this.cameraDefaults = {
			posCamera: new Vector3(0, 1500.0, 2500.0),
			posCameraTarget: new Vector3(0, -1500, 0),
			near: 0.1,
			far: 100000,
			fov: 45,
		};
		/** @var Camera */
		this.camera = null;
		this.cameraTarget = this.cameraDefaults.posCameraTarget;

		this.mouse = new Vector2();
		this.meshes = [];
	}

	initGl() {

		this.renderer = new WebGLRenderer({
			antialias: true,
			autoClear: true,
			alpha: true,
		});
		this.renderer.shadowMapEnabled = true;
		this.renderer.shadowMap.type = PCFSoftShadowMap;

		this.scene = new Scene();
		this.camera = new PerspectiveCamera(this.cameraDefaults.fov, this.aspectRatio, this.cameraDefaults.near, this.cameraDefaults.far);
		this._initLights();
		this._resetCamera();
		this.canvas.appendChild(this.renderer.domElement);

		this.renderer.domElement.addEventListener('mousedown', this.onClicked.bind(this), false);
		this.controls = new TrackballControls(this.camera);
		this.controls.target = this.cameraDefaults.posCameraTarget;
	}

	initContent(vpTable) {

		window.vpt = vpTable; // for easier debugging

		const loader = new VptLoader(vpTable);
		const playfield = loader.getPlayfield();
		playfield.translateX(-vpTable.game_data.size.width / 2);
		playfield.rotateX(Math.PI / 2);
		//playfield.scale.set(0.1, 0.1, 0.1)
		this.scene.add(playfield);
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

	onClicked(event) {
		event.preventDefault();

		const rect = this.renderer.domElement.getBoundingClientRect();

		this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
		this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

		const raycaster = new Raycaster();
		raycaster.setFromCamera(this.mouse, this.camera);
		const intersects = raycaster.intersectObjects(this.meshes, true);

		if (intersects.length > 0) {
			console.log(intersects.map(i => i.object.name));
		}
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

	_initLights() {
		const ambientLight = new AmbientLight(0x404040);

		const directionalLight = new DirectionalLight(0xC0C0C0);
		directionalLight.position.set(0, 500, 500);
		directionalLight.intensity = 0.5;
		directionalLight.castShadow = true;

		this.scene.add(directionalLight);
		this.scene.add(ambientLight);

		// const helper = new GridHelper(1200, 60, 0xec843d, 0x404040);
		// this.scene.add(helper);
	}
}
