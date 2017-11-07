import angular from 'angular';
import ReleaseAddCtrl from './add.ctrl';
import ReleaseListCtrl from './list.ctrl';
import ReleaseDetailsCtrl from './details.ctrl';
import ReleaseDownloadModalCtrl from './download.modal.ctrl';
import ReleaseFileValidationCtrl from './file.validation.ctrl';
import ReleaseService from './release.service';
import { validationStatus, validationTooltip } from './release.filters';
import ReleaseMeta from './add.meta';

export default angular
	.module('vpdb.releases', [])
	.service('ReleaseService', ReleaseService)
	.controller('ReleaseAddCtrl', ReleaseAddCtrl)
	.controller('ReleaseListCtrl', ReleaseListCtrl)
	.controller('ReleaseDetailsCtrl', ReleaseDetailsCtrl)
	.controller('ReleaseDownloadModalCtrl', ReleaseDownloadModalCtrl)
	.controller('ReleaseFileValidationCtrl', ReleaseFileValidationCtrl)
	.constant('ReleaseMeta', ReleaseMeta)
	.filter('validationStatus', validationStatus)
	.filter('validationTooltip', validationTooltip)
	.name;