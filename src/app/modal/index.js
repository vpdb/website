import angular from 'angular';
import ModalService from './modal.service';
import ModalFlashService from './modal.flash.service';
import ModalCtrl from './modal.ctrl';
import ModalMarkdownFiddle from './modal.markdown.fiddle';

export default angular
	.module('vpdb.modal', [])
	.service('ModalService', ModalService)
	.service('ModalFlashService', ModalFlashService)
	.controller('ModalCtrl', ModalCtrl)
	.constant('ModalMarkdownFiddle', ModalMarkdownFiddle)
	.name;