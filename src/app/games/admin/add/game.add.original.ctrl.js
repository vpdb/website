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

import GameAddCtrl from './game.add.ctrl';

export default class GameAddOriginalCtrl extends GameAddCtrl {

	/**
	 * @param $scope
	 * @param $window
	 * @param $localStorage
	 * @param $state
	 * @param {App} App
	 * @param {ApiHelper} ApiHelper
	 * @param {AuthService} AuthService
	 * @param {ModalService} ModalService
	 * @param {TrackerService} TrackerService
	 * @param GameResource
	 * @param FileResource
	 * @ngInject
	 */
	constructor($scope, $window, $localStorage, $state,
				App, ApiHelper, AuthService, ModalService, TrackerService,
				GameResource, FileResource) {

		super($scope, $window, $localStorage, $state, App, ApiHelper, AuthService, ModalService, TrackerService, GameResource, FileResource);

		App.setTitle('Add Original Game');
	}
}
