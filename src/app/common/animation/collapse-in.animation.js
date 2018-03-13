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

/**
 * Animates a new comment into the view.
 *
 * @todo fix, doesn't seem to work.
 * @param $timeout
 * @return {{enter: (function(*=, *)), beforeRemoveClass: (function(*, *, *)), removeClass: (function(*, *, *))}}
 * @ngInject
 */
export default function collapseInAnimation($timeout) {

	let height;

	// before (hide -> show): collapse-in-animation ng-hide
	// before (enter):        collapse-in-animation ng-animate ng-enter
	return {

		// classes: collapse-in-animation ng-animate ng-enter
		enter(element, done) {
			$timeout(function() {
				// save height for later
				height = element.get(0).offsetHeight;

				// outer: measure, then set height to 0 (not animated)
				element.css('height', '0px');

				// inner: move out of outer (not animated)
				element.find('> .collapse-in-animation-inner').css('transform', 'translateY(-' + height + 'px)');
			});
			done();

			// if there's a better way run code *after* ng-enter-active has been added, i'd love to hear about it.
			$timeout(function() {

				// outer: animate height to saved height
				element.css('height', height + 'px');

				// inner: animate to no transformation
				element.find('> .collapse-in-animation-inner').css('transform', '');

				// replace pixel height with auto (can't animate to auto)
				$timeout(function() {
					element.css('height', '');
				}, 350);

			}, 50);

			// then animation starts: collapse-in-animation ng-animate ng-enter ng-enter-active
		},

		// classes: collapse-in-animation ng-hide ng-animate ng-hide-animate ng-hide-remove
		beforeRemoveClass(element, className, done) {

			// save height for later
			height = element.get(0).offsetHeight;

			// outer: measure, then set height to 0 (not animated)
			element.css('height', '0px');

			// inner: move out of outer (not animated)
			element.find('> .collapse-in-animation-inner').css('transform', 'translateY(-' + height + 'px)');
			done();
		},

		// classes: collapse-in-animation         ng-animate ng-hide-animate ng-hide-remove ng-hide-remove-active
		removeClass(element, className, done) {

			// outer: animate height to saved height
			element.css('height', height + 'px');

			// inner: animate to no transformation
			element.find('> .collapse-in-animation-inner').css('transform', '');

			// replace pixel height with auto (can't animate to auto)
			$timeout(function() {
				element.css('height', '');
			}, 350);

			done();
		}
		// afterwards: collapse-in-animation
	};
}
