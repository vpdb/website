/*
 * VPDB - Virtual Pinball Database
 * Copyright (C) 2018 freezy <freezy@vpdb.io>
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

import angular from 'angular';
import { isObject } from 'lodash';
import imagesLoaded from 'imagesloaded';

/**
 * Sets the image background of an element.
 *
 * Image fades in when loaded and auth token is previously retrieved
 * if protected.
 *
 * Value of the attribute is reference to an image object { url:string, is_protected:bool } or
 * just an URL string.
 */
class BackgroundImageDirective {

	/**
	 * @param $parse
	 * @param {AuthService} AuthService
	 * @param {NetworkService} NetworkService
	 */
	constructor($parse, $log, AuthService, NetworkService) {
		this.scope = true;
		this.restrict = 'A';

		this.$parse = $parse;
		this.$log = $log;
		this.AuthService = AuthService;
		this.NetworkService = NetworkService;
	}

	link(scope, element, attrs) {
		scope.img = { url: false, loading: false };

		// check for constant
		if (attrs.imgBg[0] === '/') {
			this._setImg(attrs.imgBg, scope, element, attrs);
		} else {
			// otherwise, watch scope for expression.
			let value = this.$parse(attrs.imgBg);
			scope.$watch(value, () => {
				const v = value(scope);
				if (v || v === false) {
					this._setImg(v, scope, element, attrs);
				}
			});
		}
	}

	_setImg(value, scope, element, attrs) {
		const url = isObject(value) ? value.url : value;
		let isProtected = isObject(value) ? value.is_protected : false;

		// check for empty
		if (url === false) {
			scope.img = { url: false, loading: false };
			element.css('background-image', 'none');
			scope.$emit('imageUnloaded');

		} else {
			if (!isProtected) {
				this._setImgUrl(url, scope, element, attrs);

			} else {
				this.$log.debug('img-bg: adding url %s to be collected', url);
				this.AuthService.addUrlToken(url, url => this._setImgUrl(url, scope, element, attrs));
			}
		}
	}

	_setImgUrl(url, scope, element, attrs) {
		// if supported, only load image when in view.
		if (typeof IntersectionObserver !== 'undefined') {
			const observer = new IntersectionObserver(changes => {
				changes.forEach(change => {
					if (change.intersectionRatio > 0) {
						this._loadImg(url, scope, element, attrs);
					}
				});
			});
			observer.observe(angular.element(element)[0]);
		} else {
			this._loadImg(url, scope, element, attrs);
		}
	}

	_loadImg(url, scope, element, attrs) {
		this.NetworkService.onRequestStarted(url);
		scope.img = { url: url, loading: true };
		element.css('background-image', `url("${url}")`);
		imagesLoaded(element, { background: true }, loaded => {
			this.NetworkService.onRequestFinished(url);
			scope.img.loading = false;
			if (!loaded.hasAnyBroken) {
				element.addClass('loaded');
				scope.$emit('imageLoaded');
			} else {
				delete scope.img.url;
				this.$log.debug('Could not load image "%s".', url);
				if (attrs.error) {
					this.$parse(attrs.error)(scope);
				}
			}
			scope.$apply();
		});
	}

	/**
	 * @param $parse
	 * @param AuthService
	 * @param NetworkService
	 * @return {BackgroundImageDirective}
	 */
	static directiveFactory($parse, AuthService, NetworkService) {
		BackgroundImageDirective.instance = new BackgroundImageDirective($parse, AuthService, NetworkService);
		return BackgroundImageDirective.instance;
	}
}
// need to manually inject this :/
BackgroundImageDirective.directiveFactory.$inject = ['$parse', 'AuthService', 'NetworkService'];

export { BackgroundImageDirective };

