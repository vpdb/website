import angular from 'angular';
import UploadHelper from './uploads.helper.service';
import UploadsListAdminCtrl from './uploads.list.admin.ctrl';
import UploadsBackglassListAdminCtrl from './uploads.backglass.admin.list.ctrl';
import UploadsBackglassModerateAdminModalCtrl from './uploads.backglass.moderate.admin.modal.ctrl';
import UploadsReleaseListAdminCtrl from './uploads.release.admin.list.ctrl';
import UploadsReleaseModerateAdminModalCtrl from './uploads.release.moderate.admin.modal.ctrl';

export default angular
	.module('vpdb.uploads', [])
	.service('UploadHelper', UploadHelper)
	.controller('UploadsListAdminCtrl', UploadsListAdminCtrl)
	.controller('UploadsBackglassListAdminCtrl', UploadsBackglassListAdminCtrl)
	.controller('UploadsBackglassModerateAdminModalCtrl', UploadsBackglassModerateAdminModalCtrl)
	.controller('UploadsReleaseListAdminCtrl', UploadsReleaseListAdminCtrl)
	.controller('UploadsReleaseModerateAdminModalCtrl', UploadsReleaseModerateAdminModalCtrl)
	.name;