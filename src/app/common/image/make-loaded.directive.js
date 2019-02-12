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

/**
 * @param $timeout
 * @param $parse
 * @ngInject
 */
export default function makeLoaded($timeout, $parse) {
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
				Object.keys(filter).forEach(className => {
					const enabled = filter[className];
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
				Object.keys(filter).forEach(className => {
					element.removeClass(className);
					if (postVar) {
						postVar.assign(scope, false);
					}
				});
			});
		}
	};
}
