import angular from 'angular';
import GameDetailsCtrl from './details.ctrl';
import GameListCtrl from './list.ctrl';
import GameReleaseDetailsCtrl from './details.release.ctrl';
import GameBackglassDetailsModalCtrl from './details.backglass.modal.ctrl';
import GameBackglassEditModalCtrl from './details.backglass.edit.modal.ctrl';
import GameMediumDetailsModalCtrl from './details.medium.modal.ctrl';
import GameRequestModalCtrl from './request.modal.ctrl';
import GameSelectModalCtrl from './select.modal.ctrl';
import AdminGameAddCtrl from './add.ctrl';
import { gameTypeFilter, ratingFormatFilter } from './game.filters';
import { filterDecade, filterManufacturer } from './game.directives';

export default angular
	.module('vpdb.games', [])
	.controller('GameDetailsCtrl', GameDetailsCtrl)
	.controller('GameListCtrl', GameListCtrl)
	.controller('GameReleaseDetailsCtrl', GameReleaseDetailsCtrl)
	.controller('GameBackglassDetailsModalCtrl', GameBackglassDetailsModalCtrl)
	.controller('GameBackglassEditModalCtrl', GameBackglassEditModalCtrl)
	.controller('GameMediumDetailsModalCtrl', GameMediumDetailsModalCtrl)
	.controller('GameRequestModalCtrl', GameRequestModalCtrl)
	.controller('GameSelectModalCtrl', GameSelectModalCtrl)
	.controller('AdminGameAddCtrl', AdminGameAddCtrl)
	.directive('filterDecade', filterDecade)
	.directive('filterManufacturer', filterManufacturer)
	.filter('gametype', gameTypeFilter)
	.filter('ratingFormat', ratingFormatFilter)
	.name;