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

import { orderBy } from 'lodash';

import ReleaseDownloadModalTpl from './release.download.modal.pug';
import ReleaseFileValidationTpl from './release.file.validation.modal.pug';
import imgPinDestruct from '../../../static/images/pindestruction.png';
import angular from 'angular';

/**
 * The release's detail view
 *
 * @author freezy <freezy@vpdb.io>
 */
export default class ReleaseDetailsCtrl {

	/**
	 * Class constructor
	 * @param $stateParams
	 * @param $location
	 * @param $localStorage
	 * @param $log
	 * @param $rootScope
	 * @param $uibModal
	 * @param {Lightbox} Lightbox
	 * @param {App} App
	 * @param {AuthService} AuthService
	 * @param {ApiHelper} ApiHelper
	 * @param {ReleaseService} ReleaseService
	 * @param {TrackerService} TrackerService
	 * @param {BootstrapPatcher} BootstrapPatcher
	 * @param CommentResource
	 * @param GameResource
	 * @param ReleaseResource
	 * @param ReleaseRatingResource
	 * @param ReleaseCommentResource
	 * @param ReleaseModerationCommentResource
	 * @ngInject
	 */
	constructor($stateParams, $location, $localStorage, $log, $rootScope, $uibModal, Lightbox,
				App, AuthService, ApiHelper, ReleaseService, TrackerService, BootstrapPatcher, CommentResource,
				GameResource, ReleaseResource, ReleaseRatingResource, ReleaseCommentResource,
				ReleaseModerationCommentResource) {

		App.theme('dark');
		App.setTitle('Release Details');
		App.setMenu('releases');
		BootstrapPatcher.patchCarousel();

		this.imgPinDestruct = imgPinDestruct;
		this.$log = $log;
		this.$location = $location;
		this.$localStorage = $localStorage;
		this.$uibModal = $uibModal;
		this.Lightbox = Lightbox;

		this.App = App;
		this.AuthService = AuthService;
		this.ApiHelper = ApiHelper;
		this.ReleaseService = ReleaseService;
		this.TrackerService = TrackerService;
		this.CommentResource = CommentResource;
		this.GameResource = GameResource;
		this.ReleaseResource = ReleaseResource;
		this.ReleaseRatingResource = ReleaseRatingResource;
		this.ReleaseCommentResource = ReleaseCommentResource;
		this.ReleaseModerationCommentResource = ReleaseModerationCommentResource;

		this.gameId = $stateParams.id;
		this.releaseId = $stateParams.releaseId;
		this.found = false;
		this.pageLoading = true;
		this.newComment = 'default text';
		this.zoneName = AuthService.hasPermission('releases/update') ? 'Admin' : 'Author';

		// seo structured data
		this.ldRelease = {
			'@context': 'http://schema.org/',
			'@type': 'Product'
		};

		// setup comments
		this.newComment = '';

		// setup statuses
		this.status = {
			release: { loading: false, offline: false },
			game: { loading: false, offline: false },
		};
		this.showDownloadAfterFetch = false;

		// ratings
		if (this.AuthService.hasPermission('releases/rate')) {
			this.ReleaseRatingResource.get({ releaseId: this.releaseId }, data => this.releaseRating = data.value);
		}

		// download release on event
		$rootScope.$on('downloadRelease', (event, params) => {
			if (params === this.releaseId) {
				if (!this.status.release.loading && !this.status.game.loading) {
					this._showDownloadModal();
				} else {
					this.showDownloadAfterFetch = true;
				}
			}
		});

		this.fetchData();
	}

