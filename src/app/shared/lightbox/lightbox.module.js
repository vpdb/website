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
import 'angular-bootstrap-lightbox';

import LightboxConfig from './lightbox.config';

// we include ui.bootstrap per module, so this isn't available. let's mock it so angular-bootstrap-lightbox doesn't crash.
angular.module('ui.bootstrap', []);

/**
 * This module just groups config and template of the
 * angular-bootstrap-lightbox dependency.
 *
 * @see https://github.com/compact/angular-bootstrap-lightbox
 */
export default angular
	.module('vpdb.lightbox', [ 'bootstrapLightbox' ])
	.config(LightboxConfig);
