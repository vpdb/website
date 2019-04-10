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
	GridHelper,
	PerspectiveCamera,
	Raycaster,
	Scene,
	SpotLight,
	Vector2,
	Vector3,
	WebGLRenderer,
} from 'three';
import {TrackballControls} from 'three/examples/jsm/controls/TrackballControls';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {DRACOLoader} from './lib/DRACOLoader';

const showGridHelper = false;

export class VptPreviewScene {

	constructor(canvasElement) {

		DRACOLoader.setDecoderPath('/lib/');
		DRACOLoader.getDecoderModule();

		this.playfieldScale = 0.5;

		this.onProgress = xhr => console.info(xhr.loaded / xhr.total * 100) + '% loaded'; // default progress callback
		this.onError = console.error;
		this.renderer = null;
		this.canvas = canvasElement;
		this.aspectRatio = 1;
		this._recalcAspectRatio();

		this.scene = null;
		this.cameraDefaults = {
			posCamera: new Vector3(0, 25.0, 40.0),
			posCameraTarget: new Vector3(0, -3, 0),
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

		//this.renderer.shadowMapEnabled = true;
		//this.renderer.shadowMap.type = PCFSoftShadowMap;

		this.scene = new Scene();
		this.camera = new PerspectiveCamera(this.cameraDefaults.fov, this.aspectRatio, this.cameraDefaults.near, this.cameraDefaults.far);
		this._initLights();
		this._resetCamera();
		this.canvas.appendChild(this.renderer.domElement);

		this.renderer.domElement.addEventListener('mousedown', this.onClicked.bind(this), false);
		this.controls = new TrackballControls(this.camera);
		this.controls.target = this.cameraDefaults.posCameraTarget;
	}

	initContent(glbUrl, done) {
		const gltfLoader = new GLTFLoader();
		gltfLoader.setDRACOLoader(new DRACOLoader());
		gltfLoader.load(glbUrl, gltf => {
			if (done) {
				done();
			}
			gltf.scene.scale.set(this.playfieldScale, this.playfieldScale, this.playfieldScale);
			this.scene.add(gltf.scene);
		}, this.onProgress, this.onError);
	}

	notify(onProgress, onError) {
		this.onProgress = onProgress;
		this.onError = onError;
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
		const ambientLight = new AmbientLight(0x404040, 1);

		// const spotLightBack = new SpotLight(0xffffff, 5, 50, M.degToRad(30));
		// spotLightBack.position.set(0, 30, 0);
		// spotLightBack.target.position.set(0, 0, -20);
		// spotLightBack.target.updateMatrixWorld();

		const directionalLightFront = new SpotLight(0xffffff);
		directionalLightFront.position.set(0, 30, 20);
		directionalLightFront.target.position.set(0, 0, 0);
		directionalLightFront.target.updateMatrixWorld();
		directionalLightFront.intensity = 0.7;
		//this.scene.add(spotLightBack);
		this.scene.add(directionalLightFront);
		this.scene.add(ambientLight);

		//const lightHelper1 = new SpotLightHelper(spotLightBack);
		//const lightHelper2 = new DirectionalLightHelper(directionalLightFront, 5);
		//this.scene.add(lightHelper1);
		//this.scene.add(lightHelper2);

		if (showGridHelper) {
			const helper = new GridHelper(1200, 60, 0xec843d, 0x404040);
			this.scene.add(helper);
		}
	}
}
