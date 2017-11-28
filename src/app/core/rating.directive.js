import RatingDirectiveTpl from './rating.directive.pug';

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
			elem.mouseenter(function(e) {
				e.preventDefault();
				ctrl.editStart();
				scope.$apply();
			});
			elem.mouseleave(function(e) {
				e.preventDefault();
				ctrl.editEnd();
				scope.$apply();
			});
			$animate.enabled(elem, false);
		},
		controller: 'RatingDirectiveCtrl',
		controllerAs: 'ratingVm'
	};
}