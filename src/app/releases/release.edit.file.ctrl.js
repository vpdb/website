/*
 * VPDB - Virtual Pinball Database
 * Copyright (C) 2018 freezy <freezy@vpdb.io>
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

import { includes, filter, map, pick, cloneDeep, assign, find } from 'lodash';
import AuthorSelectModalTpl from '../users/author.select.modal.pug';
import TagAddModalTpl from '../tag/tag.add.modal.pug';
import ReleaseEditVersionModalTpl from './release.edit.version.modal.ctrl';

export default class ReleaseEditFileCtrl {
	/**
	 * @param $state
	 * @param $stateParams
	 * @param $uibModal
	 * @param {App} App
	 * @param {ApiHelper} ApiHelper
	 * @param {AuthService} AuthService
	 * @param {Flavors} Flavors
	 * @param {TrackerService} TrackerService
	 * @param GameResource
	 * @param ReleaseResource
	 * @param TagResource
	 * @ngInject
	 */
	constructor($state, $stateParams, $uibModal,
				App, ApiHelper, AuthService, Flavors, TrackerService,
				GameResource, ReleaseResource, TagResource) {

		App.theme('light');
		App.setTitle('Edit Release');
		App.setMenu('releases');
		TrackerService.trackPage();

		this.$state = $state;
		this.$uibModal = $uibModal;
		this.App = App;
		this.AuthService = AuthService;
		this.ApiHelper = ApiHelper;
		this.Flavors = Flavors;

		this.ReleaseResource = ReleaseResource;
		this.gameId = $stateParams.id;
		this.releaseId = $stateParams.releaseId;
		this.newLink = {};
		this.editAuthors = false;

		this.game = GameResource.get({ id: this.gameId });
		this.release = ReleaseResource.get({ release: this.releaseId }, release => {

			this.reset();
			this.tags = TagResource.query(() => {
				if (release && release.tags.length > 0) {
					// only push tags that aren't assigned yet.
					this.tags = filter(this.tags, tag => !includes(map(release.tags, 'id'), tag.id));
				}
			});
			if (AuthService.isAuthenticated) {
				this.editAuthors = AuthService.getUser().id === release.created_by.id;
			}
		});
	}

	/**
	 * Resets the data to current release.
	 */
	reset() {
		this.updatedRelease = pick(cloneDeep(this.release), [ 'name', 'description', 'tags', 'links', 'acknowledgements', 'authors' ]);
		this.errors = {};
	}

	/**
	 * Adds OR edits an author.
	 * @param {object} author If set, edit this author, otherwise add a new one.
	 */
	addAuthor(author) {
		const meta = { users: {} };
		if (author) {
			meta.users[author.user.id] = author.user;
		}
		this.$uibModal.open({
			templateUrl: AuthorSelectModalTpl,
			controller: 'AuthorSelectModalCtrl',
			controllerAs: 'vm',
			resolve: {
				subject: () => this.updatedRelease,
				meta: () => meta,
				author: () => author
			}
		}).result.then(newAuthor => {
			// add or edit?
			if (author) {
				this.updatedRelease.authors[this.updatedRelease.authors.indexOf(author)] = newAuthor;
			} else {
				this.updatedRelease.authors.push(newAuthor);
			}
		});
	}

	/**
	 * Removes an author
	 * @param {object} author
	 */
	removeAuthor(author) {
		this.updatedRelease.authors.splice(this.updatedRelease.authors.indexOf(author), 1);
	}

	/**
	 * Opens the create tag dialog
	 */
	createTag() {
		this.$uibModal.open({
			templateUrl: TagAddModalTpl,
			controller: 'TagAddModalCtrl',
			controllerAs: 'vm'
		}).result.then(newTag => {
			this.tags.push(newTag);
		});
	}

	/**
	 * Removes a tag from the release
	 * @param {object} tag
	 */
	removeTag(tag) {
		this.updatedRelease.tags.splice(this.updatedRelease.tags.indexOf(tag), 1);
		this.tags.push(tag);
	}

	/**
	 * Adds a link to the release
	 * @param {object} link
	 * @returns {{}}
	 */
	addLink(link) {
		this.updatedRelease.links.push(link);
		this.newLink = {}
	}

	/**
	 * Removes a link from the release
	 * @param {object} link
	 */
	removeLink(link) {
		this.updatedRelease.links = filter(this.updatedRelease.links, l => {
			return l.label !== link.label || l.url !== link.url;
		});
	}

	editVersion(version) {
		this.$uibModal.open({
			templateUrl: ReleaseEditVersionModalTpl,
			controller: 'ReleaseEditVersionModalCtrl',
			controllerAs: 'vm',
			size: 'lg',
			resolve: {
				game: () => this.game,
				release: () => this.release,
				version: () => version
			}
		}).result.then(updatedVersion => {
			assign(find(this.release.versions, version => version.version === updatedVersion.version), updatedVersion);
		});
	}

	/**
	 * Posts the release add form to the server.
	 */
	submit() {
		const release = angular.copy(this.updatedRelease);

		// map tags
		release._tags = map(release.tags, 'id');
		delete release.tags;

		// map authors
		if (this.editAuthors) {
			release.authors = release.authors.map(author => {
				author._user = author.user.id;
				delete author.user;
				return author;
			});
		} else {
			delete release.authors;
		}

		this.ReleaseResource.update({ release: this.release.id }, release, () => {
			this.$state.go('releaseDetails', { id: this.gameId, releaseId: this.releaseId });
			this.App.showNotification('Successfully updated release.');

		}, this.ApiHelper.handleErrors(this));
	}

	flattenBuilds(builds) {
		return builds.map(build => build.label).join(', ');
	}
}