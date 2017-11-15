export default function(ModalService) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			const icon = '<svg class="svg-icon space-right shift-up"><use xlink:href="#icon-markdown"></use></svg>';
			element.html(icon + attrs.markdownInfo.replace(/markdown/gi, '<a href="#" ng-click="markdownInfo()">Markdown</a>'));
			element.find('a').click(function() {
				ModalService.markdown();
			});
		}
	};
}