	fetchData() {

		// GAME
		this.ApiHelper.request(() => this.GameResource.get({ id: this.gameId }), this.status.game)
			.then(game => {
				this.game = game;
				if (this.showDownloadAfterFetch && !this.status.release.loading) {
					this._showDownloadModal();
					this.showDownloadAfterFetch = false;
				}
			})
			.catch(() => this.game = null);

		// RELEASE
		this.ApiHelper.request(() => this.ReleaseResource.get({ release: this.releaseId }), this.status.release).then(release => {

			const title = release.game.title + ' · ' + release.name;
			const meta = {
				description: `${release.game.title} (${release.game.manufacturer} ${release.game.year}) - ${release.name} ${release.versions[0].version} by ${release.authors.map(a => a.user.name).join(', ')}`,
				keywords: [release.game.title, release.name, 'Download', 'Visual Pinball'].join(','),  // TODO add FP when supported
			};
			this.release = release;
			this.App.setTitle(title);

			// moderation toggle
			if (this.$location.search()['show-moderation']) {
				this.showModeration = true;
				this.$location.search('show-moderation', null);
			} else {
				this.showModeration = release.moderation && !release.moderation.is_approved;
			}

			// sort versions
			this.releaseVersions = orderBy(release.versions, [ 'released_at' ], [ 'desc' ]);
			this.latestVersion = this.releaseVersions[0];

			// get latest shots
			this.shots = orderBy(this.latestVersion.files.map((file, index) => {
				if (!file.playfield_image) {
					return null;
				}
				return {
					index: index,
					type: file.playfield_image.file_type,
					thumbUrl: file.playfield_image.variations[this.App.pixelSuffix('medium')].url,
					url: file.playfield_image.variations.full.url
				};
			}).filter(v => v), [ 'type' ], [ 'asc' ]);

			// fetch comments
			this.comments = this.ReleaseCommentResource.query({ releaseId: release.id });
			if (release.moderation) {
				this.moderationComments = this.ReleaseModerationCommentResource.query({ releaseId: release.id });
			}

			// mod permissions
			if (release.license === 'by-sa') {
				this.modPermission = 'This release can be freely modded when properly credited, without explicit permission from the author' + (release.authors.length === 1 ? '' : 's') + '.';
			} else {
				this.modPermission = 'This release cannot be freely modded and needs explicit permissions from the author' + (release.authors.length === 1 ? '' : 's') + '.';
			}

			this.flavorGrid = this.ReleaseService.flavorGrid(release);

			// seo structured data
			this.ldRelease.name = title;
			if (release.description) {
				this.ldRelease.description = release.description;
			}
			this.ldRelease.brand = release.authors.map(a => a.user.name).join(', ');

			let playfieldImage;
			release.versions.forEach(version => {
				version.files.forEach(file => {
					// prefer landscape shot
					if (!playfieldImage || (file.playfield_image.file_type === 'playfield-ws' && playfieldImage.file_type !== 'playfield-ws')) {
						playfieldImage = file.playfield_image;
					}
				});
			});
			if (playfieldImage) {
				this.ldRelease.image = playfieldImage.variations['medium'].url;
				meta.thumbnail = playfieldImage.variations['medium'].url;
			}
			this.App.setMeta(meta);

			if (release.rating.votes) {
				this.ldRelease.aggregateRating = {
					'@type': 'AggregateRating',
					'ratingValue': release.rating.average,
					'bestRating': '10',
					'worstRating': '1',
					'ratingCount': release.rating.votes
				};
			}
			this.TrackerService.trackPage();

			// download dialog
			if (this.showDownloadAfterFetch && !this.status.game.loading) {
				this._showDownloadModal();
				this.showDownloadAfterFetch = false;
			}

		}).catch(() => this.release = null);
	}

	openLightbox(index) {
		this.Lightbox.openModal(this.shots, index);
	}

	addComment() {
		this.ReleaseCommentResource.save({ releaseId: this.releaseId }, { message: this.newComment }, comment => {
			this.comments.push(comment);
			this.newComment = '';
		}, this.ApiHelper.handleErrors(this));
	}

	addModerationComment() {
		this.ReleaseModerationCommentResource.save({ releaseId: this.releaseId }, { message: this.newModerationComment }, comment => {
			this.moderationComments.push(comment);
			this.newModerationComment = '';
		}, this.ApiHelper.handleErrors(this));
	}

	/**
	 * Opens the game download dialog
	 */
	download() {
		if (this.AuthService.isAuthenticated) {
			this._showDownloadModal();

		} else {
			this.App.login({
				headMessage: 'In order to download this release, you need to be logged in. You can register for free just below.',
				postLogin: { action: 'downloadRelease', params: this.releaseId }
			});
		}
	}

	/**
	 * Rates a release
	 * @param rating Rating
	 */
	rateRelease(rating) {
		const done = result => {
			this.release.rating = result.release;
			this.releaseRating = rating;
		};
		if (this.releaseRating) {
			this.ReleaseRatingResource.update({ releaseId: this.release.id }, { value: rating }, done);
			this.App.showNotification('Successfully updated rating.');

		} else {
			this.ReleaseRatingResource.save({ releaseId: this.release.id }, { value: rating }, done);
			this.App.showNotification('Successfully rated release!');
		}
	}

	validateFile(release, version, file) {
		this.$uibModal.open({
			templateUrl: ReleaseFileValidationTpl,
			controller: 'ReleaseFileValidationCtrl',
			controllerAs: 'vm',
			resolve: {
				params: () => {
					return {
						release: release,
						version: version,
						file: file,
					};
				}
			}
		}).result.then(validation => {
			if (validation) {
				file.validation = validation;
			}
		}).catch(angular.noop);
	}

	moveComment(commentId, refName, refId) {
		this.CommentResource.update({ id: commentId }, { _ref: { [refName]: refId }}, () => {
			this.comments = this.ReleaseCommentResource.query({ releaseId: refId });
			this.moderationComments = this.ReleaseModerationCommentResource.query({ releaseId: refId });
		}, this.ApiHelper.handleErrors(this));
	}

	/**
	 * Shows the download dialog once we're sure we're authenticated.
	 * @private
	 */
	_showDownloadModal() {
		this.$uibModal.open({
			templateUrl: ReleaseDownloadModalTpl,
			controller: 'ReleaseDownloadModalCtrl',
			controllerAs: 'vm',
			size: 'lg',
			resolve: {
				params: () => {
					return {
						game: this.game,
						release: this.release,
						latestVersion: this.latestVersion
					};
				}
			}
		}).result.catch(angular.noop);
	}
}
