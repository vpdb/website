const moderateModalTpl = require('./uploads.admin.release.moderate.modal.pug')();

export default class UploadsAdminReleaseListCtrl {

	/**
	 * @param $scope
	 * @param $uibModal
	 * @param {ApiHelper} ApiHelper
	 * @param {UploadHelper} UploadHelper
	 * @param {ReleaseResource} ReleaseResource
	 */
	constructor($scope, $uibModal, ApiHelper, UploadHelper, ReleaseResource) {

		this.$scope = $scope;
		this.$uibModal = $uibModal;
		this.ApiHelper = ApiHelper;
		this.UploadHelper = UploadHelper;
		this.ReleaseResource = ReleaseResource;

		$scope.$on('refresh', this.refresh.bind(this));
		this.refresh();
	}

	refresh(query) {
		query = query || {
			moderation: this.$scope.filters.status,
			fields: 'moderation',
			sort: 'modified_at',
			per_page: this.$scope.numItems
		};
		this.releases = this.ReleaseResource.query(query, this.ApiHelper.handlePagination(this, { loader: true }, releases => {
			releases.forEach(this.UploadHelper.addIcons);
		}));
	}

	moderateRelease(release) {
		this.$uibModal.open({
			template: moderateModalTpl,
			controller: 'AdminModerateReleaseModalCtrl',
			controllerAs: 'vm',
			size: 'md',
			resolve: {
				params: () => {
					return {
						release: release,
						refresh: this.refresh.bind(this)
					};
				}
			}
		});
	}

	paginate(link) {
		this.refresh(link.query);
	}
}