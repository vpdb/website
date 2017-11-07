import { min } from 'lodash';
const topBadgeTpl = require('./top-badge.directive.pug');

export default function() {
	return {
		restrict: 'E',
		scope: {
			ranks: '=ngModel',
			site: '@',
			href: '@'
		},
		replace: true,
		template: topBadgeTpl,
		controller: function($scope) {

			$scope.$watch('ranks', function(ranks) {
				if (ranks && ranks.length > 0) {
					$scope.hasRank = $scope.ranks;
					$scope.rank = min(ranks);
					if ($scope.rank <= 10) {
						$scope.top = 10;
						$scope.place = 'gold';
					} else if ($scope.rank <= 100) {
						$scope.top = 100;
						$scope.place = 'silver';
					} else {
						$scope.top = 300;
						$scope.place = 'bronze';
					}
				}
			});
		}
	};
}