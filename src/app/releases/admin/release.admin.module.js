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
import 'jquery-ui/ui/core';
import 'jquery-ui/ui/widget';
import 'jquery-ui/ui/widgets/mouse';
import 'jquery-ui/ui/widgets/droppable';
import 'angular-dragdrop';

import ngFileUpload from 'ng-file-upload';

import RELEASE_META from './release.meta';
import ReleaseAddComponent from './add/release.add.component';
import ReleaseAddVersionComponent from './add/release.add.version.component';
import ReleaseEditVersionModalCtrl from './edit/release.edit.version.modal.ctrl';
import ReleaseSelectPlayfieldModalCtrl from './add/release.select.playfield.modal.ctrl';
import allowedFlavors from './add/release.allowed.flavors.filter';

const RELEASES_ADMIN_MODULE = angular
	.module('vpdb.releases.admin', [
		ngFileUpload,
		'ngDragDrop',
	])
	.component('releaseAddComponent', new ReleaseAddComponent())
	.component('releaseAddVersionComponent', new ReleaseAddVersionComponent())
	.controller('ReleaseEditVersionModalCtrl', ReleaseEditVersionModalCtrl)
	.controller('ReleaseSelectPlayfieldModalCtrl', ReleaseSelectPlayfieldModalCtrl)
	.filter('allowedFlavors', allowedFlavors)
	.constant('ReleaseMeta', RELEASE_META);

export { RELEASES_ADMIN_MODULE };
