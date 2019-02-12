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

import Showdown from 'showdown';

/**
 * Renders a given text as Markdown.
 * @param $sanitize
 * @param $compile
 * @ngInject
 */
export default function markdown($sanitize, $compile) {
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
