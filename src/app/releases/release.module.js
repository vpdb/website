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
import uiCarousel from 'angular-ui-bootstrap/src/carousel';
import uiTooltip from 'angular-ui-bootstrap/src/tooltip';
import uiAccordion from 'angular-ui-bootstrap/src/accordion';
import 'magnific-popup';

import FileUploadModule from '../shared/file-upload/file.upload.module';
import EditorModule from '../shared/editor/editor.module';
import MarkdownModule from '../shared/markdown/markdown.module';
import RatingModule from '../shared/rating/rating.module';

import ReleaseListComponent from './list/release.list.component';
import ReleaseDetailsComponent from './details/release.details.component';
import ReleaseDownloadModalCtrl from './details/release.download.modal.ctrl';
import ReleaseFileValidationCtrl from './details/release.file.validation.ctrl';
import validationStatus from './details/release.validation.status.filter';
import validationTooltip from './details/release.validation.tooltip.filter';

const RELEASE_MODULE = angular
	.module('vpdb.releases', [ uiCarousel, uiTooltip, uiAccordion, FileUploadModule.name, MarkdownModule.name, EditorModule.name, RatingModule.name ])
	.component('releaseListComponent', new ReleaseListComponent())
	.component('releaseDetailsComponent', new ReleaseDetailsComponent())
	.controller('ReleaseDownloadModalCtrl', ReleaseDownloadModalCtrl)
	.controller('ReleaseFileValidationCtrl', ReleaseFileValidationCtrl)
	.filter('validationStatus', validationStatus)
	.filter('validationTooltip', validationTooltip);

export { RELEASE_MODULE };
