/**
 * @ngInject
 */
export default function() {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			element.click(function() {
				element.toggleClass('active');
				scope.$emit('dataToggleRole', attrs.filterRole, element.hasClass('active'));
			});
		}
	};
}