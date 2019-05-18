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
import uiTypeahead from 'angular-ui-bootstrap/src/typeahead';
import {
	ReleaseCommentResource,
	ReleaseFileValidationResource,
	ReleaseModerationCommentResource,
	ReleaseModerationResource,
	ReleaseRatingResource,
	ReleaseResource,
	ReleaseStarResource,
	ReleaseVersionResource
} from './backend/release.resource';
import {
	GameRatingResource,
	GameReleaseNameResource,
	GameRequestResource,
	GameResource,
	GameStarResource
} from './backend/game.resource';
import { PlanResource } from './backend/plan.resource';
import { BuildResource } from './backend/build.resource';
import { RolesResource } from './backend/roles.resource';
import { BackglassModerationResource, BackglassResource } from './backend/backglass.resource';
import { AuthRedirectResource, AuthResource, ProfileResource, TokenResource } from './backend/auth.resource';
import { MediumResource } from './backend/medium.resource';
import { FileBlockmatchResource, FileResource } from './backend/file.resource';
import { UserConfirmationResource, UserResource, UserStarResource } from './backend/user.resource';
import { RomResource } from './backend/rom.resource';
import { IpdbResource } from './backend/ipdb.resource';
import { TagResource } from './backend/tag.resource';
import { CommentResource } from './backend/comment.resource';
import ApiHelper from './backend/apihelper.service';
import AuthCallbackCtrl from './auth/auth.callback.ctrl';
import AuthService from './auth/auth.service';
import BootstrapPatcher from './util/bootstrap.patcher';
import ConfigService from './config/config.service';
import DownloadService from './backend/download.service';
import EmailConfirmationCtrl from './auth/email.confirmation.ctrl';
import Error401Ctrl from './errors/error.401.ctrl';
import Error403Ctrl from './errors/error.403.ctrl';
import Error404Ctrl from './errors/error.404.ctrl';
import ErrorReportingService from './util/error.reporting.service';
import Flavors from './config/flavors.constant';
import GameSystems from './games/game.systems.constant';
import GameSelectModalCtrl from './games/game.select.modal.ctrl';
import GameRequestModalCtrl from './games/game.request.modal.ctrl';
import LoginModalCtrl from './auth/login.modal.ctrl';
import LoginService from './auth/login.service';
import ModalCtrl from './modal/modal.ctrl';
import ModalService from './modal/modal.service';
import ModalMarkdownFiddle from './modal/modal.markdown.fiddle';
import ModalFlashService from './modal/modal.flash.service';
import NetworkService from './backend/network.service';
import ReleaseService from './releases/release.service';
import ResetPasswordModalCtrl from './auth/reset.password.modal.ctrl';
import TrackerService from './util/tracker.service';
import UserInfoModalCtrl from './user/user.info.modal.ctrl';
import UserMergeModalCtrl from './user/user.merge.modal.ctrl';
import authorsFilter from './util/authors.filter';
import bytesFilter from './util/bytes.filter';
import collapseInAnimation from './animation/collapse-in.animation';
import gameTypeFilter from './games/game.type.filter';
import escapeFilter from './util/escape.filter';
import exceptionHandler from './util/exception-handler';
import fallbackIcon from './util/fallback-icon.directive';
import fileExtFilter from './util/file-ext.filter';
import filterArray from './util/filter-array.directive';
import focusOn from './util/focus-on.directive';
import hashPrefixFilter from './util/hash-prefix.filter';
import heightAnimation from './animation/height.animation';
import hexFilter from './util/hex.filter';
import httpAuthInterceptor from './backend/http.auth.interceptor';
import httpGlobalInterceptor from './backend/http.global.interceptor';
import httpInterceptorConfig from './backend/http.interceptor.config';
import { BackgroundImageDirective } from './image/img-bg.directive';
import imgSrc from './image/img-src.directive';
import jsonLd from './util/json-ld.directive';
import onEnter from './util/on-enter.directive';
import makeLoaded from './image/make-loaded.directive';
import sort from './util/sort.directive';
import ratingFormatFilter from './games/rating.format.filter';
import timeAgoFilter from './util/time-ago.filter';
import userInfo from './user/user.info.directive';


