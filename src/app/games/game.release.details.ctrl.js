import { orderBy, compact, map } from 'lodash';

/**
 * The release view within the game details view.
 *
 * @author freezy <freezy@vpdb.io>
 */
export default class GameReleaseDetailsCtrl {

	/**
	 * @param $scope
	 * @param {App} App
	 * @param {ReleaseService} ReleaseService
	 * @ngInject
	 */
	constructor($scope, App, ReleaseService) {

		// setup releases
		$scope.$watch('release', release => {

			// sort versions
			this.releaseVersions = orderBy(release.versions, 'released_at', false);
			this.latestVersion = this.releaseVersions[0];
			this.flavorGrid = ReleaseService.flavorGrid(release);

			// get latest shots
			this.shot = orderBy(compact(map(this.latestVersion.files, file => {
				if (!file.playfield_image) {
					return null;
				}
				return {
					type: file.playfield_image.file_type,
					url: file.playfield_image.variations[App.pixelSuffix('medium')].url,
					full: file.playfield_image.variations.full.url
				};
			})), 'type', true)[0];
		});
	}
}