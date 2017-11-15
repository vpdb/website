import UploadsBackglassModerateAdminModalTpl from './uploads.backglass.moderate.admin.modal.pug';

export default class UploadsBackglassListAdminCtrl {

	/**
	 * Class constructor
	 * @param $scope
	 * @param $uibModal
	 * @param {ApiHelper} ApiHelper
	 * @param {UploadHelper} UploadHelper
	 * @param BackglassResource
	 */
	constructor($scope, $uibModal, ApiHelper, UploadHelper, BackglassResource) {

		this.$scope = $scope;
		this.$uibModal = $uibModal;
		this.ApiHelper = ApiHelper;
		this.UploadHelper = UploadHelper;
		this.BackglassResource = BackglassResource;

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
		this.backglasses = this.BackglassResource.query(query, this.ApiHelper.handlePagination(this, { loader: true }, backglasses => {
			backglasses.forEach(this.UploadHelper.addIcons);
		}));
	}

	moderateBackglass(backglass) {
		this.$uibModal.open({
			templateUrl: UploadsBackglassModerateAdminModalTpl,
			controller: 'UploadsBackglassModerateAdminModalCtrl',
			controllerAs: 'vm',
			size: 'md',
			resolve: {
				params: () => {
					return {
						backglass: backglass,
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