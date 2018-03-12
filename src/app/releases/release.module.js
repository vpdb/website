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
import 'magnific-popup';
import ngFileUpload from 'ng-file-upload';
import ReleaseListComponent from './list/release.list.component';
import ReleaseDetailsComponent from './details/release.details.component';
import ReleaseDownloadModalCtrl from './details/release.download.modal.ctrl';
import ReleaseFileValidationCtrl from './details/release.file.validation.ctrl';
import validationStatus from './details/release.validation.status.filter';
import validationTooltip from './details/release.validation.tooltip.filter';


const RELEASE_MODULE = angular
	.module('vpdb.releases', [ ngFileUpload ])
	.component('releaseListComponent', new ReleaseListComponent())
	.component('releaseDetailsComponent', new ReleaseDetailsComponent())
	.controller('ReleaseDownloadModalCtrl', ReleaseDownloadModalCtrl)
	.controller('ReleaseFileValidationCtrl', ReleaseFileValidationCtrl)
	.filter('validationStatus', validationStatus)
	.filter('validationTooltip', validationTooltip)

export { RELEASE_MODULE };
