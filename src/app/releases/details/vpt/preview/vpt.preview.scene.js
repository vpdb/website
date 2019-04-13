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
	PerspectiveCamera,
	Raycaster,
	Scene,
	Vector2,
	Vector3,
	WebGLRenderer,
} from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {DRACOLoader} from './lib/DRACOLoader';

const showGridHelper = false;

export class VptPreviewScene {

	constructor(canvasElement) {

		DRACOLoader.setDecoderPath('/lib/');
		DRACOLoader.getDecoderModule();

		this.playfieldScale = 0.5;

		this.bulbLights = [];
		this.bulbLightsIntensity = 1;
		this.globalLightsIntensity = 0.5;

		this.config = {
			showPrimitives: true,
			showPlayfield: true,
		};

		const sliderOptions = {
			step: 0.001,
			floor: 0,
			ceil: 3,
			precision: 1,
			hidePointerLabels: true,
			hideLimitLabels: true,
			disabled: true,
		};

		this.sceneGroups = { };
		this.sceneGroupsVisible = { };

		this.globalLightsSliderOptions = Object.assign({}, sliderOptions, {
			onChange: () => {
				this.directionalLightFront.intensity = this.globalLightsIntensity;
				this.directionalLightBack.intensity = this.globalLightsIntensity;
			},
		});
		this.bulbLightsSliderOptions = Object.assign({}, sliderOptions, {
			onChange: () => {
				this.bulbLights.forEach((bl, i) => {
					bl.intensity = this.bulbLightIntensities[i] * this.bulbLightsIntensity;
				});
			}
		});

		this.renderer = null;
		this.canvas = canvasElement;
		this.aspectRatio = 1;
		this._recalcAspectRatio();

		this.scene = null;
		this.cameraDefaults = {
			posCamera: new Vector3(-10, 40.0, 50.0),
			posCameraTarget: new Vector3(0, -5, 0),
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
		this.controls = new OrbitControls(this.camera);
		this.controls.target = this.cameraDefaults.posCameraTarget;
		this.controls.enableDamping = true;
		this.controls.dampingFactor = 0.1;
		this.controls.rotateSpeed = 0.1;
		this.controls.panSpeed = 0.2;

		return this.renderer;
	}

	toggleContent(groupName, clickEvent) {
		if (this.sceneGroups[groupName]) {
			this.sceneGroups[groupName].visible = clickEvent.target.checked;
		}
	}

	loadContent(glbUrl, onDone, onProgress, onError) {
		const gltfLoader = new GLTFLoader(this.loadingManager);
		gltfLoader.setDRACOLoader(new DRACOLoader(this.loadingManager));
		gltfLoader.load(glbUrl, gltf => {
			onDone();
			const playfield = gltf.scene.children.find(node => node.name === 'playfield');
			const lights = playfield ? playfield.children.find(c => c.name === 'lights') : null;
			for (const group of playfield.children) {
				this.sceneGroups[group.name] = group;
				this.sceneGroupsVisible[group.name] = true;
			}
			this.bulbLights = lights ? lights.children : [];
			this.bulbLightIntensities = this.bulbLights.map(bl => bl.intensity);
			gltf.scene.scale.set(this.playfieldScale, this.playfieldScale, this.playfieldScale);
			this.scene.add(gltf.scene);
		}, onProgress, onError);
	}

	render() {
		if (!this.renderer.autoClear) {
			this.renderer.clear();
		}
		this.controls.update();
		this.renderer.render(this.scene, this.camera);
	}

	resizeDisplayGl() {
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

		// ambient light
		const ambientLight = new AmbientLight(0xffffff, 0.3);
		this.scene.add(ambientLight);

		// front
		this.directionalLightFront = new DirectionalLight(0xffffff);
		this.directionalLightFront.position.set(0, 30, 20);
		this.directionalLightFront.target.position.set(0, 0, 0);
		this.directionalLightFront.target.updateMatrixWorld();
		this.directionalLightFront.intensity = this.globalLightsIntensity;
		this.scene.add(this.directionalLightFront);

		// front
		this.directionalLightBack = new DirectionalLight(0xffffff);
		this.directionalLightBack.position.set(0, 30, -30);
		this.directionalLightBack.target.position.set(0, 0, -10);
		this.directionalLightBack.target.updateMatrixWorld();
		this.directionalLightBack.intensity = this.globalLightsIntensity;
		this.scene.add(this.directionalLightBack);

		// const lightHelper1 = new DirectionalLightHelper(this.directionalLightBack, 5);
		// const lightHelper2 = new DirectionalLightHelper(this.directionalLightFront, 5);
		// this.scene.add(lightHelper1);
		// this.scene.add(lightHelper2);

		if (showGridHelper) {
			const helper = new GridHelper(1200, 60, 0xec843d, 0x404040);
			this.scene.add(helper);
		}
	}
}
