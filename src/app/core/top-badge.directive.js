import TopBadgeDirectiveTpl from './top-badge.directive.pug';

/**
 * @ngInject
 */
export default function() {
	return {
		restrict: 'E',
		scope: {
			ranks: '=ngModel',
			site: '@',
			href: '@'
		},
		replace: true,
		templateUrl: TopBadgeDirectiveTpl,
		controller: 'TopBadgeDirectiveCtrl',
		controllerAs: 'vm'
	};
}