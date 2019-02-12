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

export default class RatingDirectiveCtrl {

	/**
	 * @param $scope
	 * @param $element
	 * @ngInject
	 */
	constructor($scope, $element) {

		this.$scope = $scope;

		// read user rating
		$scope.$watch('ratingReadonly', () => {
			this.readOnly = $scope.ratingReadonly === 'true';
			if (!this.readOnly) {
				$element.removeClass('readonly');
			} else {
				$element.addClass('readonly');
			}
		});

		// read average rating
		$scope.$watch('ratingAvg', rating => {
			if (rating && !this.boxHovering) {
				this.rating = rating;
				this.value = rating;
			}
		});

		// read number of votes
		$scope.$watch('ratingVotes', votes => {
			if (votes) {
				this.numVotes = votes;
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
		const rating = this.$scope.ratingUser;
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
		const rating = this.$scope.ratingAvg;
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
		const rating = this.$scope.ratingUser;
		this.starHovering = false;
		this.rating = rating;
		this.value = rating;
	}

	// a star has been clicked
	rate() {
		if (this.readOnly) {
			return;
		}
		this.$scope.ratingAction({ $rating: this.value });
	}
}