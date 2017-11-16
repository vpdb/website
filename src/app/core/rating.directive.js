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
 * @param $parse
 * @param $animate
 * @ngInject
 */
export default function($parse, $animate) {
	return {
		restrict: 'C',
		scope: true,
		templateUrl: RatingDirectiveTpl,
		link: function(scope, elem) {
			elem.mouseenter(function(e) {
				e.preventDefault();
				scope.editStart();
				scope.$apply();
			});
			elem.mouseleave(function(e) {
				e.preventDefault();
				scope.editEnd();
				scope.$apply();
			});
			$animate.enabled(elem, false);
		},
		controller: function($scope, $element, $attrs) {
			const ratingAvg = $parse($attrs.ratingAvg);
			const ratingUser = $parse($attrs.ratingUser);
			const readOnly = $parse($attrs.ratingReadonly)($scope);

			if (readOnly) {
				$element.addClass('readonly');
			}

			// init: read average rating
			$scope.$watch(ratingAvg, function(rating) {
				if (rating && !$scope.boxHovering) {
					$scope.rating = rating;
					$scope.value = rating;
				}
			});

			// init: read number of votes
			$scope.$watch($parse($attrs.ratingVotes), function(votes) {
				if (votes) {
					$scope.ratingVotes = votes;
				}
			});

			/**
			 * Cursor enters rating box.
			 *
			 * => Display the user's rating
			 */
			$scope.editStart = function() {
				if (readOnly) {
					return;
				}
				const rating = ratingUser($scope);
				$scope.boxHovering = true;
				$scope.rating = rating;
				$scope.value = rating;
			};

			/**
			 * Cursor leaves rating box.
			 *
			 * => Display average rating
			 */
			$scope.editEnd = function() {
				if (readOnly) {
					return;
				}
				const rating = ratingAvg($scope);
				$scope.boxHovering = false;
				$scope.rating = rating;
				$scope.value = rating;
			};

			/**
			 * Cursor enters stars.
			 *
			 * => Display hovered rating.
			 *
			 * @param {int} value Star value (1-10)
			 */
			$scope.rateStart = function(value) {
				if (readOnly) {
					return;
				}
				if (!$scope.readonly) {
					$scope.starHovering = true;
					$scope.value = value;
					$scope.rating = value;
				}
			};

			/**
			 * Cursor leaves stars
			 *
			 * => Display user rating
			 */
			$scope.rateEnd = function() {
				if (readOnly) {
					return;
				}
				const rating = ratingUser($scope);
				$scope.starHovering = false;
				$scope.rating = rating;
				$scope.value = rating;
			};

			// a star has been clicked
			$scope.rate = function() {
				if (readOnly) {
					return;
				}
				$scope.$rating = $scope.value;
				$parse($attrs.ratingAction)($scope)
			};
		}
	};
}