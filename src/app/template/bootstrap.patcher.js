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