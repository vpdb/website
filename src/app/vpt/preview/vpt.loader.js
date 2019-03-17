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

import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader';
import {PointLight} from 'three/src/lights/PointLight';
import {ImageLoader} from 'three/src/loaders/ImageLoader';
import {TextureLoader} from 'three/src/loaders/TextureLoader';
import {Mesh} from 'three/src/objects/Mesh';
import {Texture} from 'three/src/textures/Texture';
import {MeshStandardMaterial} from 'three/src/materials/MeshStandardMaterial';
import {Color} from 'three/src/math/Color';
import {BoxGeometry} from 'three/src/geometries/BoxGeometry';
import {Group} from 'three/src/objects/Group';

export class VptLoader {

	constructor(vpTable) {
		this.vpTable = vpTable;
		this.playfield = new Group();

		this.imageLoader = new ImageLoader();
		this.textureLoader = new TextureLoader();
		this.objLoader = new OBJLoader();

		this._loadFloor();
		this._loadPrimitives();
		this._loadLights();
	}

	getPlayfield() {
		return this.playfield;
	}

	_loadPrimitives() {
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
				mesh.castShadow = true;
				mesh.receiveShadow = true;

				if (texture) {
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
	}

	_loadLights() {
		for (const lightInfo of this.vpTable.lights/*.filter(l => l.name === 'Light12')*/) {

			// this.objLoader.load(lightInfo.mesh, group => {
			//
			// 	const geometry = group.children[0].geometry;
			// 	let mesh = new Mesh(geometry, new MeshStandardMaterial());
			// 	mesh.position.set(lightInfo.center.x, lightInfo.center.y, 0);
			// 	mesh.scale.set(lightInfo.meshRadius, lightInfo.meshRadius, lightInfo.meshRadius);
			// 	this.playfield.add(mesh);
			// });
			const light = new PointLight(lightInfo.color, lightInfo.intensity, lightInfo.falloff);
			light.castShadow = true;
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
		if (!primitive.material) {
			return material;
		}
		const materialInfo = this.vpTable.materials[primitive.material];
		if (!material) {
			console.warn('Primitive "%s" has unknown material "%s".', primitive.name, primitive.material);
			return material;
		}

		material.color = new Color(materialInfo.base_color);
		material.roughness = 1 - materialInfo.roughness;
		material.metalness = materialInfo.is_metal ? 0.7 : 0.0;
		// material.emissive = new Color(materialInfo.glossy_color);
		// material.emissiveIntensity = 0.5;

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
		return material;
	}

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

	_loadFloor() {
		const floorGeometry = new BoxGeometry(this.vpTable.game_data.size.width, this.vpTable.game_data.size.height, 10);
		const floorMaterial = this._getMaterial(this.vpTable.game_data);
		const floorTexture = this._getTexture(this.vpTable.game_data);
		const floor = new Mesh(floorGeometry, floorMaterial);

		if (floorTexture) {
			floor.traverse(child => {
				if (child instanceof Mesh) {
					child.material.transparent = false;
					child.material.map = floorTexture;
				}
			});
		}
		floor.translateX(this.vpTable.game_data.size.width / 2);
		floor.translateY(this.vpTable.game_data.size.height / 2);
		floor.translateZ(5);
		floor.rotateZ(Math.PI);
		this.playfield.add(floor);
	}

	_toRadian(deg) {
		return deg * Math.PI / 180;
	}
}
