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
import uiProgressbar from 'angular-ui-bootstrap/src/progressbar';
import uiCollapse from 'angular-ui-bootstrap/src/collapse';
import uiTooltip from 'angular-ui-bootstrap/src/tooltip';
import uiAccordion from 'angular-ui-bootstrap/src/accordion';
//import 'magnific-popup';

import FileUploadModule from '../shared/file-upload/file.upload.module';
import MarkdownModule from '../shared/markdown/markdown.module';
import RatingModule from '../shared/rating/rating.module';
import BackglassModule from '../backglasses/backglass.module';
import BackglassAdminModule from '../backglasses/admin/backglass.admin.module';

import GameListComponent from './list/game.list.component';
import GameDetailsComponent from './details/game.details.component';
import GameReleaseDetailsCtrl from './details/game.release.details.ctrl';
import MediumInfoModalCtrl from './details/medium.info.modal.ctrl';
import topBadge from './details/top-badge.directive';

const GAMES_MODULE = angular
	.module('vpdb.games', [
		uiProgressbar,
		uiCollapse,
		uiTooltip,
		uiAccordion,
		FileUploadModule.name,
		BackglassModule.name,
		BackglassAdminModule.name,
		MarkdownModule.name,
		RatingModule.name
	])
	.component('gameListComponent', new GameListComponent())
	.component('gameDetailsComponent', new GameDetailsComponent())
	.controller('GameReleaseDetailsCtrl', GameReleaseDetailsCtrl)
	.controller('MediumInfoModalCtrl', MediumInfoModalCtrl)
	.directive('topBadge', topBadge);

export { GAMES_MODULE };
