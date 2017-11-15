export default class BootstrapPatcher {

	constructor($templateCache) {
		this.$templateCache = $templateCache;
	}

	patchCalendar() {
		// monkey patch template so it takes svgs instead of glyphicons.
		let dayTpl = this.$templateCache.get('template/datepicker/day.html');
		if (/<i class="glyphicon/.test(dayTpl)) {

			let monthTpl = this.$templateCache.get('template/datepicker/month.html');
			let yearTpl = this.$templateCache.get('template/datepicker/year.html');

			dayTpl = dayTpl.replace(/<i class="glyphicon glyphicon-chevron-left">/, '<svg class="svg-icon"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-arrow-left"></use></svg>');
			dayTpl = dayTpl.replace(/<i class="glyphicon glyphicon-chevron-right">/, '<svg class="svg-icon"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-arrow-right"></use></svg>');

			monthTpl = monthTpl.replace(/<i class="glyphicon glyphicon-chevron-right">/, '<svg class="svg-icon"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-arrow-right"></use></svg>');
			monthTpl = monthTpl.replace(/<i class="glyphicon glyphicon-chevron-left">/, '<svg class="svg-icon"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-arrow-left"></use></svg>');

			yearTpl = yearTpl.replace(/<i class="glyphicon glyphicon-chevron-right">/, '<svg class="svg-icon"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-arrow-right"></use></svg>');
			yearTpl = yearTpl.replace(/<i class="glyphicon glyphicon-chevron-left">/, '<svg class="svg-icon"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-arrow-left"></use></svg>');

			this.$templateCache.put('template/datepicker/day.html', dayTpl);
			this.$templateCache.put('template/datepicker/month.html', monthTpl);
			this.$templateCache.put('template/datepicker/year.html', yearTpl);
		}
	}
}