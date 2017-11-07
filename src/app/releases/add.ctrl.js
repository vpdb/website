import ReleaseAddBaseCtrl from './add.base.ctrl';
import { values, filter, includes, cloneDeep, map, flatten } from 'lodash';

const authorSelectModalTpl = require('../users/author.select.modal.pug')();
const tagAddModalTpl = require('../tag/add.modal.pug')();

export default class ReleaseAddCtrl extends ReleaseAddBaseCtrl {

	/**
	 * Class constructor
	 *
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
	 * @param {ReleaseResource} ReleaseResource
	 * @param {FileResource} FileResource
	 * @param {TagResource} TagResource
	 * @param {BuildResource} BuildResource
	 * @param {GameResource} GameResource
	 * @param {GameReleaseNameResource} GameReleaseNameResource
	 * @param {TrackerService} TrackerService
	 * @param {BootstrapPatcher} BootstrapPatcher
	 */
	constructor($scope, $uibModal, $localStorage, $state, $stateParams, App, AuthService, ModalService,
				ApiHelper, Flavors, ReleaseMeta, ReleaseResource, FileResource, TagResource, BuildResource,
				GameResource, GameReleaseNameResource, TrackerService, BootstrapPatcher) {

		super($uibModal, ApiHelper, AuthService, BuildResource, FileResource, BootstrapPatcher);

		App.theme('light');
		App.setTitle('Add Release');
		App.setMenu('releases');

		this.$state = $state;
		this.$localStorage = $localStorage;
		this.ModalService = ModalService;
		this.ReleaseResource = ReleaseResource;
		this.GameReleaseNameResource = GameReleaseNameResource;
		this.ReleaseMeta = ReleaseMeta;

		// define flavors and builds
		this.flavors = values(Flavors);
		this.fetchBuilds();

		this.submitting = false;
		this.showHelp = $localStorage.show_instructions.release_add;
		$scope.$watch('showHelp', () => $localStorage.show_instructions.release_add = this.showHelp);

		// fetch game info
		this.gameId = $stateParams.id;
		this.game = GameResource.get({ id: this.gameId }, () => {
			this.game.lastrelease = new Date(this.game.lastrelease).getTime();
			this.release._game = this.game.id;
			App.setTitle('Add Release - ' + this.game.title);
			TrackerService.trackPage();
		});

		// retrieve available tags
		this.tags = TagResource.query(() => {
			if (this.release && this.release._tags.length > 0) {
				// only push tags that aren't assigned yet.
				this.tags = filter(this.tags, tag => {
					return !includes(this.release._tags, tag.id);
				});
			}
		});

		this.step = {
			files: 1,
			flavors: 3,
			compat: 5,
			media: 7
		};
		this.newLink = {};

		// init data: either copy from local storage or reset.
		if (this.$localStorage.release && this.$localStorage.release[this.gameId] && this.$localStorage.release[this.gameId].versions) {
			this.release = this.$localStorage.release[this.gameId];
			this.releaseVersion = this.release.versions[0];
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
		this.meta.users[currentUser.id] = currentUser;
		this.meta.releaseDate = new Date();
		this.newLink = {};
		this.meta.idMap = {};

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
				changes: '*Initial release.*',
				files: [ ]
			} ],
			authors: [ {
				_user: currentUser.id,
				roles: [ 'Table Creator' ]
			} ],
			_tags: [ ],
			links: [ ],
			acknowledgements: '',
			original_version: null
		};
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
			template: authorSelectModalTpl,
			controller: 'AuthorSelectModalCtrl',
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
		});
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
			template: tagAddModalTpl,
			controller: 'TagAddModalCtrl'
		}).result.then(newTag => {
			this.tags.push(newTag);
		});
	}

	/**
	 * When a tag is dropped
	 */
	tagDropped() {
		this.release._tags = map(this.meta.tags, 'id');
	}

	/**
	 * Removes a tag from the release
	 * @param {object} tag
	 */
	removeTag(tag) {
		this.meta.tags.splice(this.meta.tags.indexOf(tag), 1);
		this.tags.push(tag);
		this.release._tags = map(this.meta.tags, 'id');
	}

	/**
	 * Adds a link to the release
	 * @param {object} link
	 * @returns {{}}
	 */
	addLink(link) {
		this.release.links.push(link);
		this.newLink = {}
	}

	/**
	 * Removes a link from the release
	 * @param {object} link
	 */
	removeLink(link) {
		this.release.links = filter(this.release.links, l => {
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

		// get release date
		const releaseDate = this.getReleaseDate();
		if (releaseDate) {
			this.release.versions[0].released_at = releaseDate;
		} else {
			delete this.release.versions[0].released_at;
		}

		// add link if user has started typing something.
		if (this.newLink && (this.newLink.label || this.newLink.url)) {
			this.addLink(this.newLink);
		}

		// retrieve rotation parameters
		const rotationParams = [];
		flatten(map(this.release.versions, 'files')).forEach(file => {
			if (!file._playfield_image) {
				return;
			}
			const rotation = this.meta.mediaLinks[this.getMediaKey(file, 'playfield_image')].rotation;
			const offset = this.meta.mediaLinks[this.getMediaKey(file, 'playfield_image')].offset;
			const relativeRotation = rotation + offset;
			rotationParams.push(file._playfield_image + ':' + relativeRotation);
		});

		this.submitting = true;
		this.ReleaseResource.save({ rotate: rotationParams.join(',') }, this.release, release => {
			this.release.submitted = true;
			this.submitting = false;
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
			$state.go('releaseDetails', { id: this.gameId, releaseId: release.id });

		}, this.ApiHelper.handleErrors(this, scope => {
			this.submitting = false;

			// if it's an array, those area displayed below
			if (scope.errors && scope.errors.versions && !isArray(scope.errors.versions[0].files)) {
				scope.filesError = scope.errors.versions[0].files;
			} else {
				scope.filesError = null;
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