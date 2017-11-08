import angular from 'angular';
import UploadsAdminListCtrl from './uploads.admin.list.ctrl';
import UploadsAdminBackglassListCtrl from './uploads.admin.backglass.list.ctrl';
import UploadsAdminReleaseListCtrl from './uploads.admin.release.list.ctrl';
import UploadsAdminReleaseModerateModalCtrl from './uploads.admin.release.moderate.modal.ctrl';
import UploadsAdminBackglassModerateModalCtrl from './uploads.admin.backglass.moderate.modal.ctrl';
import UploadHelper from './uploads.helper.service';

export default angular
	.module('vpdb.uploads', [])
	.service('UploadHelper', UploadHelper)
	.controller('UploadsAdminListCtrl', UploadsAdminListCtrl)
	.controller('UploadsAdminBackglassListCtrl', UploadsAdminBackglassListCtrl)
	.controller('UploadsAdminReleaseListCtrl', UploadsAdminReleaseListCtrl)
	.controller('UploadsAdminReleaseModerateModalCtrl', UploadsAdminReleaseModerateModalCtrl)
	.controller('UploadsAdminBackglassModerateModalCtrl', UploadsAdminBackglassModerateModalCtrl)
	.name;