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

import angular from 'angular';
import { pick } from 'lodash';
import AuthorSelectModalTpl from '../../../shared/author-select/author.select.modal.pug';
import TagAddModalTpl from '../tag/tag.add.modal.pug';
import ReleaseEditVersionModalTpl from './release.edit.version.modal.pug';

export default class ReleaseEditCtrl {
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
		this.canEditAuthors = false;

		this.game = GameResource.get({ id: this.gameId });
		this.release = ReleaseResource.get({ release: this.releaseId }, release => {

			// retrieve available tags, then reset.
			this.tags = TagResource.query(() => this.reset());

			if (AuthService.isAuthenticated) {
				this.canEditAuthors = AuthService.getUser().id === release.created_by.id;
			}
		});
	}

	/**
	 * Resets the data to current release.
	 */
	reset() {
		this.updatedRelease = pick(angular.copy(this.release), [ 'name', 'description', 'tags', 'links', 'acknowledgements', 'authors' ]);
		this.availableTags = this.tags.filter(tag => !this.updatedRelease.tags.map(t => t.id).includes(tag.id));
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
		}).catch(angular.noop);
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
			this.availableTags.push(newTag);
		}).catch(angular.noop);
	}

	/**
	 * Removes a tag from the release
	 * @param {object} tag
	 */
	removeTag(tag) {
		if (this.availableTags.includes(tag)) {
			return;
		}
		this.availableTags.push(tag);
		this.updatedRelease.tags.splice(this.updatedRelease.tags.indexOf(tag), 1);
	}

	/**
	 * Adds a tag to the release
	 * @param {object} tag
	 */
	addTag(tag) {
		// if dropped on the same spot, ignore.
		if (this.updatedRelease.tags.includes(tag)) {
			return;
		}
		this.updatedRelease.tags.push(tag);
		this.availableTags.splice(this.availableTags.indexOf(tag), 1);
	}

	/**
	 * Adds a link to the release
	 * @param {object} link
	 * @returns {{}}
	 */
	addLink(link) {
		this.updatedRelease.links.push(link);
		this.newLink = {};
	}

	/**
	 * Removes a link from the release
	 * @param {object} link
	 */
	removeLink(link) {
		this.updatedRelease.links = this.updatedRelease.links.filter(l => l.label !== link.label || l.url !== link.url);
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
			Object.assign(this.release.versions.find(version => version.version === updatedVersion.version), updatedVersion);
		}).catch(angular.noop);
	}

	/**
	 * Posts the release add form to the server.
	 */
	submit() {
		const release = angular.copy(this.updatedRelease);

		// map tags
		release._tags = release.tags.map(t => t.id);
		delete release.tags;

		// map authors
		if (this.canEditAuthors) {
			release.authors = release.authors.map(author => {
				author._user = author.user.id;
				delete author.user;
				return author;
			});
		} else {
			delete release.authors;
		}

		this.ReleaseResource.update({ release: this.releaseId }, release, () => {
			this.$state.go('releaseDetails', { id: this.gameId, releaseId: this.releaseId });
			this.App.showNotification('Successfully updated release.');

		}, this.ApiHelper.handleErrors(this));
	}

	flattenBuilds(builds) {
		return builds.map(build => build.label).join(', ');
	}
}
