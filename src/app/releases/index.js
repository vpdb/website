import angular from 'angular';
import ReleaseAddCtrl from './release.add.ctrl';
import ReleaseAddVersionCtrl from './release.add.version.ctrl';
import ReleaseListCtrl from './release.list.ctrl';
import ReleaseDetailsCtrl from './release.details.ctrl';
import ReleaseDownloadModalCtrl from './release.download.modal.ctrl';
import ReleaseFileValidationCtrl from './release.file.validation.ctrl';
import ReleaseSelectPlayfieldModalCtrl from './release.select.playfield.modal.ctrl';
import ReleaseService from './release.service';
import { validationStatus, validationTooltip } from './release.filters';
import ReleaseMeta from './release.add.meta';

export default angular
	.module('vpdb.releases', [])
	.service('ReleaseService', ReleaseService)
	.controller('ReleaseAddCtrl', ReleaseAddCtrl)
	.controller('ReleaseAddVersionCtrl', ReleaseAddVersionCtrl)
	.controller('ReleaseListCtrl', ReleaseListCtrl)
	.controller('ReleaseDetailsCtrl', ReleaseDetailsCtrl)
	.controller('ReleaseDownloadModalCtrl', ReleaseDownloadModalCtrl)
	.controller('ReleaseFileValidationCtrl', ReleaseFileValidationCtrl)
	.controller('ReleaseSelectPlayfieldModalCtrl', ReleaseSelectPlayfieldModalCtrl)
	.constant('ReleaseMeta', ReleaseMeta)
	.filter('validationStatus', validationStatus)
	.filter('validationTooltip', validationTooltip)
	.name;