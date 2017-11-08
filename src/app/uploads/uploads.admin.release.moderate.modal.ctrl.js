import { map } from 'lodash';

export default class UploadsAdminReleaseModerateModalCtrl {

	/**
	 * Class constructor
	 * @param $uibModalInstance
	 * @param {App} App
	 * @param {ApiHelper} ApiHelper
	 * @param {UploadHelper} UploadHelper
	 * @param {ReleaseResource} ReleaseResource
	 * @param {ReleaseModerationResource} ReleaseModerationResource
	 * @param {FileBlockmatchResource} FileBlockmatchResource
	 * @param {ReleaseModerationCommentResource} ReleaseModerationCommentResource
	 * @param {ModalService} ModalService
	 * @param params
	 */
	constructor($uibModalInstance, App, ApiHelper, UploadHelper,
				ReleaseResource, ReleaseModerationResource, FileBlockmatchResource,
				ReleaseModerationCommentResource, ModalService, params) {

		this.$uibModalInstance = $uibModalInstance;
		this.App = App;
		this.ApiHelper = ApiHelper;
		this.ModalService = ModalService;
		this.ReleaseModerationResource = ReleaseModerationResource;
		this.ReleaseModerationCommentResource = ReleaseModerationCommentResource;
		this.refresh = params.refresh;

		this.files = [];
		this.release = ReleaseResource.get({ release: params.release.id, fields: 'moderation' }, release => {
			this.comments = ReleaseModerationCommentResource.query({ releaseId: release.id });
			this.history = map(release.moderation.history, UploadHelper.mapHistory);
			release.versions.forEach(version => {
				version.files.forEach(file => {
					file.blockmatches = FileBlockmatchResource.get({ id: file.file.id }, b => {
						if (b.matches.length > 0) {
							this.files.push(file);
						}
					});
				});
			});
		});
	}

	blockmatchInfo() {
		this.ModalService.info({
			title: 'Similar releases',
			message: 'Visual Pinball table files are made out of blocks. Every, image, sound or object is a block. ' +
			'When a table file is uploaded, VPDB saves the checksum and size of every block to a heavily indexed ' +
			'table in the database.<br>' +
			'What you see listed under "Similar releases" are table files of other releases that have lots ' +
			'of the same blocks.<ul>' +
			'<li>The "Objects" bar indicates how many blocks are in common. For example, if a table file with ' +
			'3,000 blocks has a 75% object match, that means 2,250 blocks are identical.</li>' +
			'<li>The "Bytes" bar indicates how much of the actual data the table file has in common. For example, ' +
			'a 60 MB file with 50% bytes match means that 30 MB are identical with the table file you\'re ' +
			'reviewing.</li></ul>' +
			'Generally, two observerations can be made: High bytes match and low object match means that the table ' +
			'has been heavily tweaked, while size-heavy assets such as textures and 3D models have been kept the ' +
			'same.<br>On the other hand, a high object match and low bytes match indicates that mainly assets have ' +
			'been replaced while leaving the rest intact.<br><br>' +
			'As a moderator, you should make sure that in case of a match, the uploader has properly credited the ' +
			'original work, either as co-authors or in the acknowledgements.'
		});
	}

	refuse() {
		this.submitting = true;
		this.ReleaseModerationResource.save({ releaseId: this.release.id }, { action: 'refuse', message: this.message }, () => {
			this.submitting = false;
			this.message = '';
			this.$uibModalInstance.close();
			this.App.showNotification('Release "' + this.release.name + '" successfully refused.');
			this.refresh();
		}, this.ApiHelper.handleErrors(this));
	};

	approve() {
		this.submitting = true;
		this.ReleaseModerationResource.save({ releaseId: this.release.id }, { action: 'approve', message: this.message }, () => {
			this.submitting = false;
			this.message = '';
			this.$uibModalInstance.close();
			this.App.showNotification('Release "' + this.release.name + '" successfully approved.');
			this.refresh();
		}, this.ApiHelper.handleErrors(this));
	}

	moderate() {
		this.submitting = true;
		this.ReleaseModerationResource.save({ releaseId: this.release.id }, { action: 'moderate', message: this.message }, () => {
			this.submitting = false;
			this.message = '';
			this.$uibModalInstance.close();
			this.App.showNotification('Release "' + this.release.name + '" successfully set back to pending.');
			this.refresh();

		}, this.ApiHelper.handleErrors(this));
	}

	sendMessage() {
		this.loading = true;
		this.ReleaseModerationCommentResource.save({ releaseId: this.release.id }, { message: this.message }, comment => {
			this.loading = false;
			this.comments.unshift(comment);
			this.message = '';
		}, this.ApiHelper.handleErrors(this));
	}
}