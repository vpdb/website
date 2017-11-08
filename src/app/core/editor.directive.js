import EditorTpl from './editor.directive.pug';

/**
 * The editor with markdown preview.
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
		templateUrl: EditorTpl,
		controller: 'EditorCtrl',
		controllerAs: 'vm'
	};
}