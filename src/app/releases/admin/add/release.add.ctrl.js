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

import angular from 'angular';
import { isArray, cloneDeep, flatten } from 'lodash';

import ReleaseBaseCtrl from '../release.base.ctrl';
import AuthorSelectModalTpl from '../../../shared/author-select/author.select.modal.pug';
import TagAddModalTpl from '../tag/tag.add.modal.pug';

export default class ReleaseAddCtrl extends ReleaseBaseCtrl {

	/**
	 * @param $scope
	 * @param $uibModal
	 * @param $localStorage
	 * @param $state
	 * @param $stateParams
	 * @param {App} App
	 * @param {AuthService} AuthService
	 * @param {ModalService} ModalService
	 * @param {ApiHelper} ApiHelper
	 * @param {Flavors} Flavors
	 * @param {ReleaseMeta} ReleaseMeta
	 * @param {TrackerService} TrackerService
	 * @param {BootstrapPatcher} BootstrapPatcher
	 * @param ReleaseResource
	 * @param FileResource
	 * @param TagResource
	 * @param BuildResource
	 * @param GameResource
	 * @param GameReleaseNameResource
	 * @ngInject
	 */
	constructor($scope, $uibModal, $localStorage, $state, $stateParams,
				App, AuthService, ModalService, ApiHelper, Flavors, ReleaseMeta, TrackerService, BootstrapPatcher,
				ReleaseResource, FileResource, TagResource, BuildResource, GameResource, GameReleaseNameResource) {

		super($uibModal, ApiHelper, AuthService, ReleaseMeta, BootstrapPatcher, BuildResource, FileResource);

		App.theme('light');
		App.setTitle('Add Release');
		App.setMenu('releases');

		this.$state = $state;
		this.$localStorage = $localStorage;
		this.App = App;
		this.AuthService = AuthService;
		this.ModalService = ModalService;
		this.ReleaseResource = ReleaseResource;
		this.GameReleaseNameResource = GameReleaseNameResource;
		this.ReleaseMeta = ReleaseMeta;

		// define flavors and builds
		this.flavors = Object.keys(Flavors).map(e => Flavors[e]);
		this.fetchBuilds();

		// statuses
		this.submitting = false;
		this.showHelp = $localStorage.showInstructions.release_add;
		this.gameId = $stateParams.id;

		$scope.$watch(() => this.showHelp, () => $localStorage.showInstructions.release_add = this.showHelp);

		// init data: either copy from local storage or reset.
		if (this.$localStorage.release && this.$localStorage.release[this.gameId] && this.$localStorage.release[this.gameId].versions) {
			this.release = this.$localStorage.release[this.gameId];
			this.releaseVersion = this.release.versions[0];
			this.releaseVersion.released_at = new Date(this.releaseVersion.released_at);
			this.meta = this.$localStorage.release_meta[this.gameId];

			// update references
			//_.each($scope.release.versions[0].files, function(file) {
			//	var metaFile = _.find($scope.meta.files, function(f) { return f.storage.id === file._file; });
			//	//metaFile.tableFile = file;
			//});
			this.AuthService.collectUrlProps(this.meta, true);

		} else {
			this.reset();
		}

		// fetch game info
		GameResource.get({ id: this.gameId }, response => {
			this.game = response.data;
			this.game.lastrelease = new Date(this.game.lastrelease).getTime();
			this.release._game = this.game.id;
			App.setTitle('Add Release - ' + this.game.title);
			TrackerService.trackPage();
		});

		// retrieve available tags
		this.tags = TagResource.query(() => {
			if (this.release._tags.length > 0) {
				// only push tags that aren't assigned yet.
				this.availableTags = this.tags.filter(tag => !this.release._tags.includes(tag.id));
			} else {
				this.availableTags = this.tags.slice();
			}
		});

		this.step = {
			files: 1,
			flavors: 3,
			compat: 5,
			media: 7
		};
		this.newLink = {};
	}


	/**
	 * Resets all entered data
	 */
	reset() {
		const currentUser = this.AuthService.getUser();

		/*
		 * `meta` is all the data we need for displaying the page but that
		 * is not part of the release object posted to the API.
		 */
		if (!this.$localStorage.release_meta || this.$localStorage.release_meta.releaseDate) {
			this.$localStorage.release_meta = {};
		}
		this.meta = this.$localStorage.release_meta[this.gameId] = cloneDeep(this.ReleaseMeta);
		if (currentUser) {
			this.meta.users[currentUser.id] = currentUser;
		}
		this.newLink = {};
		this.meta.idMap = {};
		if (this.tags) {
			this.availableTags = this.tags.slice();
		}


		// TODO remove files via API

		/*
		 * `release` is the object posted to the API.
		 */
		if (!this.$localStorage.release || this.$localStorage.release._game) {
			this.$localStorage.release = {};
		}
		this.release = this.$localStorage.release[this.gameId] = {
			_game: this.gameId,
			name: '',
			description: '',
			versions: [ {
				version: '',
				released_at: new Date(),
				changes: '*Initial release.*',
				files: [ ]
			} ],
			authors: [ ],
			_tags: [ ],
			links: [ ],
			acknowledgements: '',
			original_version: null
		};
		if (currentUser) {
			this.$localStorage.release[this.gameId].authors.push({
				_user: currentUser.id,
				roles: [ 'Table Creator' ]
			});
		}
		this.releaseVersion = this.release.versions[0];
		this.errors = {};
		this.filesError = null;
		this.releaseFileRefs = {};
	}

