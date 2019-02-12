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

export default class TopBadgeDirectiveCtrl {

	/**
	 * @param $scope
	 * @ngInject
	 */
	constructor($scope) {
		$scope.$watch('ranks', ranks => {
			if (ranks && ranks.length > 0) {
				this.hasRank = ranks;
				this.rank = Math.min.apply(null, ranks);
				if (this.rank <= 10) {
					this.top = 10;
					this.place = 'gold';
				} else if (this.rank <= 100) {
					this.top = 100;
					this.place = 'silver';
				} else {
					this.top = 300;
					this.place = 'bronze';
				}
			}
		});
	}
}