/**
 * These are global components that are or can be used on any page,
 * e.g. from the menu bar or within the markup.
 *
 * This module is a dependency of the main app as well as of most
 * other components, so it will be always loaded.
 */
export default angular.module('vpdb.common', [ uiTypeahead ])

	// animation
	.animation('.height-animation', heightAnimation)
	.animation('.collapse-in-animation', collapseInAnimation)

	// auth
	.service('AuthService', AuthService)
	.service('LoginService', LoginService)
	.controller('AuthCallbackCtrl', AuthCallbackCtrl)
	.controller('LoginModalCtrl', LoginModalCtrl)
	.controller('EmailConfirmationCtrl', EmailConfirmationCtrl)
	.controller('ResetPasswordModalCtrl', ResetPasswordModalCtrl)

	// backend
	.service('ApiHelper', ApiHelper)
	.service('AuthResource', AuthResource)
	.service('AuthRedirectResource', AuthRedirectResource)
	.service('BackglassResource', BackglassResource)
	.service('BackglassModerationResource', BackglassModerationResource)
	.service('BuildResource', BuildResource)
	.service('CommentResource', CommentResource)
	.service('DownloadService', DownloadService)
	.service('FileResource', FileResource)
	.service('FileBlockmatchResource', FileBlockmatchResource)
	.service('GameRatingResource', GameRatingResource)
	.service('GameReleaseNameResource', GameReleaseNameResource)
	.service('GameRequestResource', GameRequestResource)
	.service('GameResource', GameResource)
	.service('GameStarResource', GameStarResource)
	.service('IpdbResource', IpdbResource)
	.service('MediumResource', MediumResource)
	.service('NetworkService', NetworkService)
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
	.factory('HttpAuthInterceptor', httpAuthInterceptor)
	.factory('HttpGlobalInterceptor', httpGlobalInterceptor)
	.factory('$exceptionHandler', exceptionHandler)
	.config(httpInterceptorConfig)

	// config
	.service('ConfigService', ConfigService)
	.constant('Flavors', Flavors)
	// eslint-disable-next-line no-undef
	.constant('Config', WEBSITE_CONFIG)
	// eslint-disable-next-line no-undef
	.constant('BuildConfig', BUILD_CONFIG)

	// errors
	.controller('Error401Ctrl', Error401Ctrl)
	.controller('Error403Ctrl', Error403Ctrl)
	.controller('Error404Ctrl', Error404Ctrl)

	// image
	.directive('makeLoaded', makeLoaded)
	.directive('imgBg', BackgroundImageDirective.directiveFactory)
	.directive('imgSrc', imgSrc)

	// games
	.controller('GameRequestModalCtrl', GameRequestModalCtrl)
	.controller('GameSelectModalCtrl', GameSelectModalCtrl)
	.constant('GameSystems', GameSystems)
	.filter('gametype', gameTypeFilter)

	// modal
	.service('ModalService', ModalService)
	.service('ModalFlashService', ModalFlashService)
	.controller('ModalCtrl', ModalCtrl)
	.constant('ModalMarkdownFiddle', ModalMarkdownFiddle)

	// user
	.controller('UserInfoModalCtrl', UserInfoModalCtrl)
	.controller('UserMergeModalCtrl', UserMergeModalCtrl)
	.directive('user', userInfo)

	// releases
	.service('ReleaseService', ReleaseService)

	// util
	.service('BootstrapPatcher', BootstrapPatcher)
	.service('ErrorReportingService', ErrorReportingService)
	.service('TrackerService', TrackerService)
	.directive('fallbackIcon', fallbackIcon)
	.directive('filterArray', filterArray)
	.directive('sort', sort)
	.directive('jsonld', jsonLd)
	.directive('onEnter', onEnter)
	.directive('focusOn', focusOn)
	.filter('authors', authorsFilter)
	.filter('bytes', bytesFilter)
	.filter('escape', escapeFilter)
	.filter('fileext', fileExtFilter)
	.filter('hex', hexFilter)
	.filter('sprite', hashPrefixFilter)
	.filter('timeAgo', timeAgoFilter)
	.filter('ratingFormat', ratingFormatFilter);
