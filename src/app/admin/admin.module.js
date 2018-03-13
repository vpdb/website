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

import BuildListAdminComponent from './builds/build.list.admin.component';
import BuildAddAdminModalCtrl from './builds/build.add.admin.modal.ctrl';
import BuildEditAdminModalCtrl from './builds/build.edit.admin.modal.ctrl';
import UserListAdminComponent from './users/user.list.admin.component';
import UploadsListAdminComponent from './uploads/uploads.list.admin.component';
import UploadsReleaseListAdminCtrl from './uploads/uploads.release.admin.list.ctrl';
import UploadsListAdminCtrl from './uploads/uploads.list.admin.ctrl';
import UploadsBackglassModerateAdminModalCtrl from './uploads/uploads.backglass.moderate.admin.modal.ctrl';
import UploadsReleaseModerateAdminModalCtrl from './uploads/uploads.release.moderate.admin.modal.ctrl';
import UploadsBackglassListAdminCtrl from './uploads/uploads.backglass.admin.list.ctrl';
import TokenCreateAdminModalCtrl from './tokens/token.create.admin.modal.ctrl';
import UploadHelper from './uploads/uploads.helper.service';
import TokenListAdminComponent from './tokens/token.list.admin.component';
import filterRole from './users/user.filter-role.directive';

const ADMIN_MODULE = angular
	.module('vpdb.admin', [ ])
	.service('UploadHelper', UploadHelper)
	.component('buildListAdminComponent', new BuildListAdminComponent())
	.component('userListAdminComponent', new UserListAdminComponent())
	.component('uploadsListAdminComponent', new UploadsListAdminComponent())
	.component('tokenListAdminComponent', new TokenListAdminComponent())
	.controller('BuildAddAdminModalCtrl', BuildAddAdminModalCtrl)
	.controller('BuildEditAdminModalCtrl', BuildEditAdminModalCtrl)
	.controller('UploadsListAdminCtrl', UploadsListAdminCtrl)
	.controller('UploadsBackglassListAdminCtrl', UploadsBackglassListAdminCtrl)
	.controller('UploadsBackglassModerateAdminModalCtrl', UploadsBackglassModerateAdminModalCtrl)
	.controller('UploadsReleaseListAdminCtrl', UploadsReleaseListAdminCtrl)
	.controller('UploadsReleaseModerateAdminModalCtrl', UploadsReleaseModerateAdminModalCtrl)
	.controller('TokenCreateAdminModalCtrl', TokenCreateAdminModalCtrl)
	.directive('filterRole', filterRole);

export { ADMIN_MODULE };
