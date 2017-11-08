import angular from 'angular';
import BuildAddModalCtrl from './build.add.modal.ctrl';
import BuildAdminListCtrl from './build.admin.list.ctrl';
import BuildAdminAddModalCtrl from './build.admin.add.modal.ctrl';
import BuildAdminEditModalCtrl from './build.admin.edit.modal.ctrl';

export default angular
	.module('vpdb.builds', [])
	.controller('BuildAddModalCtrl', BuildAddModalCtrl)
	.controller('BuildAdminListCtrl', BuildAdminListCtrl)
	.controller('BuildAdminAddModalCtrl', BuildAdminAddModalCtrl)
	.controller('BuildAdminEditModalCtrl', BuildAdminEditModalCtrl)
	.name;