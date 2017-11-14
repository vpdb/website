import angular from 'angular';
import Error404Ctrl from './error.404.ctrl';

export default angular
	.module('vpdb.errors', [])
	.controller('Error404Ctrl', Error404Ctrl)
	.name;