import { min } from 'lodash';

export default class TopBadgeDirectiveCtrl {

	/**
	 * @param $scope
	 * @ngInject
	 */
	constructor($scope) {
		$scope.$watch('ranks', ranks => {
			if (ranks && ranks.length > 0) {
				this.hasRank = ranks;
				this.rank = min(ranks);
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