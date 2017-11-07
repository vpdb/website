const editorTpl = require('./editor.directive.pug')();

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
		template: editorTpl,
		controller: 'EditorCtrl',
		controllerAs: 'vm'
	};
}