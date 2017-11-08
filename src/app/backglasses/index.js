import angular from 'angular';
import BackglassAddCtrl from './backglass.add.ctrl';
import BackglassDetailsModalCtrl from './backglass.details.modal.ctrl';
import BackglassEditModalCtrl from './backglass.edit.modal.ctrl';

export default angular
	.module('vpdb.backglasses', [])
	.controller('BackglassAddCtrl', BackglassAddCtrl)
	.controller('BackglassDetailsModalCtrl', BackglassDetailsModalCtrl)
	.controller('BackglassEditModalCtrl', BackglassEditModalCtrl)
	.name;