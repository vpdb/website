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
	GridHelper, Group, LoadingManager,
	PerspectiveCamera, PointLightHelper,
	Raycaster,
	RGBAFormat,
	Scene,
	Vector2,
	Vector3,
	WebGLRenderer,
} from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {DRACOLoader} from './lib/DRACOLoader';
import * as WpcEmu from 'wpc-emu/lib/emulator';
import {initialiseActions} from 'wpc-emu/client/scripts/lib/initialise';

const showGridHelper = false;

const TICKS = 2000000;
const DESIRED_FPS = 58;
const TICKS_PER_CALL = parseInt(TICKS / DESIRED_FPS, 10);
const TICKS_PER_STEP = 16;

export class VptPreviewScene {

	constructor(canvasElement) {

		DRACOLoader.setDecoderPath('/lib/');
		DRACOLoader.getDecoderModule();

		this.initScene();
		this.playfieldScale = 0.5;
		this.addHelpers = false;

		const sliderOptions = {
			step: 0.0002,
			floor: 0,
			ceil: 3,
			precision: 10,
			hidePointerLabels: true,
			hideLimitLabels: true,
			disabled: true,
		};

		this.globalLightsSliderOptions = Object.assign({}, sliderOptions, {
			ceil: 2,
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

		this.canvas = canvasElement;
		this._recalcAspectRatio();

		this.scene = null;
		this.cameraDefaults = {
			posCamera: new Vector3(-10, 40.0, 50.0),
			posCameraTarget: new Vector3(0, -5, 0),
			near: 1,
			far: 500,
			fov: 45,
		};
		/** @var Camera */
		this.camera = null;
		this.cameraTarget = this.cameraDefaults.posCameraTarget;

		this.mouse = new Vector2();
		this.meshes = [];
	}

	initScene() {

		this.bulbLights = [];
		this.bulbLightsIntensity = 1;
		this.globalLightsIntensity = 0.2;

		this.sceneGroups = { };
		this.sceneGroupsVisible = { };
	}

	initGl() {

		this.renderer = new WebGLRenderer({
			antialias: true,
			autoClear: true,
			alpha: true,
		});

		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(this.canvas.offsetWidth / window.devicePixelRatio, this.canvas.offsetHeight / window.devicePixelRatio, false);
		this.renderer.gammaFactor = 1.3;
		this.renderer.gammaOutput = true;
		this.renderer.domElement.addEventListener('mousedown', this.onClicked.bind(this), false);

		this.scene = new Scene();
		this.camera = new PerspectiveCamera(this.cameraDefaults.fov, this.aspectRatio, this.cameraDefaults.near, this.cameraDefaults.far);

		this.controls = new OrbitControls(this.camera, this.renderer.domElement);
		this.controls.target = this.cameraDefaults.posCameraTarget;
		this.controls.enableDamping = true;
		this.controls.dampingFactor = 0.1;
		this.controls.rotateSpeed = 0.1;
		this.controls.panSpeed = 0.2;

		this._initLights();
		this._resetCamera();

		this.canvas.appendChild(this.renderer.domElement);

		return this.renderer;
	}

	/**
	 * Progress calculation is a bit weird here.
	 *
	 * Basically we have progress from GLTFLoader, which should make about half
	 * of the time. Then we have the mesh decompression etc, which we manage
	 * with a LoadingManager.
	 *
	 * To the client we send back the average of both minus a threshold so it
	 * doesn't get blocked at the end while it's rendering.
	 *
	 * @param glbUrl
	 * @param onDone
	 * @param onProgress
	 * @param onError
	 */
	loadUrl(glbUrl, onDone, onProgress, onError) {
		const manager = new LoadingManager();
		const stopBefore = 10;
		let progress1 = 0;
		let progress2 = 0;
		let loaded1 = false;
		let loaded2 = false;
		manager.onProgress = (url, itemsLoaded, itemsTotal) => {
			progress2 = itemsLoaded / itemsTotal * 100;
			onProgress((progress1 + progress2) / 2 - stopBefore);
		};
		manager.onLoad = () => {
			if (loaded1) {
				onDone();
			} else {
				loaded2 = true;
			}
		};

		const gltfLoader = new GLTFLoader(manager);
		gltfLoader.setDRACOLoader(new DRACOLoader(manager));
		gltfLoader.load(glbUrl, gltf => {
			if (loaded2) {
				onDone();
			} else {
				loaded1 = true;
			}
			this._onLoaded(gltf);
		}, progress => {
			progress1 = progress.loaded / progress.total * 100;
			onProgress((progress1 + progress2) / 2 - stopBefore);
		}, onError);
	}

	loadFile(glbData, onDone, onProgress, onError) {
		this.initScene();

		const gltfLoader = new GLTFLoader();
		gltfLoader.setDRACOLoader(new DRACOLoader());
		gltfLoader.parse(glbData, '', gltf => {
			this._onLoaded(gltf);
			onDone();
		}, onError);
	}

	resizeDisplayGl() {
		this._recalcAspectRatio();
		this._updateCamera();
		if (this.renderer) {
			this.renderer.setSize(this.canvas.offsetWidth / window.devicePixelRatio, this.canvas.offsetHeight / window.devicePixelRatio, false);
		}
	}

	animate() {
		if (this.renderer) {
			requestAnimationFrame(this.animate.bind(this));
			this.controls.update();
			this.render();
		}
	}

	render() {
		this.renderer.render(this.scene, this.camera);
	}


	onClicked(event) {
		event.preventDefault();

		const rect = this.renderer.domElement.getBoundingClientRect();

		this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
		this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

		const rayCaster = new Raycaster();
		rayCaster.setFromCamera(this.mouse, this.camera);
		const intersects = rayCaster.intersectObjects(this.meshes, true);

		if (intersects.length > 0) {
			console.log(intersects.map(i => i.object.name));
		}
	}

	toggleContent(groupName, clickEvent) {
		if (this.sceneGroups[groupName]) {
			this.sceneGroups[groupName].visible = clickEvent.target.checked;
		}
	}

	_onLoaded(gltf) {

		const helpers = new Group();
		const playfield = gltf.scene.children.find(node => node.name === 'playfield');
		const lights = playfield ? playfield.children.find(c => c.name === 'lights') : null;
		for (const group of playfield.children) {
			this.sceneGroups[group.name] = group;
			this.sceneGroupsVisible[group.name] = true;
		}

		this.bulbLights = lights ? lights.children : [];
		this.bulbLightIntensities = this.bulbLights.map(bl => bl.intensity);

		// scale scene
		gltf.scene.scale.set(this.playfieldScale, this.playfieldScale, this.playfieldScale);

		// "fix" overlapping faces (https://stackoverflow.com/questions/11165345/three-js-webgl-transparent-planes-hiding-other-planes-behind-them/13741468#13741468)
		gltf.scene.traverse(object => {
			if (object.isPointLight) {
				helpers.add(new PointLightHelper(object, 10));
			}
			if (object.name === 'playfieldLights') {
				this.playfieldLights = {};
				for (const pfLight of object.children) {
					const m = pfLight.name.match(/l(\d+)/i);
					if (m) {
						const num = this._keyToIndex(parseInt(m[1], 10));
						if (!this.playfieldLights[num]) {
							this.playfieldLights[num] = [ pfLight ];
						} else {
							this.playfieldLights[num].push(pfLight);
						}
					}
				}
			}
			if (!object.isMesh) {
				return;
			}
			if (object.material) {
				if (object.material.map && object.material.map.format === RGBAFormat) {
					object.material.alphaTest = 0.1;
				}
			}
		});

		if (this.gltfScene) {
			this.scene.remove(this.gltfScene);
		}
		if (this.gltfHelpers) {
			this.scene.remove(this.gltfHelpers);
		}

		this.gltfScene = gltf.scene;
		this.scene.add(gltf.scene);
		if (this.addHelpers) {
			this.gltfHelpers = helpers;
			this.scene.add(helpers);
		}

		this.resizeDisplayGl();
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
		const ambientLight = new AmbientLight(0xffffff, 0.1);
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

	_clearScene() {
		this.scene.traverse(object => {
			if (!object.isMesh) {
				return;
			}
			object.geometry.dispose();

			if (object.material.isMaterial) {
				this._destroyMaterial(object.material);
			} else {
				// an array of materials
				for (const material of object.material) {
					this._destroyMaterial(material);
				}
			}
			this.scene.remove(object);
		});
	}

	destroyScene() {
		this._clearScene();
		this.renderer.dispose();
		this.renderer = null;
		this.scene = null;
	}

	_destroyMaterial(material) {
		material.dispose();

		// dispose textures
		for (const key of Object.keys(material)) {
			const value = material[key];
			if (value && typeof value === 'object' && 'minFilter' in value) {
				value.dispose();
			}
		}
	}

	isWebGLAvailable() {
		try {
			const canvas = document.createElement('canvas');
			return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
		} catch (e) {
			return false;
		}
	}

	getErrorMessage(version) {
		const names = {
			1: 'WebGL',
			2: 'WebGL 2'
		};
		const contexts = {
			1: window.WebGLRenderingContext,
			2: window.WebGL2RenderingContext
		};
		let message = 'Your $0 does not seem to support $1.';

		if (contexts[version]) {
			message = message.replace('$0', 'graphics card');
		} else {
			message = message.replace('$0', 'browser');
		}
		return message.replace('$1', names[version]);
	}

	initEmu(gameEntry, romUrl) {
		return this._initialiseEmu(gameEntry, romUrl)
			.then(() => {
				this._resumeEmu();
				return initialiseActions(gameEntry.initialise, this.wpcSystem);
			})
			.catch((error) => {
				console.error('FAILED to load ROM:', error.message);
			});
	}

	_initialiseEmu(gameEntry, romUrl) {
		return this._downloadFileFromUrlAsUInt8Array(romUrl)
			.then((u06Rom) => {
				console.log('Successfully loaded ROM', u06Rom.length);
				const romData = {
					u06: u06Rom,
				};
				return initialiseEmulator(romData, gameEntry);
			})
			.then(_wpcSystem => {
				console.log('Successfully initialized emulator');

				this.wpcSystem = _wpcSystem;
				this.wpcSystem.start();
				console.log('Successfully started EMU v' + this.wpcSystem.version());
			});
	}

	_downloadFileFromUrlAsUInt8Array(romUrl) {
		return fetch(romUrl)
			.then(response => {
				if (response.status < 400) {
					return response.arrayBuffer();

				} else {
					throw new Error('Error downloading ROM: ' + response.status);
				}
			})
			.then(arrayBuffer => new Uint8Array(arrayBuffer));
	}

	//called at 60hz -> 16.6ms
	_emuStep() {
		if (!this.wpcSystem) {
			return;
		}
		this.wpcSystem.executeCycle(TICKS_PER_CALL, TICKS_PER_STEP);
		const emuState = this.wpcSystem.getUiState();
		if (this.playfieldLights && emuState.asic.wpc.lampState) {
			const lampState = emuState.asic.wpc.lampState;
			for (let i = 0; i < lampState.length; i++) {
				if (this.playfieldLights[i]) {
					for (const playfieldLight of this.playfieldLights[i]) {
						playfieldLight.material.emissive.set(0xffffff);
						playfieldLight.material.emissiveIntensity = lampState[i] / 10;
					}
				}
			}
		}
		this.intervalId = requestAnimationFrame(this._emuStep.bind(this));
	}

	_resumeEmu() {
		if (this.intervalId) {
			this._pauseEmu();
		}
		console.log('client start emu');
		this.intervalId = requestAnimationFrame(this._emuStep.bind(this));
	}

	_pauseEmu() {
		console.log('stop emu');
		if (!this.intervalId) {
			// allows step by step
			this._emuStep();
		}
		cancelAnimationFrame(this.intervalId);
		this.intervalId = false;
	}

	/**
	 * Converts a key to row/column. For example 11 (row 1, column 1) maps to 0
	 *
	 * @param keyValue Key value, from 11..88
	 */
	_keyToIndex(keyValue) {
		const row = Math.floor(keyValue / 10) - 1;
		const column = Math.floor(keyValue % 10) - 1;
		return  8 * row  + column;
	}
}

function initialiseEmulator(romData, gameEntry) {
	const fileName = gameEntry.rom.u06;
	const romObject = {
		fileName,
		skipWpcRomCheck: gameEntry.skipWpcRomCheck,
		features: gameEntry.features,
	};
	return WpcEmu.initVMwithRom(romData, romObject);
}
