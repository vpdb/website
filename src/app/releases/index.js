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
import ReleaseAddCtrl from './release.add.ctrl';
import ReleaseAddVersionCtrl from './release.add.version.ctrl';
import ReleaseListCtrl from './release.list.ctrl';
import ReleaseDetailsCtrl from './release.details.ctrl';
import ReleaseEditCtrl from './release.edit.ctrl';
import ReleaseEditVersionModalCtrl from './release.edit.version.modal.ctrl';
import ReleaseDownloadModalCtrl from './release.download.modal.ctrl';
import ReleaseFileValidationCtrl from './release.file.validation.ctrl';
import ReleaseSelectPlayfieldModalCtrl from './release.select.playfield.modal.ctrl';
import ReleaseService from './release.service';
import { validationStatus, validationTooltip, allowedFlavors } from './release.filters';
import ReleaseMeta from './release.add.meta';

export default angular
	.module('vpdb.releases', [])
	.service('ReleaseService', ReleaseService)
	.controller('ReleaseAddCtrl', ReleaseAddCtrl)
	.controller('ReleaseAddVersionCtrl', ReleaseAddVersionCtrl)
	.controller('ReleaseListCtrl', ReleaseListCtrl)
	.controller('ReleaseDetailsCtrl', ReleaseDetailsCtrl)
	.controller('ReleaseEditFileCtrl', ReleaseEditCtrl)
	.controller('ReleaseEditVersionModalCtrl', ReleaseEditVersionModalCtrl)
	.controller('ReleaseDownloadModalCtrl', ReleaseDownloadModalCtrl)
	.controller('ReleaseFileValidationCtrl', ReleaseFileValidationCtrl)
	.controller('ReleaseSelectPlayfieldModalCtrl', ReleaseSelectPlayfieldModalCtrl)
	.constant('ReleaseMeta', ReleaseMeta)
	.filter('validationStatus', validationStatus)
	.filter('validationTooltip', validationTooltip)
	.filter('allowedFlavors', allowedFlavors)
	.name;
