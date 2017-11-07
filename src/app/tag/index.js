import angular from 'angular';
import TagAddModalCtrl from './add.modal.ctrl';

export default angular
	.module('vpdb.tags', [])
	.controller('TagAddModalCtrl', TagAddModalCtrl)
	.name;