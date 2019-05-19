/* eslint-disable no-undef */
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
import 'oclazyload';

// app bootstrap
import AppCtrl from './app.ctrl';
import AppTpl from './app.pug';
import routes from './app.routes';
import service from './app.service';

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

	// global app modules
	CommonModule.name,
	HomeModule.name,
])
	.config(routes)
	.service('App', service)
	.directive('vpdb', () => {
		return {
			templateUrl: AppTpl,
			controller: AppCtrl,
			controllerAs: 'vm'
		};
	})
	.run(['$rootScope', '$transitions', function($rootScope, $transitions) {
		let hadRouteChange = false;

		// The following listener is required if you're using ui-router
		$transitions.onStart({}, () => hadRouteChange = true);

		const hookAngularBoomerang = () => {
			if (window.BOOMR && BOOMR.version) {
				if (BOOMR.plugins && BOOMR.plugins.Angular) {
					BOOMR.plugins.Angular.hook($rootScope, $transitions, hadRouteChange);
				}
				return true;
			}
		};

		if (!hookAngularBoomerang()) {
			if (document.addEventListener) {
				document.addEventListener('onBoomerangLoaded', hookAngularBoomerang);
			} else if (document.attachEvent) {
				document.attachEvent('onpropertychange', function(e) {
					e = e || window.event;
					if (e && e.propertyName === 'onBoomerangLoaded') {
						hookAngularBoomerang();
					}
				});
			}
		}
	}]);

export { VPDB };

// this draws a cursor where the cursor is. useful for test debugging.
// const seleniumFollowerImg = document.createElement('img');
// seleniumFollowerImg.setAttribute('src', 'data:image/png;base64,'
// 	+ 'iVBORw0KGgoAAAANSUhEUgAAABQAAAAeCAQAAACGG/bgAAAAAmJLR0QA/4ePzL8AAAAJcEhZcwAA'
// 	+ 'HsYAAB7GAZEt8iwAAAAHdElNRQfgAwgMIwdxU/i7AAABZklEQVQ4y43TsU4UURSH8W+XmYwkS2I0'
// 	+ '9CRKpKGhsvIJjG9giQmliHFZlkUIGnEF7KTiCagpsYHWhoTQaiUUxLixYZb5KAAZZhbunu7O/PKf'
// 	+ 'e+fcA+/pqwb4DuximEqXhT4iI8dMpBWEsWsuGYdpZFttiLSSgTvhZ1W/SvfO1CvYdV1kPghV68a3'
// 	+ '0zzUWZH5pBqEui7dnqlFmLoq0gxC1XfGZdoLal2kea8ahLoqKXNAJQBT2yJzwUTVt0bS6ANqy1ga'
// 	+ 'VCEq/oVTtjji4hQVhhnlYBH4WIJV9vlkXLm+10R8oJb79Jl1j9UdazJRGpkrmNkSF9SOz2T71s7M'
// 	+ 'SIfD2lmmfjGSRz3hK8l4w1P+bah/HJLN0sys2JSMZQB+jKo6KSc8vLlLn5ikzF4268Wg2+pPOWW6'
// 	+ 'ONcpr3PrXy9VfS473M/D7H+TLmrqsXtOGctvxvMv2oVNP+Av0uHbzbxyJaywyUjx8TlnPY2YxqkD'
// 	+ 'dAAAAABJRU5ErkJggg==');
// seleniumFollowerImg.setAttribute('id', 'selenium_mouse_follower');
// seleniumFollowerImg.setAttribute('style', 'position: absolute; z-index: 99999999999; pointer-events: none;');
// document.body.appendChild(seleniumFollowerImg);
// document.getElementsByTagName('html')[0].addEventListener('mousemove', e => {
// 	document.getElementById('selenium_mouse_follower').style.left = e.pageX + 'px';
// 	document.getElementById('selenium_mouse_follower').style.top = e.pageY + 'px';
// });
