import { includes } from 'lodash';

/**
 * @ngInject
 */
export function filterDecade() {
	return {
		restrict: 'A',
		scope: { filterDecades: '=ngModel' },
		link: function(scope, element, attrs) {
			const decade = parseInt(attrs.filterDecade, 10);
			if (includes(scope.filterDecades, decade)) {
				element.addClass('active');
			}
			element.on('click', () => {
				element.toggleClass('active');
				if (includes(scope.filterDecades, decade)) {
					scope.filterDecades.splice(scope.filterDecades.indexOf(decade), 1);
				} else {
					scope.filterDecades.push(decade);
				}
				scope.$apply();
			});
		}
	};
}

/**
 * @ngInject
 */
export function filterManufacturer() {
	return {
		restrict: 'A',
		scope: { filterManufacturer: '=ngModel' },
		link: function(scope, element, attrs) {
			const mfg = attrs.filterManufacturer;
			if (includes(scope.filterManufacturer, mfg)) {
				element.addClass('active');
			}
			element.on('click', () => {
				element.toggleClass('active');
				if (includes(scope.filterManufacturer, mfg)) {
					scope.filterManufacturer.splice(scope.filterManufacturer.indexOf(mfg), 1);
				} else {
					scope.filterManufacturer.push(mfg);
				}
				scope.$apply();
			});
		}
	};
}
