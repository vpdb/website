import EditorDirectiveTpl from './editor.directive.pug';

/**
 * The editor with markdown preview.
 * @ngInject
 */
export default function() {
	return {
		restrict: 'E',
		scope: {
			text: '=ngModel',
			user: '=',
			placeholder: '@',
			markdownText: '@'
		},
		replace: true,
		templateUrl: EditorDirectiveTpl,
		controller: 'EditorDirectiveCtrl',
		controllerAs: 'vm'
	};
}