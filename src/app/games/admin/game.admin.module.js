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
import angular from 'angular';
import uiProgressbar from 'angular-ui-bootstrap/src/progressbar';
import GameAddAdminComponent from './add/game.add.admin.component';
import GameEditAdminComponent from './edit/game.edit.admin.component';
import FileUploadModule from '../../shared/file-upload/file.upload.module';
import EditorModule from '../../shared/editor/editor.module';
import GameAddOriginalComponent from './add/game.add.original.component';

const GAMES_ADMIN_MODULE = angular
	.module('vpdb.games.admin', [ uiProgressbar, FileUploadModule.name, EditorModule.name ])
	.component('gameAddOriginalComponent', new GameAddOriginalComponent())
	.component('gameAddAdminComponent', new GameAddAdminComponent())
	.component('gameEditAdminComponent', new GameEditAdminComponent());

export { GAMES_ADMIN_MODULE };
