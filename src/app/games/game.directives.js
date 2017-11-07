import { includes } from 'lodash';

export function filterDecade() {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			if (includes(scope.filterDecades, parseInt(attrs.filterDecade))) {
				element.addClass('active');
			}
			element.on('click', () => {
				element.toggleClass('active');
				scope.$emit('dataToggleDecade', parseInt(attrs.filterDecade), element.hasClass('active'));
			});
		}
	};
}

export function filterManufacturer() {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			if (includes(scope.filterManufacturer, attrs.filterManufacturer)) {
				element.addClass('active');
			}
			element.on('click', () => {
				element.toggleClass('active');
				scope.$emit('dataToggleManufacturer', attrs.filterManufacturer, element.hasClass('active'));
			});
		}
	};
}
