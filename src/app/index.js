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

import 'jquery';
import 'jquery.waitforimages';
import 'jquery-ui/ui/core';
import 'jquery-ui/ui/widget';
import 'jquery-ui/ui/widgets/mouse';
import 'jquery-ui/ui/widgets/droppable';
import 'magnific-popup';

import angular from 'angular';
import ngAnimate from 'angular-animate';
import ngResource from 'angular-resource';
import ngSanitize from 'angular-sanitize';
import ngTouch from 'angular-touch';
import uiRouter from '@uirouter/angularjs';
import uiBootstrap from 'angular-ui-bootstrap';
import ngElastic from 'angular-elastic';
import ngFileUpload from 'ng-file-upload';

import 'ngstorage';
import 'angular-gravatar';
import 'angular-timeago';
import 'angular-dragdrop';
import 'ment.io';
import 'ngclipboard';

import core from './core';
import auth from './auth';
import backend from './backend';
import template from './template';
import modal from './modal';

import home from './home';
import games from './games';
import releases from './releases';
import backglasses from './backglasses';
import users from './users';
import profile from './profile';
import builds from './builds';
import media from './media';
import uploads from './uploads';
import content from './content';
import tag from './tag';
import errors from './errors';
import tokens from './tokens';

import routes from './app.routes';
import controller from './app.ctrl';
import service from './app.service';
import { msdElasticConfig, timeAgoConfig } from './app.config';

import './app.styles';
import AppTpl from './app.pug';

const app = () => {
	return {
		templateUrl: AppTpl,
		controller: 'AppCtrl',
		controllerAs: 'vm'
	};
};

// require all icons
// eslint-disable-next-line no-undef
const files = require.context('../icons', false, /\.svg$/);
files.keys().forEach(files);

angular.module('vpdb', [

	// angular components
	ngAnimate,
	ngResource,
	ngSanitize,
	ngTouch,

	// third party components
	uiRouter,
	uiBootstrap,
	ngElastic,
	ngFileUpload,
	'ngDragDrop',
	'ngStorage',
	'ngclipboard',
	'ui.gravatar',
	'mentio',
	'yaru22.angular-timeago',

	// common modules
	core,
	auth,
	backend,
	template,
	modal,

	// sections
	home,
	games,
	releases,
	backglasses,
	profile,
	users,
	builds,
	media,
	uploads,
	content,
	tag,
	errors,
	tokens
])
	.config(routes)
	.config(msdElasticConfig)
	.config(timeAgoConfig)
	.service('App', service)
	.controller('AppCtrl', controller)
	.directive('vpdb', app);
