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

import angular from 'angular';
import ngAnimate from 'angular-animate';
import ngResource from 'angular-resource';
import ngSanitize from 'angular-sanitize';
import ngTouch from 'angular-touch';
import uiRouter from '@uirouter/angularjs';
import uiBootstrap from 'angular-ui-bootstrap';
import ngElastic from 'angular-elastic';

import 'ngstorage';
import 'angular-gravatar';
import 'angular-timeago';

import 'ment.io';
import 'ngclipboard';
import 'oclazyload';

import core from './core';
import backend from './backend';
import modal from './modal';

import home from './home';
import errors from './errors';

import routes from './app.routes';
import controller from './app.ctrl';
import service from './app.service';
import { msdElasticConfig, timeAgoConfig } from './app.config';

import './app.styles';
import AppTpl from './app.pug';

// global modules
import CommonModule from './common/common.module';

const app = () => {
	return {
		templateUrl: AppTpl,
		controller: 'AppCtrl',
		controllerAs: 'vm'
	};
};

// require static assets
import '../icons';
import '../static';
import '../static/favicon';

/**
 * Dependencies here are global dependencies only, everything else is
 * lady-loaded.
 *
 * @type {*|ng.$compileProvider|{test}}
 */
const VPDB = angular.module('vpdb', [

	// angular components
	ngAnimate,
	ngResource,
	ngSanitize,
	ngTouch,

	// global third party components
	uiRouter,
	uiBootstrap,
	'oc.lazyLoad',
	'ngStorage',
	'ngclipboard',
	'ui.gravatar',
	'mentio',
	'yaru22.angular-timeago',

	ngElastic,

	// common modules
	core,
	backend,
	modal,

	CommonModule.name,

	// sections
	home,
	errors
])
	.config(routes)
	.config(msdElasticConfig)
	.config(timeAgoConfig)
	.service('App', service)
	.controller('AppCtrl', controller)
	.directive('vpdb', app);

export { VPDB };
