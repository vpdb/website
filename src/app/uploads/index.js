import angular from 'angular';
import AdminUploadsCtrl from './list.ctrl';
import AdminReleaseUploadsCtrl from './releases.ctrl';
import AdminBackglassUploadsCtrl from './backglasses.ctrl';
import AdminModerateReleaseModalCtrl from './releases.moderate.modal.ctrl';
import AdminModerateBackglassModalCtrl from './backglasses.moderate.modal.ctrl';
import UploadHelper from './helper.service';

export default angular
	.module('vpdb.uploads', [])
	.service('UploadHelper', UploadHelper)
	.controller('AdminUploadsCtrl', AdminUploadsCtrl)
	.controller('AdminReleaseUploadsCtrl', AdminReleaseUploadsCtrl)
	.controller('AdminBackglassUploadsCtrl', AdminBackglassUploadsCtrl)
	.controller('AdminModerateReleaseModalCtrl', AdminModerateReleaseModalCtrl)
	.controller('AdminModerateBackglassModalCtrl', AdminModerateBackglassModalCtrl)
	.name;