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
	BoxGeometry,
	Color, DoubleSide,
	Group,
	ImageLoader,
	Mesh,
	MeshStandardMaterial,
	PointLight,
	Texture,
	TextureLoader
} from 'three';
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader';

const loadTextures = true;
const loadMaterials = true;
const loadLights = true;

export class VptLoader {

	constructor(vpTable, scale) {
		this.vpTable = vpTable;
		this.scale = scale;
		this.playfield = new Group();
		this.playfield.receiveShadow = true;
		this.playfield.castShadow = true;

		this.imageLoader = new ImageLoader();
		this.textureLoader = new TextureLoader();
		this.objLoader = new OBJLoader();

		this._loadFloor();
		//this._loadPrimitives();
		this._loadRubbers();
		this._loadLights();
	}

	getPlayfield() {
		return this.playfield;
	}

	_loadPrimitives() {
		const primitives = this.vpTable.primitives;
		for (const primitive of primitives) {
			this._loadPrimitive(primitive);
		}
	}

	_loadRubbers() {
		for (const rubber of this.vpTable.rubbers.filter(r => r.name === 'LSling1')) {
			this._loadRubber(rubber);
		}
	}

	_loadPrimitive(primitive) {
		const material = this._getMaterial(primitive);
		const texture = this._getTexture(primitive);

		this.objLoader.load(primitive.mesh, group => {

			/** @var { Geometry } */
			const geometry = group.children[0].geometry;
			const mesh = new Mesh(geometry, material);

			mesh.name = primitive.name;
			// mesh.castShadow = true;
			// mesh.receiveShadow = true;

			if (loadTextures && texture) {
				mesh.traverse(child => {
					if (child instanceof Mesh) {
						child.material.transparent = true;
						child.material.map = texture;
					}
				});
			}

			this._positionPrimitive(mesh, primitive);
			this.playfield.add(mesh);
			//this.meshes.push(mesh);

		}, xhr => {
			if (xhr.lengthComputable) {
				//var percentComplete = xhr.loaded / xhr.total * 100;
				//console.log('model ' + Math.round(percentComplete, 2) + '% downloaded');
			}
		}, err => {
			console.error(err);
		});
	}

	_loadRubber(rubber) {
		const material = this._getMaterial(rubber);

		this.objLoader.load(rubber.mesh, group => {

			/** @var { Geometry } */
			const geometry = group.children[0].geometry;
			const mesh = new Mesh(geometry, material);

			mesh.name = 'Rubber-' + rubber.name;
			this.playfield.add(mesh);

		}, xhr => {
			if (xhr.lengthComputable) {
				//var percentComplete = xhr.loaded / xhr.total * 100;
				//console.log('model ' + Math.round(percentComplete, 2) + '% downloaded');
			}
		}, err => {
			console.error(err);
		});
	}

	_loadLights() {
		if (!loadLights) {
			return;
		}
		for (const lightInfo of this.vpTable.lights.filter(l => l.mesh)) {

			console.log('Adding light %s...', lightInfo.name);

			// this.objLoader.load(lightInfo.mesh, group => {
			//
			// 	const geometry = group.children[0].geometry;
			// 	let mesh = new Mesh(geometry, new MeshStandardMaterial());
			// 	mesh.position.set(lightInfo.center.x, lightInfo.center.y, 0);
			// 	mesh.scale.set(lightInfo.meshRadius, lightInfo.meshRadius, lightInfo.meshRadius);
			// 	this.playfield.add(mesh);
			// });
			const light = new PointLight(lightInfo.color, lightInfo.intensity, lightInfo.falloff * this.scale);
			light.castShadow = false;
			light.position.set(lightInfo.center.x, lightInfo.center.y, -10);
			this.playfield.add(light);
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

	_getMaterial(primitive) {

		const material = new MeshStandardMaterial();
		if (!loadMaterials || !primitive.material) {
			return material;
		}
		const materialInfo = this.vpTable.materials[primitive.material];
		if (!materialInfo) {
			console.warn('Primitive "%s" has unknown material "%s".', primitive.name, primitive.material);
			return material;
		}

		material.color = new Color(materialInfo.base_color);
		material.roughness = 1 - materialInfo.roughness;
		material.metalness = materialInfo.is_metal ? 0.7 : 0.0;
		material.emissive = new Color(materialInfo.glossy_color);
		material.emissiveIntensity = 0.1;

		if (materialInfo.is_opacity_enabled) {
			material.transparent = true;
			material.opacity = materialInfo.opacity;
		}

		if (primitive.normalMap) {
			const normalMap = this.vpTable.textures[primitive.normalMap];
			if (normalMap) {
				this.textureLoader.load(normalMap.url, map => {
					map.anisotropy = 16;
					material.normalMap = map;
				});
			} else {
				console.warn('Unknown normal map "%s" for primitive "%s".', primitive.normalMap, primitive.name);
			}
		}

		if (primitive.material) {
			material.side = DoubleSide;
		}
		return material;
	}

	_positionPrimitive(mesh, primitive) {
		mesh.scale.set(primitive.size.x, primitive.size.y, primitive.size.z);
		mesh.translateX(primitive.trans.x + primitive.pos.x);
		mesh.translateY(primitive.trans.y + primitive.pos.y);
		mesh.translateZ(-primitive.trans.z - primitive.pos.z);

		mesh.rotateY(this._toRadian(-primitive.obj_rot.x));
		mesh.rotateX(this._toRadian(primitive.obj_rot.y));
		mesh.rotateZ(this._toRadian(primitive.obj_rot.z));

		mesh.rotateX(this._toRadian(-primitive.rot.x));
		mesh.rotateY(this._toRadian(-primitive.rot.y));
		mesh.rotateZ(this._toRadian(primitive.rot.z));
	}

	_loadFloor() {
		const width = this.vpTable.game_data.size.width;
		const height = this.vpTable.game_data.size.height;
		const floorGeometry = new BoxGeometry(width, height, 10);
		const floorMaterial = this._getMaterial(this.vpTable.game_data);
		const floorTexture = this._getTexture(this.vpTable.game_data);
		const floor = new Mesh(floorGeometry, floorMaterial);

		if (loadTextures && floorTexture) {
			floor.traverse(child => {
				if (child instanceof Mesh) {
					child.material.transparent = false;
					child.material.map = floorTexture;
				}
			});
		}
		floor.translateX(width / 2);
		floor.translateY(height / 2);
		floor.translateZ(5);
		floor.rotateZ(Math.PI);
		this.playfield.add(floor);
	}

	_toRadian(deg) {
		return deg * Math.PI / 180;
	}
}
