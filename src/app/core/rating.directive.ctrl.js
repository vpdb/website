export default class RatingDirectiveCtrl {

	/**
	 * @param $scope
	 * @param $element
	 * @param $attrs
	 * @param $parse
	 * @ngInject
	 */
	constructor($scope, $element, $attrs, $parse) {

		this.ratingAvg = $parse($attrs.ratingAvg);
		this.ratingUser = $parse($attrs.ratingUser);
		this.ratingAction = $parse($attrs.ratingAction);
		this.readOnly = $parse($attrs.ratingReadonly)($scope);

		this.$scope = $scope;

		if (this.readOnly) {
			$element.addClass('readonly');
		}

		// init: read average rating
		$scope.$watch(this.ratingAvg, rating => {
			if (rating && !this.boxHovering) {
				this.rating = rating;
				this.value = rating;
			}
		});

		// init: read number of votes
		$scope.$watch($parse($attrs.ratingVotes), votes => {
			if (votes) {
				this.ratingVotes = votes;
			}
		});
	}

	/**
	 * Cursor enters rating box.
	 *
	 * => Display the user's rating
	 */
	editStart() {
		if (this.readOnly) {
			return;
		}
		const rating = this.ratingUser(this.$scope);
		this.boxHovering = true;
		this.rating = rating;
		this.value = rating;
	}

	/**
	 * Cursor leaves rating box.
	 *
	 * => Display average rating
	 */
	editEnd() {
		if (this.readOnly) {
			return;
		}
		const rating = this.ratingAvg(this.$scope);
		this.boxHovering = false;
		this.rating = rating;
		this.value = rating;
	}

	/**
	 * Cursor enters stars.
	 *
	 * => Display hovered rating.
	 *
	 * @param {int} value Star value (1-10)
	 */
	rateStart(value) {
		if (this.readOnly) {
			return;
		}
		this.starHovering = true;
		this.value = value;
		this.rating = value;
	}

	/**
	 * Cursor leaves stars
	 *
	 * => Display user rating
	 */
	rateEnd() {
		if (this.readOnly) {
			return;
		}
		const rating = this.ratingUser(this.$scope);
		this.starHovering = false;
		this.rating = rating;
		this.value = rating;
	}

	// a star has been clicked
	rate() {
		if (this.readOnly) {
			return;
		}
		this.$scope.$rating = this.value;
		this.ratingAction(this.$scope);
	}
}