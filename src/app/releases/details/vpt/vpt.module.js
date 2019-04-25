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
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.
 */
import angular from 'angular';
import rzSlider from 'angularjs-slider';
import uiProgressbar from 'angular-ui-bootstrap/src/progressbar';
import ngFileUpload from 'ng-file-upload';
import 'angularjs-slider/dist/rzslider.min.css';

import VptPreviewComponent from './preview/vpt.preview.component';

const VPT_MODULE = angular
	.module('vpdb.vpt', [ uiProgressbar, rzSlider, ngFileUpload ])
	.component('vptPreviewComponent', new VptPreviewComponent());

export { VPT_MODULE };
