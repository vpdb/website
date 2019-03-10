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
	DirectionalLight, GridHelper,
	Group,
	ImageLoader,
	Mesh, MeshPhongMaterial,
	MeshStandardMaterial,
	PerspectiveCamera,
	Raycaster,
	Scene,
	Texture,
	Vector2,
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
			posCamera: new Vector3(0.0, 600.0, 900.0),
			posCameraTarget: new Vector3(0, 0, 0),
			near: 0.1,
			far: 100000,
			fov: 45,
		};
		/** @var Camera */
		this.camera = null;

		this.playfield = new Group();
		this.cameraTarget = this.cameraDefaults.posCameraTarget;

		this.mouse = new Vector2();
		this.meshes = [];
		this.vpTable = null;
	}

	initGl() {

		this.renderer = new WebGLRenderer({
			antialias: true,
			autoClear: true,
			alpha: true,
		});
		this.scene = new Scene();
		//this.camera = new OrthographicCamera(window.innerWidth / -1.5, window.innerWidth / 1.5, window.innerHeight / 1.5, window.innerHeight / -1.5, 1, 1000);
		this.camera = new PerspectiveCamera(this.cameraDefaults.fov, this.aspectRatio, this.cameraDefaults.near, this.cameraDefaults.far);
		this._initLights();
		this._resetCamera();
		this.canvas.appendChild(this.renderer.domElement);

		this.renderer.domElement.addEventListener('mousedown', this.onClicked.bind(this), false);
		this.controls = new TrackballControls(this.camera);

		// the playfield group
		this.playfield.rotateX(this._toRadian(90));
		this.playfield.translateX(-250);
		this.playfield.translateY(-500);
		this.playfield.scale.set(0.5, 0.5, 0.5);
		this.scene.add(this.playfield);

		this.imageLoader = new ImageLoader();
		this.objLoader = new OBJLoader();
	}

	initContent(vpTable) {

		this.vpTable = vpTable;
		window.vpt = vpTable;

		const primitives = this.vpTable.primitives; //.filter(p => p.name === 'Joker');
		for (const primitive of primitives) {

			const material = this._getMaterial(primitive);
			const texture = this._getTexture(primitive);

			this.objLoader.load(primitive.mesh, group => {

				/** @var { Object3D } */
				const geometry = group.children[0].geometry;
				//geometry.center();

				//const mesh = group;
				//const mesh = group.children[0];
				let mesh = new Mesh(geometry, material);

				mesh.name = primitive.name;

				// if (texture) {
				// 	mesh.traverse(function(child) {
				// 		if (child instanceof Mesh) {
				// 			if (texture) {
				// 				child.material.transparent = true;
				// 				child.material.map = texture;
				// 			}
				// 		}
				// 	});
				// }

				this._positionPrimitive(mesh, primitive);
				this.playfield.add(mesh);
				this.meshes.push(mesh);

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

	_getTexture(primitive) {
		if (primitive.textureMap) {
			const texture = new Texture();
			const textureInfo = this.vpTable.textures[primitive.textureMap];
			if (textureInfo && textureInfo.url) {
				this.imageLoader.load(textureInfo.url, image => {
					texture.image = image;
					texture.needsUpdate = true;
				});
				return texture;
			}
		}
	}

	/**
	 * @returns {Material}
	 * @private
	 */
	_getMaterial(primitive) {

		//const params = {};
		// if (primitive.normalMap) {
		// 	params.normalMap = this.imageLoader.load(primitive.normalMap);
		// 	console.warn('Adding normal map to ', primitive);
		// }

		// if (primitive.material.toLowerCase().includes('metal')) {
		// 	return new MeshStandardMaterial(Object.assign(params, {
		//
		// 		color: this._getColor(primitive),
		//
		// 		roughness: 0.35,
		// 		metalness: 1,
		//
		// 		// roughnessMap: roughnessMap,
		// 		// metalnessMap: metalnessMap,
		// 		//
		// 		// envMap: envMap, // important -- especially for metals!
		// 		// envMapIntensity: envMapIntensity
		//
		// 	}));
		// }
		return new MeshPhongMaterial();
		// return new MeshStandardMaterial({
		// });
	}

	_getColor(primitive) {
		switch (primitive.name) {
			case 'Primitive8': return 0xff0000;
			case 'Primitive6': return 0x00ff00;
			case 'Primitive48': return 0x0000ff;
			case 'Primitive20': return 0xff00ff;
			case 'Primitive14': return 0x00ffff;
			default: return 0xffffff;
		}
	}

	/**
	 *
	 * @param {Object3D} mesh
	 * @param primitive
	 * @private
	 */
	_positionPrimitive(mesh, primitive) {
		mesh.scale.set(primitive.size.x, primitive.size.y, primitive.size.z);
		mesh.translateX(primitive.trans.x + primitive.pos.x);
		mesh.translateY(primitive.trans.y + primitive.pos.y);
		mesh.translateZ(-primitive.trans.z - primitive.pos.z);

		mesh.rotateX(this._toRadian(-primitive.rot.x));
		mesh.rotateY(this._toRadian(-primitive.rot.y));
		mesh.rotateZ(this._toRadian(primitive.rot.z));

		mesh.rotateZ(this._toRadian(-primitive.obj_rot.x));
		mesh.rotateX(this._toRadian(primitive.obj_rot.y));
		mesh.rotateY(this._toRadian(-primitive.obj_rot.z));
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
		//this.camera.setRotationFromEuler(new Euler(0, 0, this._toRadian(90), 'YXZ'));
		this.camera.lookAt(this.cameraTarget);
		this.camera.updateProjectionMatrix();
	}

	_toRadian(deg) {
		return deg * Math.PI / 180;
	}

	_initLights() {
		const ambientLight = new AmbientLight(0x404040);
		const directionalLight1 = new DirectionalLight(0xC0C090);
		const directionalLight2 = new DirectionalLight(0xC0C090);

		directionalLight1.position.set(-100, -50, 100);
		directionalLight2.position.set(100, 50, -100);

		this.scene.add(directionalLight1);
		this.scene.add(directionalLight2);
		this.scene.add(ambientLight);

		const helper = new GridHelper(1200, 60, 0xec843d, 0x404040);
		this.scene.add(helper);
	}
}
