import { filter } from 'lodash';

export default class AuthorSelectModalCtrl {

	/**
	 * @param $uibModalInstance
	 * @param UserResource
	 * @param subject
	 * @param meta
	 * @param author
	 * @ngInject
	 */
	constructor($uibModalInstance, UserResource, subject, meta, author) {

		this.$uibModalInstance = $uibModalInstance;
		this.UserResource = UserResource;

		if (author) {
			const userId = author._user || author.user.id;
			this.author = author;
			this.user = meta.users[userId];
			this.roles = author.roles.slice();
			this.query = meta.users[userId].name;
			this.isValidUser = true;

		} else {
			this.user = null;
			this.roles = [];
			this.isValidUser = false;
		}
		this.adding = !author;
		this.errors = {};
		this.subject = subject;
		this.role = '';
		this.searching = false;

	}

	findUser(val) {
		return this.UserResource.query({ q: val }).$promise;
	}

	userSelected(item, model) {
		this.user = model;
		this.isValidUser = true;
	}

	queryChange() {
		this.isValidUser = false;
	}

	addRole(role) {
		if (role && !~this.roles.indexOf(role)) {
			this.roles.push(role);
		}
		this.role = '';
	}

	removeRole(role) {
		this.roles.splice(this.roles.indexOf(role), 1);
	}

	add() {
		this.addRole(this.role);

		let valid = true;

		// user validations
		if (!this.isValidUser) {
			this.errors.user = 'You must select an existing user. Typing after selecting a user erases the selected user.';
			valid = false;
		} else if (filter(this.subject.authors, author => author._user === this.user.id).length > 0 &&
			(this.adding || this.user.id !== this.author._user)) {
			this.errors.user = 'User "' + this.user.name + '" is already added as author.';
			valid = false;
		} else {
			delete this.errors.user;
		}

		// scope validations
		if (this.roles.length === 0) {
			this.errors.roles = 'Please add at least one role.';
			valid = false;
		} else if (this.roles.length > 3) {
			this.errors.roles = 'Three is the maxmimal number of roles an author can have. Please group roles if that\'s not enough.';
			valid = false;
		} else {
			delete this.errors.roles;
		}

		if (valid) {
			this.$uibModalInstance.close({ user: this.user, roles: this.roles });
		}
	}
}