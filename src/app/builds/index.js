import angular from 'angular';
import BuildAddModalCtrl from './build.add.modal.ctrl';
import BuildListAdminCtrl from './build.list.admin.ctrl';
import BuildAddAdminModalCtrl from './build.add.admin.modal.ctrl';
import BuildEditAdminModalCtrl from './build.edit.admin.modal.ctrl';

export default angular
	.module('vpdb.builds', [])
	.controller('BuildAddModalCtrl', BuildAddModalCtrl)
	.controller('BuildListAdminCtrl', BuildListAdminCtrl)
	.controller('BuildAddAdminModalCtrl', BuildAddAdminModalCtrl)
	.controller('BuildEditAdminModalCtrl', BuildEditAdminModalCtrl)
	.name;