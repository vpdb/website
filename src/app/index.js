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

// jquery
// import 'jquery';
// import 'jquery.waitforimages';

// core angular modules
import angular from 'angular';
import ngAnimate from 'angular-animate';
import ngResource from 'angular-resource';
import ngSanitize from 'angular-sanitize';
import ngTouch from 'angular-touch';
import uiRouter from '@uirouter/angularjs';
import uiModal from 'angular-ui-bootstrap/src/modal';
import uiDropdown from 'angular-ui-bootstrap/src/dropdown';
import uiTooltip from 'angular-ui-bootstrap/src/tooltip';

// global third party modules
import 'ngstorage';
import 'angular-gravatar';
import 'angular-timeago';
import 'oclazyload';

// app bootstrap
import AppCtrl from './app.ctrl';
import AppTpl from './app.pug';
import routes from './app.routes';
import service from './app.service';
import timeAgoConfig from './common/config/time-ago.config';

// styles
import './app.styles';

// global app modules
import CommonModule from './common/common.module';
import HomeModule from './home/home.module';

// static assets
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
	uiModal,
	uiDropdown,
	uiTooltip,
	'oc.lazyLoad',
	'ngStorage',
	'ui.gravatar',
	'yaru22.angular-timeago',

	// global app modules
	CommonModule.name,
	HomeModule.name,
])
	.config(routes)
	.config(timeAgoConfig)
	.service('App', service)
	.directive('vpdb', () => {
		return {
			templateUrl: AppTpl,
			controller: AppCtrl,
			controllerAs: 'vm'
		};
	});

export { VPDB };
