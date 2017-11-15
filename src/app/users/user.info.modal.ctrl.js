export default class UserInfoModalCtrl {

	/**
	 * Class constructor
	 * @param {ModalService} ModalService
	 * @param UserResource
	 * @param UserStarResource
	 * @param username
	 */
	constructor(ModalService, UserResource, UserStarResource, username) {

		this.UserStarResource = UserStarResource;
		this.ModalService = ModalService;

		this.username = username.replace(/\.$/g, '');
		this.user = null;

		UserResource.query({ name: this.username }, users => {
			this.user = users.length ? users[0] : {};
			if (this.user.id) {
				UserStarResource.get({ userId: this.user.id }).$promise.then(() => {
					this.starred = true;
				}, () => {
					this.starred = false;
				});
			}
		});
	}

	toggleStar() {
		const err = err => {
			if (err.data && err.data.error) {
				this.ModalService.error({
					subtitle: 'Error starring user.',
					message: err.data.error
				});
			} else {
				console.error(err);
			}
		};
		if (this.starred) {
			this.UserStarResource.delete({ userId: this.user.id }, {}, () => {
				this.starred = false;
				this.user.counter.stars--;
			}, err);

		} else {
			this.UserStarResource.save({ userId: this.user.id }, {}, result => {
				this.starred = true;
				this.user.counter.stars = result.total_stars;
			}, err);
		}
	}
}