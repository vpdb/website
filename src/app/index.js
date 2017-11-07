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
import uiRouter from 'angular-ui-router';
import uiBootstrap from 'angular-ui-bootstrap';
import ngMoment from 'angular-moment';
import ngFileUpload from 'ng-file-upload';

import 'angular-gravatar';
import 'ngstorage';
import 'angular-dragdrop';
import 'ment.io';

import 'bootstrap/dist/css/bootstrap.css';
import '../styles/vpdb.styl';

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
import uploads from './uploads';
import content from './content';
import tag from './tag';

import routes from './app.routes';
import controller from './app.ctrl';
import service from './app.service';

const app = () => {
	return {
		template: require('./app.pug'),
		controller: 'AppCtrl',
		controllerAs: 'vm'
	}
};

// require all icons
const files = require.context('../icons', false, /\.svg$/);
files.keys().forEach(files);

export default angular.module('vpdb', [

	// angular components
	ngAnimate,
	ngResource,
	ngSanitize,
	ngTouch,

	// third party components
	uiRouter,
	uiBootstrap,
	ngMoment,
	ngFileUpload,
	'ngDragDrop',
	'ngStorage',
	'ui.gravatar',
	'mentio',

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
	uploads,
	content,
	tag
])
	.config(routes)
	.service('App', service)
	.directive('vpdb', app)
	.controller('AppCtrl', controller)
	.name;