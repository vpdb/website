/*
 * VPDB - Virtual Pinball Database
 * Copyright (C) 2019 freezy <freezy@vpdb.io>
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.
 */

/**
 * @param ModalService
 * @return {{restrict: string, link: link}}
 * @ngInject
 */
export default function(ModalService) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			const icon = '<svg class="svg-icon space-right shift-up"><use xlink:href="#icon-markdown"></use></svg>';
			element.html(icon + attrs.markdownInfo.replace(/markdown/gi, '<a href="#" ng-click="markdownInfo()">Markdown</a>'));
			element.find('a').on('click', () => {
				ModalService.markdown();
			});
		}
	};
}