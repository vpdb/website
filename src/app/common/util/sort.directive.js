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

// import $ from 'jquery';

/**
 * Updates the given model with the selected value.
 *
 * The example shows Two values `title` and `popularity` bound to the
 * `vm.query.sort` model. When clicked, the value direction is `asc`
 * for `title` and `desc` for `popularity.
 *
 * @example
 * <li> <a sort="title" sort-default="asc" ng-model="vm.query.sort">Title</a></li>
 * <li> <a sort="popularity" sort-default="desc" ng-model="vm.query.sort">Popularity</a></li>
 * @ngInject
 */
export default function sort() {
	return {
		restrict: 'A',
		scope: { sortModel: '=ngModel' },
		link: function(scope, element, attrs) {
			const currentSort = scope.sortModel[0] === '-' ? scope.sortModel.substr(1) : scope.sortModel;
			// element = $(element);
			if (currentSort === attrs.sort) {
				element.addClass('selected');
			}
			if (scope.sortModel[0] === '-') {
				element.removeClass('asc');
				element.addClass('desc');
			} else {
				element.addClass('asc');
				element.removeClass('desc');
			}
			element.on('click', () => {
				if (element.hasClass('selected')) {
					element.toggleClass('asc');
					element.toggleClass('desc');
				} else {
					element.siblings().removeClass('selected');
					element.addClass('selected');
					element.addClass('asc');
					if (attrs.sortDefault === 'asc') {
						element.addClass('asc');
						element.removeClass('desc');
					} else {
						element.removeClass('asc');
						element.addClass('desc');
					}
				}
				scope.sortModel = (element.hasClass('asc') ? '' : '-') + attrs.sort;
				scope.$apply();
			});
		}
	};
}
