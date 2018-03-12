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
//import GameDetailsCtrl from './game.details.ctrl';
//import GameListCtrl from './game.list.ctrl';
import GameReleaseDetailsCtrl from './game.release.details.ctrl';
import GameRequestModalCtrl from './game.request.modal.ctrl';
import GameSelectModalCtrl from './game.select.modal.ctrl';
//import GameAddAdminCtrl from './admin/add/game.add.admin.ctrl';
//import GameEditAdminCtrl from './admin/edit/game.edit.admin.ctrl';
import GameSystems from './game.systems.constant';
import { gameTypeFilter, ratingFormatFilter } from './game.filters';

export default angular
	.module('vpdb.games', [])
//	.controller('GameDetailsCtrl', GameDetailsCtrl)
//	.controller('GameListCtrl', GameListCtrl)
	.controller('GameReleaseDetailsCtrl', GameReleaseDetailsCtrl)
	.controller('GameRequestModalCtrl', GameRequestModalCtrl)
	.controller('GameSelectModalCtrl', GameSelectModalCtrl)
//	.controller('GameAddAdminCtrl', GameAddAdminCtrl)
//	.controller('GameEditAdminCtrl', GameEditAdminCtrl)
	.filter('gametype', gameTypeFilter)
	.filter('ratingFormat', ratingFormatFilter)
	.constant('GameSystems', GameSystems)
	.name;
