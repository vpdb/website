import angular from 'angular';
import ReleaseAddCtrl from './release.add.ctrl';
import ReleaseListCtrl from './release.list.ctrl';
import ReleaseDetailsCtrl from './release.details.ctrl';
import ReleaseDownloadModalCtrl from './release.download.modal.ctrl';
import ReleaseFileValidationCtrl from './release.file.validation.ctrl';
import ReleaseService from './release.service';
import { validationStatus, validationTooltip } from './release.filters';
import ReleaseMeta from './release.add.meta';

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