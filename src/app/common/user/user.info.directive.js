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

import UserInfoModalTpl from './user.info.modal.pug';

/**
 * Users linked in markdown will get highlighted with this.
 *
 * @param $compile
 * @param $uibModal
 * @param $rootScope
 * @param {AuthService} AuthService
 * @ngInject
 */
export default function userDetails($compile, $uibModal, $rootScope, AuthService) {
	return {
		restrict: 'E',
		link: function(scope, element) {
			$rootScope.$on('user', function() {
				if (AuthService.hasPermission('users/view')) {
					element.addClass('a');
				} else {
					element.removeClass('a');
				}
			});
			if (AuthService.hasPermission('users/view')) {
				element.addClass('a');
			}
			element.click(function() {
				if (AuthService.hasPermission('users/view')) {
					$uibModal.open({
						templateUrl: UserInfoModalTpl,
						controller: 'UserInfoModalCtrl',
						controllerAs: 'vm',
						resolve: {
							username: function() {
								return element.html();
							}
						}
					});
				}
			});
		}
	};
}