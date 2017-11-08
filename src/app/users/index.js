import angular from 'angular';
import UserInfoModalCtrl from './user.info.modal.ctrl';
import UserAdminListCtrl from './user.admin.list.ctrl';
import UserAdminEditModalCtrl from './user.admin.edit.modal.ctrl';
import AuthorSelectModalCtrl from './author.select.modal.ctrl';
import userInfo from './user.info.directive';

export default angular
	.module('vpdb.users', [])
	.controller('UserInfoModalCtrl', UserInfoModalCtrl)
	.controller('UserAdminListCtrl', UserAdminListCtrl)
	.controller('UserAdminEditModalCtrl', UserAdminEditModalCtrl)
	.controller('AuthorSelectModalCtrl', AuthorSelectModalCtrl)
	.directive('user', userInfo)
	.name;