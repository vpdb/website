export function gameTypeFilter() {
	return function(type) {
		if (type) {
			switch (type.toLowerCase()) {
				case 'ss':
					return 'Solid-State Game';
				case 'em':
					return 'Electro-Mechanical Game';
				case 'pm':
					return 'Pure Mechanical';
				case 'og':
					return 'Original Game';
				default:
					return type;
			}
		} else {
			return 'Undefined';
		}
	};
}

export function ratingFormatFilter() {
	return function(rating) {
		rating = parseFloat(rating);
		if (!rating) {
			return ' — ';
		}
		if (rating % 1 === 0 && rating < 10) {
			return rating + '.0';
		} else {
			return Math.round(rating * 10) / 10;
		}
	};
}