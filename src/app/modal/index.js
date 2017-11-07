import angular from 'angular';
import ModalService from './modal.service';
import ModalCtrl from './modal.ctrl';

export default angular
	.module('vpdb.modal', [])
	.service('ModalService', ModalService)
	.controller('ModalCtrl', ModalCtrl)
	.name;