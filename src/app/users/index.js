import angular from 'angular';
import UserInfoModalCtrl from './user.info.modal.ctrl';
import UserListAdminCtrl from './user.list.admin.ctrl';
import UserEditAdminModalCtrl from './user.edit.admin.modal.ctrl';
import AuthorSelectModalCtrl from './author.select.modal.ctrl';
import userInfo from './user.info.directive';
import filterRole from './user.filter-role.directive';

export default angular
	.module('vpdb.users', [])
	.controller('UserInfoModalCtrl', UserInfoModalCtrl)
	.controller('UserListAdminCtrl', UserListAdminCtrl)
	.controller('UserEditAdminModalCtrl', UserEditAdminModalCtrl)
	.controller('AuthorSelectModalCtrl', AuthorSelectModalCtrl)
	.directive('user', userInfo)
	.directive('filterRole', filterRole)
	.name;