	/**
	 * Adds OR edits an author.
	 * @param {object} author If set, edit this author, otherwise add a new one.
	 */
	addAuthor(author) {
		this.$uibModal.open({
			templateUrl: AuthorSelectModalTpl,
			controller: 'AuthorSelectModalCtrl',
			controllerAs: 'vm',
			resolve: {
				subject: () => this.release,
				meta: () => this.meta,
				author: () => author
			}
		}).result.then(newAuthor => {

			// here we're getting the full object, so store the user object in meta.
			const authorRef = { _user: newAuthor.user.id, roles: newAuthor.roles };
			this.meta.users[newAuthor.user.id] = newAuthor.user;

			// add or edit?
			if (author) {
				this.release.authors[this.release.authors.indexOf(author)] = authorRef;
			} else {
				this.release.authors.push(authorRef);
			}
		}).catch(angular.noop);
	}

	/**
	 * Removes an author
	 * @param {object} author
	 */
	removeAuthor(author) {
		this.release.authors.splice(this.release.authors.indexOf(author), 1);
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
			this.availableTags.push(newTag);
			this.tags.push(newTag);
		}).catch(angular.noop);
	}

	/**
	 * Removes a tag from the release
	 * @param {object} tag
	 */
	removeTag(tag) {
		// if dropped on the same spot, ignore.
		if (this.availableTags.includes(tag)) {
			return;
		}
		this.meta.tags.splice(this.meta.tags.indexOf(tag), 1);
		this.availableTags.push(tag);
		this.release._tags = this.meta.tags.map(t => t.id);
	}

	/**
	 * Adds a tag to the release
	 * @param {object} tag
	 */
	addTag(tag) {
		// if dropped on the same spot, ignore.
		if (this.meta.tags.includes(tag)) {
			return;
		}
		this.meta.tags.push(tag);
		this.availableTags.splice(this.availableTags.indexOf(tag), 1);
		this.release._tags = this.meta.tags.map(t => t.id);
	}

	/**
	 * Adds a link to the release
	 * @param {object} link
	 * @return {{}}
	 */
	addLink(link) {
		this.release.links.push(link);
		this.newLink = {};
	}

	/**
	 * Removes a link from the release
	 * @param {object} link
	 */
	removeLink(link) {
		this.release.links = this.release.links.filter(l => {
			return l.label !== link.label || l.url !== link.url;
		});
	}

	/**
	 * Retrieves a release name proposition.
	 */
	generateReleaseName() {
		this.GameReleaseNameResource.get({ gameId: this.gameId }, result => {
			this.release.name = result.name;
		});
	}

	/**
	 * Posts the release add form to the server.
	 */
	submit() {

		// add link if user has started typing something.
		if (this.newLink && (this.newLink.label || this.newLink.url)) {
			this.addLink(this.newLink);
		}

		// retrieve rotation parameters
		const rotationParams = [];
		flatten(this.release.versions.map(v => v.files)).forEach(file => {
			if (!file._playfield_image) {
				return;
			}
			const state = this.meta.mediaLinks[this.getMediaKey(file, 'playfield_image')];
			const relativeRotation = state.rotation + state.offset;
			rotationParams.push(file._playfield_image + ':' + relativeRotation);
		});

		this.submitting = true;
		this.App.setLoading(true);
		this.ReleaseResource.save({ rotate: rotationParams.join(',') }, this.release, release => {
			this.release.submitted = true;
			this.submitting = false;
			this.App.setLoading(false);
			this.reset();

			let moderationMsg = '';
			if (!this.AuthService.hasPermission('releases/auto-approve')) {
				moderationMsg = '<br>You will be notified as soon as your release has been approved and published. ';
			}

			this.ModalService.info({
				icon: 'check-circle',
				title: 'Release created!',
				subtitle: this.game.title,
				message: 'The release has been successfully created.' + moderationMsg
			});

			// go to game page
			this.$state.go('releaseDetails', { id: this.gameId, releaseId: release.id });

		}, this.ApiHelper.handleErrors(this, scope => {
			this.submitting = false;
			this.App.setLoading(false);

			// if it's an array, those area displayed below
			if (scope.errors && scope.errors.versions && !isArray(scope.errors.versions[0].files)) {
				this.filesError = scope.errors.versions[0].files;
			} else {
				this.filesError = null;
			}
		}, (scope, response) => {

			if (!response.data.errors) {
				return;
			}

			// rephrase some of the messages from backend
			response.data.errors.forEach(error => {

				if (/orientation is set to FS but playfield image is .playfield-ws./i.test(error.message)) {
					error.message = 'Wrong orientation. Use the rotation button above to rotate the playfield so it\'s oriented as if you would play it. If that\'s the case, then you\'ve uploaded a widescreen (desktop) shot for a file marked as portrait (fullscreen).';
				}
				if (/orientation is set to WS but playfield image is .playfield-fs./i.test(error.message)) {
					error.message = 'Wrong orientation. Use the rotation button above to rotate the playfield so it\'s oriented as if you would play it. If that\'s the case, then you\'ve uploaded a portrait (fullscreen) shot for a file marked as widescreen (desktop).';
				}
			});
		}));
	}
}
