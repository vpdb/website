import angular from 'angular';
import MediumInfoModalCtrl from './medium.info.modal.ctrl';

export default angular
	.module('vpdb.media', [])
	.controller('MediumInfoModalCtrl', MediumInfoModalCtrl)
	.name;