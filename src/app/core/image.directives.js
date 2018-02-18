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

import $ from 'jquery';
import { forEach, isObject } from 'lodash';

/**
 * @param $timeout
 * @param $parse
 * @ngInject
 */
export function makeLoaded($timeout, $parse) {
	return {
		scope: true,
		restrict: 'A',
		link: function(scope, element, attrs) {
			let postVar;
			let filter = {};
			scope.$watch(attrs.makeLoaded, function() {
				filter = scope.$eval(attrs.makeLoaded);
			}, true);

			if (attrs.makeLoadedPost) {
				postVar = $parse(attrs.makeLoadedPost);
				postVar.assign(scope, false);
			}
			const eventPrefix = attrs.makeLoadedEvent || 'image';
			scope.$on(eventPrefix + 'Loaded', function(event) {
				event.stopPropagation();
				forEach(filter, function(enabled, className) {
					if (!enabled) {
						return;
					}
					element.addClass(className);
					if (postVar) {
						$timeout(function() {
							postVar.assign(scope, true);
						}, 350);
					}
				});
			});
			scope.$on(eventPrefix + 'Unloaded', function(event) {
				event.stopPropagation();
				forEach(filter, function(enabled, className) {
					element.removeClass(className);
					if (postVar) {
						postVar.assign(scope, false);
					}
				});

			});
		}
	};
}

/**
 * Sets the image background of an element.
 *
 * Image fades in when loaded and auth token is previously retrieved
 * if protected.
 *
 * Value of the attribute is reference to an image object { url:string, is_protected:bool } or
 * just an URL string.
 *
 * @param $parse
 * @param {AuthService} AuthService
 * @ngInject
 */
export function imgBg($parse, AuthService) {
	return {
		scope: true,
		restrict: 'A',
		link: function(scope, element, attrs) {

			scope.img = { url: false, loading: false };

			const setImgUrl = function(url) {
				scope.img = { url: url, loading: true };
				// eslint-disable-next-line
				element.css('background-image', "url('" + url + "')");
				$(element).waitForImages(
					$.noop,
					function(loaded, count, success) {
						scope.img.loading = false;
						if (success) {
							const that = $(this);
							that.addClass('loaded');
							scope.$emit('imageLoaded');
						} else {
							delete scope.img.url;
							console.warn('Could not load image "%s".', url);
							if (attrs.error) {
								$parse(attrs.error)(scope);
							}
						}
						scope.$apply();
					},
					true
				);
			};

			const setImg = function(value) {
				const url = isObject(value) ? value.url : value;
				let isProtected = isObject(value) ? value.is_protected : false;

				// check for empty
				if (url === false) {
					scope.img = { url: false, loading: false };
					element.css('background-image', 'none');
					//element.removeClass('loaded');
					scope.$emit('imageUnloaded');

				} else {
					if (!isProtected) {
						setImgUrl(url);
					} else {
						console.debug('img-bg: adding url %s to be collected', url);
						AuthService.addUrlToken(url, setImgUrl);
					}
				}
			};

			// check for constant
			if (attrs.imgBg[0] === '/') {
				setImg(attrs.imgBg);

			// otherwise, watch scope for expression.
			} else {
				let value = $parse(attrs.imgBg);
				scope.$watch(value, function() {
					const v = value(scope);
					if (v || v === false) {
						setImg(v);
					}
				});
			}
		}
	};
}

/**
 * @ngInject
 */
export function imgSrc() {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			attrs.$observe('imgSrc', value => {
				element.attr('src', value);
				$(element).waitForImages(function() {
					$(this).addClass('loaded');
				}, function() {
					console.error('wait has failed.');
				});
			});
		}
	};
}
