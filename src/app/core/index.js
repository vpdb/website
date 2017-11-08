import angular from 'angular';
import Flavors from './flavors.constant';
import ConfigService from './config.service';
import TrackerService from './tracker.service';
import FileUploadHelperService from './file.upload.helper.service';
import ratingBox from './rating.directive';
import topBadge from './top-badge.directive';
import editor from './editor.directive';
import fileUpload from './file.upload.directive';
import { makeLoaded, imgBg, imgSrc } from './image.directives';
import { fallbackIcon, focusOn, onEnter, jsonLd, markdown, sort } from './util.directives';
import { bytesFilter, escapeFilter, fileExtFilter, hexFilter, hashPrefixFilter, authorsFilter } from './util.filters';
import EditorCtrl from './editor.ctrl';
import CommentCtrl from './comment.ctrl';
import heightAnimation from './height.animation';

export default angular.module('vpdb.core', [])
	.constant('Config', WEBSITE_CONFIG)
	.constant('Flavors', Flavors)
	.service('ConfigService', ConfigService)
	.service('TrackerService', TrackerService)
	.service('FileUploadHelperService', FileUploadHelperService)
	.controller('EditorCtrl', EditorCtrl)
	.controller('CommentCtrl', CommentCtrl)
	.directive('editor', editor)
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
	.directive('fileUpload', fileUpload)
	.filter('authors', authorsFilter)
	.filter('bytes', bytesFilter)
	.filter('escape', escapeFilter)
	.filter('fileext', fileExtFilter)
	.filter('hex', hexFilter)
	.filter('sprite', hashPrefixFilter)
	.animation('.height-animation', heightAnimation)
	.name;