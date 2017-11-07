import angular from 'angular';
import BuildAddCtrl from './add.modal.ctrl';
import AdminBuildListCtrl from './list.ctrl';
import AdminBuildEditCtrl from './edit.modal.ctrl';
import AdminBuildAddCtrl from './add.admin.modal.ctrl';

export default angular
	.module('vpdb.builds', [])
	.controller('BuildAddCtrl', BuildAddCtrl)
	.controller('AdminBuildListCtrl', AdminBuildListCtrl)
	.controller('AdminBuildEditCtrl', AdminBuildEditCtrl)
	.controller('AdminBuildAddCtrl', AdminBuildAddCtrl)
	.name;