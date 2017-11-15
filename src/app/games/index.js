import angular from 'angular';
import GameDetailsCtrl from './game.details.ctrl';
import GameListCtrl from './game.list.ctrl';
import GameReleaseDetailsCtrl from './game.release.details.ctrl';
import GameRequestModalCtrl from './game.request.modal.ctrl';
import GameSelectModalCtrl from './game.select.modal.ctrl';
import GameAddAdminCtrl from './game.add.admin.ctrl';
import GameEditAdminCtrl from './game.edit.admin.ctrl';
import GameSystems from './game.systems.constant';
import { gameTypeFilter, ratingFormatFilter } from './game.filters';
import { filterDecade, filterManufacturer } from './game.directives';

export default angular
	.module('vpdb.games', [])
	.controller('GameDetailsCtrl', GameDetailsCtrl)
	.controller('GameListCtrl', GameListCtrl)
	.controller('GameReleaseDetailsCtrl', GameReleaseDetailsCtrl)
	.controller('GameRequestModalCtrl', GameRequestModalCtrl)
	.controller('GameSelectModalCtrl', GameSelectModalCtrl)
	.controller('GameAddAdminCtrl', GameAddAdminCtrl)
	.controller('GameEditAdminCtrl', GameEditAdminCtrl)
	.directive('filterDecade', filterDecade)
	.directive('filterManufacturer', filterManufacturer)
	.filter('gametype', gameTypeFilter)
	.filter('ratingFormat', ratingFormatFilter)
	.constant('GameSystems', GameSystems)
	.name;