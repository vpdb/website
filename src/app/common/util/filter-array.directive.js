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

import { includes } from 'lodash';

/**
 * Toggles a value in an array.
 *
 * The example adds "dof" in the `vm.query.filterTags` array when the user
 * clicks on the div if it's not there or otherwise removes it.
 *
 * @example
 *  <div filter-array="dof" ng-model="vm.query.filterTags">DOF</div>
 * @ngInject
 */
export default function filterArray() {
	return {
		restrict: 'A',
		scope: { filterObjects: '=ngModel' },
		link: function(scope, element, attrs) {
			const objectId = attrs.filterArray;
			if (includes(scope.filterObjects, objectId)) {
				element.addClass('active');
			}
			element.click(function() {
				element.toggleClass('active');
				if (includes(scope.filterObjects, objectId)) {
					scope.filterObjects.splice(scope.filterObjects.indexOf(objectId), 1);
				} else {
					scope.filterObjects.push(objectId);
				}
				scope.$apply();
			});
		}
	};
}
