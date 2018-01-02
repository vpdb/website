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
import ApiHelper from './apihelper.service';
import DownloadService from './download.service';
import { GameResource, GameRatingResource, GameStarResource, GameRequestResource, GameReleaseNameResource } from './game.resource';
import { FileResource, FileBlockmatchResource } from './file.resource';
import { ReleaseResource, ReleaseCommentResource, ReleaseVersionResource, ReleaseFileValidationResource,
	ReleaseModerationCommentResource, ReleaseModerationResource, ReleaseRatingResource, ReleaseStarResource } from './release.resource';
import { RomResource } from './rom.resource';
import { AuthResource, AuthRedirectResource, ProfileResource, TokenResource } from './auth.resource';
import { UserResource, UserConfirmationResource, UserStarResource } from './user.resource';
import { TagResource } from './tag.resource';
import { BuildResource } from './build.resource';
import { RolesResource } from './roles.resource';
import { PlanResource } from './plan.resource';
import { BackglassResource, BackglassModerationResource } from './backglass.resource';
import { IpdbResource } from './ipdb.resource';
import updateInterceptor from './update.interceptor';
import updateInterceptorConfig from './update.interceptor.config';

export default angular
	.module('vpdb.backend', [])
	.service('ApiHelper', ApiHelper)
	.service('AuthResource', AuthResource)
	.service('AuthRedirectResource', AuthRedirectResource)
	.service('BackglassResource', BackglassResource)
	.service('BackglassModerationResource', BackglassModerationResource)
	.service('BuildResource', BuildResource)
	.service('DownloadService', DownloadService)
	.service('FileResource', FileResource)
	.service('FileBlockmatchResource', FileBlockmatchResource)
	.service('GameRatingResource', GameRatingResource)
	.service('GameReleaseNameResource', GameReleaseNameResource)
	.service('GameRequestResource', GameRequestResource)
	.service('GameResource', GameResource)
	.service('GameStarResource', GameStarResource)
	.service('IpdbResource', IpdbResource)
	.service('PlanResource', PlanResource)
 	.service('ProfileResource', ProfileResource)
 	.service('ReleaseResource', ReleaseResource)
 	.service('ReleaseCommentResource', ReleaseCommentResource)
 	.service('ReleaseVersionResource', ReleaseVersionResource)
 	.service('ReleaseFileValidationResource', ReleaseFileValidationResource)
 	.service('ReleaseModerationCommentResource', ReleaseModerationCommentResource)
 	.service('ReleaseModerationResource', ReleaseModerationResource)
 	.service('ReleaseRatingResource', ReleaseRatingResource)
 	.service('ReleaseStarResource', ReleaseStarResource)
 	.service('RolesResource', RolesResource)
 	.service('RomResource', RomResource)
 	.service('TagResource', TagResource)
 	.service('TokenResource', TokenResource)
 	.service('UserResource', UserResource)
 	.service('UserConfirmationResource', UserConfirmationResource)
 	.service('UserStarResource', UserStarResource)
	.factory('UpdateInterceptor', updateInterceptor)
	.config(updateInterceptorConfig)
	.name;