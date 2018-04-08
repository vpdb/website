/*
 * VPDB - Virtual Pinball Database
 * Copyright (C) 2018 freezy <freezy@vpdb.io>
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.
 */

import RatingDirectiveTpl from './rating.directive.pug';
import RatingDirectiveCtrl from './rating.directive.ctrl';

/**
 * The rating box for releases and games.
 *
 * Use like this:
 *
 *  rating-avg="game.rating.average",
 *  rating-votes="game.rating.votes",
 *  rating-user="gameRating"
 *  rating-action="rateGame($rating)"
 *
 * @param $animate
 * @ngInject
 */
export default function($animate) {
	return {
		restrict: 'C',
		scope: {
			ratingAvg: '=',
			ratingVotes: '=',
			ratingUser: '=',
			ratingAction: '&',
			ratingReadonly: '@'
		},
		templateUrl: RatingDirectiveTpl,
		link: function(scope, elem, attr, ctrl) {
			elem.on('mouseenter', e => {
				e.preventDefault();
				ctrl.editStart();
				scope.$apply();
			});
			elem.on('mouseleave', e => {
				e.preventDefault();
				ctrl.editEnd();
				scope.$apply();
			});
			$animate.enabled(elem, false);
		},
		controller: RatingDirectiveCtrl,
		controllerAs: 'ratingVm'
	};
}
