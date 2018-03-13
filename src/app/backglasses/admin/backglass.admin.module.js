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

import FileUploadModule from '../../shared/file-upload/file.upload.module';
import EditorModule from '../../shared/editor/editor.module';
import BackglassAddComponent from './backglass.add.component';
import BackglassEditModalCtrl from './backglass.edit.modal.ctrl';

export default angular
	.module('vpdb.backglasses.admin', [ FileUploadModule.name, EditorModule.name ])
	.component('backglassAddComponent', new BackglassAddComponent())
	.controller('BackglassEditModalCtrl', BackglassEditModalCtrl);
