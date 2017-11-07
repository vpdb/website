import angular from 'angular';
import HomeCtrl from './home.ctrl';

export default angular
	.module('vpdb.home', [])
	.controller('HomeCtrl', HomeCtrl)
	.name;