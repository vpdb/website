import $ from 'jquery';
import angular from 'angular';
import Showdown from 'showdown';
import { includes } from 'lodash';

/**
 * @ngInject
 */
export function onEnter() {
	return {
		link: function(scope, element, attrs) {
			element.bind("keypress", function (event) {
				if (event.which === 13) {
					scope.$apply(function () {
						scope.$eval(attrs.onEnter);
					});
					event.preventDefault();
				}
			});
		}
	};
}

/**
 * @ngInject
 */
export function focusOn() {
	return function(scope, elem, attr) {
		elem[0].focus();
	};
}

/**
 * @ngInject
 */
export function fallbackIcon() {
	return {
		link: function postLink(scope, element, attrs) {
			element.bind('error', function() {
				angular.element(this).replaceWith('<svg class="svg-icon ' + attrs.class + '"><use xlink:href="#icon-' + attrs.fallbackIcon + '"></use></svg>');
			});
		}
	};
}

/**
 * @param $filter
 * @param $sce
 * @ngInject
 */
export function jsonLd($filter, $sce) {
	return {
		restrict: 'E',
		template: function() {
			return '<script type="application/ld+json" ng-bind-html="onGetJson()"></script>';
		},
		scope: {
			json: '=json'
		},
		link: function(scope, element, attrs) {
			scope.onGetJson = function() {
				return $sce.trustAsHtml($filter('json')(scope.json));
			}
		},
		replace: true
	};
}

/**
 * @param $sanitize
 * @param $compile
 * @ngInject
 */
export function markdown($sanitize, $compile) {
	const converter = new Showdown.Converter();
	return {
		restrict: 'AE',
		link: function(scope, element, attrs) {
			const linkUsers = html => {
				return html.replace(/@&#3[49];([a-z0-9 ]+)&#3[49];/gi, '<user>$1</user>').replace(/@([a-z0-9]+)/gi, '<user>$1</user>');
			};
			if (attrs.markdown) {
				scope.$watch(attrs.markdown, newVal => {
					const html = newVal ? $sanitize(converter.makeHtml(newVal)) : '';
					element.html(linkUsers(html));
					$compile(element.contents())(scope);
				});
			} else {
				let mdText = element.text().replace(/^\s*[\n\r]+/g, '');
				const firstIdent = mdText.match(/^\s+/);
				mdText = ('\n' + mdText).replace(new RegExp('[\\n\\r]' + firstIdent, 'g'), '\n');
				const html = $sanitize(converter.makeHtml(mdText));
				element.html(linkUsers(html));
				$compile(element.contents())(scope);
			}
		}
	};
}

/**
 * Updates the given model with the selected value.
 *
 * The example shows Two values `title` and `popularity` bound to the
 * `vm.query.sort` model. When clicked, the value direction is `asc`
 * for `title` and `desc` for `popularity.
 *
 * @example
 * <li> <a sort="title" sort-default="asc" ng-model="vm.query.sort">Title</a></li>
 * <li> <a sort="popularity" sort-default="desc" ng-model="vm.query.sort">Popularity</a></li>
 * @ngInject
 */
export function sort() {
	return {
		restrict: 'A',
		scope: { sortModel: '=ngModel' },
		link: function(scope, element, attrs) {
			const currentSort = scope.sortModel[0] === '-' ? scope.sortModel.substr(1) : scope.sortModel;
			element = $(element);
			if (currentSort === attrs.sort) {
				element.addClass('selected');
			}
			if (scope.sortModel[0] === '-') {
				element.removeClass('asc');
				element.addClass('desc');
			} else {
				element.addClass('asc');
				element.removeClass('desc');
			}
			element.on('click', () => {
				if (element.hasClass('selected')) {
					element.toggleClass('asc');
					element.toggleClass('desc');
				} else {
					element.siblings().removeClass('selected');
					element.addClass('selected');
					element.addClass('asc');
					if (attrs.sortDefault === 'asc') {
						element.addClass('asc');
						element.removeClass('desc');
					} else {
						element.removeClass('asc');
						element.addClass('desc');
					}
				}
				scope.sortModel = (element.hasClass('asc') ? '' : '-') + attrs.sort;
				scope.$apply();
			});
		}
	};
}

/**
 * Toggles a value in an array.
 *
 * The example adds "dof" in the `vm.query.filterTags` array when the user
 * clicks on the div if it's not there or otherwise removes it.
 *
 * @example
 *  <div filter-array="dof" ng-model="vm.query.filterTags">DOF</div>
 * @ngInject
 */
export function filterArray() {
	return {
		restrict: 'A',
		scope: { filterObjects: '=ngModel' },
		link: function(scope, element, attrs) {
			const objectId = attrs.filterArray;
			if (includes(scope.filterObjects, objectId)) {
				element.addClass('active');
			}
			element.click(function() {
				element.toggleClass('active');
				if (includes(scope.filterObjects, objectId)) {
					scope.filterObjects.splice(scope.filterObjects.indexOf(objectId), 1);
				} else {
					scope.filterObjects.push(objectId);
				}
				scope.$apply();
			});
		}
	};
}