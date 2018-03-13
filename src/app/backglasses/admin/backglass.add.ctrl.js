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

import AuthorSelectModalTpl from '../../shared/author-select/author.select.modal.pug';

export default class BackglassAddCtrl {

	/**
	 * @param $state
	 * @param $stateParams
	 * @param $localStorage
	 * @param $uibModal
	 * @param {App} App
	 * @param {AuthService} AuthService
	 * @param {ApiHelper} ApiHelper
	 * @param {ModalService} ModalService
	 * @param {TrackerService} TrackerService
	 * @param GameResource
	 * @param FileResource
	 * @param BackglassResource
	 * @param {BootstrapPatcher} BootstrapPatcher
	 * @ngInject
	 */
	constructor($state, $stateParams, $localStorage, $uibModal,
				App, AuthService, ApiHelper, ModalService, TrackerService,
				GameResource, FileResource, BackglassResource, BootstrapPatcher) {

		App.theme('light');
		App.setTitle('Add Backglass');
		App.setMenu('releases');

		this.$state = $state;
		this.$localStorage = $localStorage;
		this.$uibModal = $uibModal;
		this.App = App;
		this.AuthService = AuthService;
		this.ApiHelper = ApiHelper;
		this.ModalService = ModalService;
		this.GameResource = GameResource;
		this.FileResource = FileResource;
		this.BackglassResource = BackglassResource;

		BootstrapPatcher.patchCalendar();

		this.gameId = $stateParams.id;
		this.submitting = false;

		// fetch game info
		this.game = GameResource.get({ id: this.gameId }, () => {
			this.backglass._game = this.game.id;
			App.setTitle('Add Backglass - ' + this.game.title);
			TrackerService.trackPage();
		});

		// init data: either copy from local storage or reset.
		if ($localStorage.backglass && $localStorage.backglass[this.gameId] && $localStorage.backglass[this.gameId].versions) {
			this.backglass = $localStorage.backglass[this.gameId];
			this.backglass.versions[0].released_at = new Date(this.backglass.versions[0].released_at);
			this.meta = $localStorage.backglass_meta[this.gameId];
			AuthService.collectUrlProps(this.meta, true);

		} else {
			this.reset();
		}
	}

	/**
	 * Resets all entered data.
	 */
	reset() {

		// delete media if already uploaded
		if (this.backglass && !this.backglass.submitted) {
			if (this.meta.files && this.meta.files.backglass && this.meta.files.backglass.id) {
				this.FileResource.delete({ id: this.meta.files.backglass.id });
			}
		}
		const currentUser = this.AuthService.getUser();

		/*
		 * `meta` is all the data we need for displaying the page but that
		 * is not part of the backglass object posted to the API.
		 */
		if (!this.$localStorage.backglass_meta) {
			this.$localStorage.backglass_meta = {};
		}
		this.meta = this.$localStorage.backglass_meta[this.gameId] = {
			users: {},
			files: { backglass: { variations: { full: false } } }
		};
		this.meta.users[currentUser.id] = currentUser;

		/*
		 * `backglass` is the object posted to the API.
		 */
		if (!this.$localStorage.backglass || this.$localStorage.backglass._game) {
			this.$localStorage.backglass = {};
		}
		this.backglass = this.$localStorage.backglass[this.gameId] = {
			_game: this.gameId,
			description: '',
			versions: [ {
				version: '',
				released_at: new Date(),
				changes: '*Initial release.*',
				_file: null
			} ],
			authors: [ {
				_user: currentUser.id,
				roles: [ 'Creator' ]
			} ],
			acknowledgements: ''
		};
		this.errors = {};
	}

	/**
	 * Posts the backglass entity to the API.
	 */
	submit() {

		// post to api
		this.submitting = true;
		this.BackglassResource.save(this.backglass, () => {
			this.backglass.submitted = true;
			this.submitting = false;
			this.reset();

			let moderationMsg = '';
			if (!this.AuthService.hasPermission('backglasses/auto-approve')) {
				moderationMsg = '<br>You will be notified as soon as your backglass has been approved and published. ';
			}

			this.ModalService.info({
				icon: 'check-circle',
				title: 'Backglass created!',
				subtitle: this.game.title,
				message: 'The backglass has been successfully created.' + moderationMsg
			});

			// go to game page
			this.$state.go('gameDetails', { id: this.gameId });

		}, this.ApiHelper.handleErrors(this, () => this.submitting = false));
	}

	/**
	 * A .directb2s file has been uploaded.
	 * @param status File status
	 */
	onBackglassUpload(status) {

		const bg = status.storage;
		this.AuthService.collectUrlProps(bg, true);
		this.backglass.versions[0]._file = bg.id;
		this.meta.files.backglass = bg;
		this.meta.files.backglass.storage = { id: bg.id }; // so file-upload deletes old file when new one gets dragged over
	}

	/**
	 * Adds OR edits an author.
	 * @param {object} author If set, edit this author, otherwise add a new one.
	 */
	addAuthor(author) {
		this.$uibModal.open({
			templateUrl: AuthorSelectModalTpl,
			controller: 'AuthorSelectModalCtrl',
			resolve: {
				subject: () => this.backglass,
				meta: () => this.meta,
				author: () => author
			}
		}).result.then(newAuthor => {

			// here we're getting the full object, so store the user object in meta.
			const authorRef = { _user: newAuthor.user.id, roles: newAuthor.roles };
			this.meta.users[newAuthor.user.id] = newAuthor.user;

			// add or edit?
			if (author) {
				this.backglass.authors[this.backglass.authors.indexOf(author)] = authorRef;
			} else {
				this.backglass.authors.push(authorRef);
			}
		});
	}

	/**
	 * Removes an author
	 * @param {object} author
	 */
	removeAuthor(author) {
		this.backglass.authors.splice(this.backglass.authors.indexOf(author), 1);
	}

	openCalendar($event) {
		$event.preventDefault();
		$event.stopPropagation();
		this.calendarOpened = true;
	}
}
