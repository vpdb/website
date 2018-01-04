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
import Flavors from './flavors.constant';
import ConfigService from './config.service';
import TrackerService from './tracker.service';
import FileUploadHelperService from './file.upload.helper.service';
import RatingDirectiveCtrl from './rating.directive.ctrl';
import TopBadgeDirectiveCtrl from './top-badge.directive.ctrl';
import ratingBox from './rating.directive';
import topBadge from './top-badge.directive';
import editor from './editor.directive';
import editorMarkdownInfo from './editor.markdown-info.directive';
import fileUpload from './file.upload.directive';
import { makeLoaded, imgBg, imgSrc } from './image.directives';
import { fallbackIcon, focusOn, onEnter, jsonLd, markdown, sort, filterArray } from './util.directives';
import { bytesFilter, escapeFilter, fileExtFilter, hexFilter, hashPrefixFilter, authorsFilter } from './util.filters';
import EditorDirectiveCtrl from './editor.directive.ctrl';
import CommentCtrl from './comment.ctrl';
import heightAnimation from './height.animation';
import collapseInAnimation from './collapse-in.animation';
import videoJs from './videojs.directive';

export default angular.module('vpdb.core', [])
	.constant('Config', WEBSITE_CONFIG)
	.constant('Flavors', Flavors)
	.service('ConfigService', ConfigService)
	.service('TrackerService', TrackerService)
	.service('FileUploadHelperService', FileUploadHelperService)
	.controller('EditorDirectiveCtrl', EditorDirectiveCtrl)
	.controller('CommentCtrl', CommentCtrl)
	.controller('RatingDirectiveCtrl', RatingDirectiveCtrl)
	.controller('TopBadgeDirectiveCtrl', TopBadgeDirectiveCtrl)
	.directive('editor', editor)
	.directive('markdownInfo', editorMarkdownInfo)
	.directive('ratingbox', ratingBox)
	.directive('topBadge', topBadge)
	.directive('makeLoaded', makeLoaded)
	.directive('imgBg', imgBg)
	.directive('imgSrc', imgSrc)
	.directive('fallbackIcon', fallbackIcon)
	.directive('focusOn', focusOn)
	.directive('onEnter', onEnter)
	.directive('jsonld', jsonLd)
	.directive('markdown', markdown)
	.directive('sort', sort)
	.directive('filterArray', filterArray)
	.directive('fileUpload', fileUpload)
	.directive('videojs', videoJs)
	.filter('authors', authorsFilter)
	.filter('bytes', bytesFilter)
	.filter('escape', escapeFilter)
	.filter('fileext', fileExtFilter)
	.filter('hex', hexFilter)
	.filter('sprite', hashPrefixFilter)
	.animation('.height-animation', heightAnimation)
	.animation('.collapse-in-animation', collapseInAnimation)
	.name;