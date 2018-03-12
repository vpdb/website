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
import GAME_SYSTEMS from './games/game.systems.constant';
import GameSelectModalCtrl from './games/game.select.modal.ctrl';
import GameRequestModalCtrl from './games/game.request.modal.ctrl';
import BootstrapPatcher from './utils/bootstrap.patcher';
import ReleaseService from './releases/release.service';
import gameTypeFilter from './games/game.type.filter';
import ratingFormatFilter from './games/rating.format.filter';

/**
 * These are global components that are or can be used on any page,
 * e.g. from the menu bar or within the markup.
 *
 * This module is a dependency of the main app as well as of most
 * other components.
 */
export default angular.module('vpdb.common', [])

	// utils
	.service('BootstrapPatcher', BootstrapPatcher)

	// games
	.controller('GameRequestModalCtrl', GameRequestModalCtrl)
	.controller('GameSelectModalCtrl', GameSelectModalCtrl)
	.filter('gametype', gameTypeFilter)
	.constant('GameSystems', GAME_SYSTEMS)

	// releases
	.service('ReleaseService', ReleaseService)

	// other
	.filter('ratingFormat', ratingFormatFilter);
