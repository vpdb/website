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
 * @param $timeout
 * @ngInject
 */
export default function heightAnimation($timeout) {
	return {
		enter: function(element, done) {

			// execute at the end of the stack so angular can finish rendering and we have the correct height
			$timeout(function() {
				const wrapper = element.parents('.ui-view-wrapper');
				const height = element.get(0).offsetHeight + 10;
				wrapper.css('height', height + 'px');
			});

			$timeout(function() {
				const wrapper = element.parents('.ui-view-wrapper').css('height', '');
				done();
			}, 300); // must be the same as the end of the css transformation
		},

		leave: function(element, done) {
			const wrapper = element.parents('.ui-view-wrapper');
			const height = element.get(0).offsetHeight + 10;
			wrapper.css('height', height + 'px');
			done();
		},
		move: function(element, done) { done(); },
		beforeAddClass : function(element, className, done) { done(); },
		addClass : function(element, className, done) { done(); },
		beforeRemoveClass : function(element, className, done) { done(); },
		removeClass : function(element, className, done) { done(); },
		allowCancel : function(element, event, className) {}
	};
}