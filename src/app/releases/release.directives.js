import { includes } from 'lodash';

/**
 * @ngInject
 */
export function filterBuild() {
	return {
		restrict: 'A',
		scope: { filterBuilds: '=ngModel' },
		link: function(scope, element, attrs) {
			const buildId = attrs.filterBuild;
			if (includes(scope.filterBuilds, buildId)) {
				element.addClass('active');
			}
			element.click(function() {
				element.toggleClass('active');
				if (includes(scope.filterBuilds, buildId)) {
					scope.filterBuilds.splice(scope.filterBuilds.indexOf(buildId), 1);
				} else {
					scope.filterBuilds.push(buildId);
				}
				scope.$apply();
			});
		}
	};
}