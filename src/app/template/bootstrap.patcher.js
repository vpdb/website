/*
 * VPDB - Virtual Pinball Database
 * Copyright (C) 2018 freezy <freezy@vpdb.io>
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

export default class BootstrapPatcher {

	/**
	 * @param $templateCache
	 * @ngInject
	 */
	constructor($templateCache) {
		this.$templateCache = $templateCache;
	}

	patchCalendar() {
		// monkey patch template so it takes svgs instead of glyphicons.
		let dayTpl = this.$templateCache.get('uib/template/datepicker/day.html');
		if (/<i class="glyphicon/.test(dayTpl)) {

			let monthTpl = this.$templateCache.get('uib/template/datepicker/month.html');
			let yearTpl = this.$templateCache.get('uib/template/datepicker/year.html');

			dayTpl = dayTpl.replace(/<i class="glyphicon glyphicon-chevron-left">/, this.svg('arrow-left'));
			dayTpl = dayTpl.replace(/<i class="glyphicon glyphicon-chevron-right">/, this.svg('arrow-right'));

			monthTpl = monthTpl.replace(/<i class="glyphicon glyphicon-chevron-right">/, this.svg('arrow-right'));
			monthTpl = monthTpl.replace(/<i class="glyphicon glyphicon-chevron-left">/, this.svg('arrow-left'));

			yearTpl = yearTpl.replace(/<i class="glyphicon glyphicon-chevron-right">/, this.svg('arrow-right'));
			yearTpl = yearTpl.replace(/<i class="glyphicon glyphicon-chevron-left">/, this.svg('arrow-left'));

			this.$templateCache.put('uib/template/datepicker/day.html', dayTpl);
			this.$templateCache.put('uib/template/datepicker/month.html', monthTpl);
			this.$templateCache.put('uib/template/datepicker/year.html', yearTpl);
		}
	}

	patchCarousel() {
		const tplId = 'uib/template/carousel/carousel.html';
		let tpl = this.$templateCache.get(tplId);
		tpl = tpl.replace('<span aria-hidden="true" class="glyphicon glyphicon-chevron-left"></span>', this.svg('angle-left'));
		tpl = tpl.replace('<span aria-hidden="true" class="glyphicon glyphicon-chevron-right"></span>', this.svg('angle-right'));
		this.$templateCache.put(tplId, tpl);
	}

	svg(name) {
		return '<svg class="svg-icon"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#' + name + '"></use></svg>';
	}
}