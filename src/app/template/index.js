import angular from 'angular';
import BootstrapPatcher from './bootstrap.patcher';

export default angular
	.module('vpdb.templates', [])
	.service('BootstrapPatcher', BootstrapPatcher)
	.name;