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
	GridHelper, Group,
	Mesh,
	PerspectiveCamera,
	Raycaster,
	Scene,
	Vector2,
	Vector3,
	WebGLRenderer
} from 'three';
import {TrackballControls} from 'three/examples/jsm/controls/TrackballControls';
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader';

export class VptPreviewScene {

	constructor(canvasElement) {
		this.highlight = 'Rails';
		this.renderer = null;
		this.canvas = canvasElement;
		this.aspectRatio = 1;
		this._recalcAspectRatio();

		this.scene = null;
		this.cameraDefaults = {
			posCamera: new Vector3(0.0, 500.0, 700.0),
			posCameraTarget: new Vector3(0, 0, 0),
			near: 0.1,
			far: 100000,
			fov: 45,
		};
		/** @var Camera */
		this.camera = null;
		this.playfield = new Group();
		this.body = new Group();
		this.table = new Group();
		this.cameraTarget = this.cameraDefaults.posCameraTarget;

		this.mouse = new Vector2();
		this.primitives = [];
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

		this.table.add(this.playfield);
		this.table.add(this.body);
		this.scene.add(this.table);
	}

	initContent(vpTable) {

		this.table.rotateX(this._toRadian(90));
		this.table.translateX(-250);
		this.table.translateY(-500);
		this.table.translateZ(-200);
		this.table.scale.set(0.5, 0.5, 0.5);
		this.playfield.rotateX(this._toRadian(6.5));

		const loader = new OBJLoader();
		for (const primitive of vpTable.primitives) {
			loader.load(primitive.mesh, obj => {

				/** @var { Object3D } */
				const loadedMesh = obj;
				loadedMesh.name = primitive.name;


				//sMatrix.scale(1.0f, 1.0f, m_ptable->m_BG_scalez[m_ptable->m_BG_current_set]);
				//matrix = matrix.multiply(sMatrix);

				if (primitive.name === this.highlight) {
					loadedMesh.traverse(child => {
						if (child instanceof Mesh) {
							child.material.color.setHex(0xff0000);
						}
					});
				} else {
					loadedMesh.traverse(child => {
						if (child instanceof Mesh) {
							child.material.transparent = true;
							child.material.opacity = 0.5;
						}
					});
				}

				this._update(loadedMesh, primitive);
				if (primitive.name !== 'Rails') {
					this.playfield.add(loadedMesh);
				} else {
					this.body.add(loadedMesh);
				}
				this.primitives.push(loadedMesh);


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

	/**
	 *
	 * @param {Object3D} loadedMesh
	 * @param primitive
	 * @private
	 */
	_update(loadedMesh, primitive) {
		loadedMesh.scale.set(primitive.size.x, primitive.size.y, primitive.size.z);
		loadedMesh.translateX(primitive.trans.x + primitive.pos.x);
		loadedMesh.translateY(primitive.trans.y + primitive.pos.y);
		loadedMesh.translateZ(primitive.trans.z + primitive.pos.z);
		loadedMesh.rotateZ(this._toRadian(primitive.rot.z));
		loadedMesh.rotateX(this._toRadian(primitive.rot.x));
		loadedMesh.rotateY(this._toRadian(primitive.rot.y));
		loadedMesh.rotateY(this._toRadian(primitive.obj_rot.z));
		loadedMesh.rotateZ(this._toRadian(primitive.obj_rot.y));
		loadedMesh.rotateX(this._toRadian(primitive.obj_rot.x));

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
		const intersects = raycaster.intersectObjects(this.primitives, true);

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
