import angular from 'angular';
import ModalService from './modal.service';
import ModalFlashService from './modal.flash.service';
import ModalCtrl from './modal.ctrl';

export default angular
	.module('vpdb.modal', [])
	.service('ModalService', ModalService)
	.service('ModalFlashService', ModalFlashService)
	.controller('ModalCtrl', ModalCtrl)
	.name;