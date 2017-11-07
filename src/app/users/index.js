import angular from 'angular';
import UserInfoModalCtrl from './info.modal.ctrl';
import AdminUserListCtrl from './list.ctrl';
import AdminUserEditCtrl from './edit.modal.ctrl';
import AuthorSelectModalCtrl from './author.select.modal.ctrl';
import userInfo from './info.directive';

export default angular
	.module('vpdb.users', [])
	.controller('UserInfoModalCtrl', UserInfoModalCtrl)
	.controller('AdminUserListCtrl', AdminUserListCtrl)
	.controller('AdminUserEditCtrl', AdminUserEditCtrl)
	.controller('AuthorSelectModalCtrl', AuthorSelectModalCtrl)
	.directive('user', userInfo)
	.name;