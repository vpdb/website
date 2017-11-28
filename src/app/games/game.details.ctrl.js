import { isEmpty, isObject, indexOf, find, filter, mapValues, map } from 'lodash';

import BackglassDetailsModalTpl from '../backglasses/backglass.details.modal.pug';
import MediumInfoModalTpl from '../media/medium.info.modal.pug';

/**
 * The game's details view.
 *
 * @author freezy <freezy@vpdb.io>
 */
export default class GameDetailsCtrl {

	/**
	 * @param $stateParams
	 * @param $uibModal
	 * @param $localStorage
	 * @param {App} App
	 * @param {ApiHelper} ApiHelper
	 * @param {AuthService} AuthService
	 * @param {Flavors} Flavors
	 * @param {ConfigService} ConfigService
	 * @param {DownloadService} DownloadService
	 * @param {ModalService} ModalService
	 * @param {TrackerService} TrackerService
	 * @param GameResource
	 * @param ReleaseCommentResource
	 * @param FileResource
	 * @param RomResource
	 * @param GameRatingResource
	 * @param GameStarResource
	 * @ngInject
	 */
	constructor($stateParams, $uibModal, $localStorage,
				App, ApiHelper, AuthService, Flavors, ConfigService, DownloadService, ModalService, TrackerService,
				GameResource, ReleaseCommentResource, FileResource, RomResource, GameRatingResource, GameStarResource) {

		App.theme('dark');
		App.setMenu('games');

		this.gameId = $stateParams.id;
		this.ldGame = {
			"@context": "http://schema.org/",
			"@type": "Product"
		};

		this.$uibModal = $uibModal;
		this.$localStorage = $localStorage;
		this.App = App;
		this.ApiHelper = ApiHelper;
		this.AuthService = AuthService;
		this.Flavors = Flavors;
		this.ConfigService = ConfigService;
		this.DownloadService = DownloadService;
		this.ModalService = ModalService;
		this.TrackerService = TrackerService;
		this.GameResource = GameResource;
		this.ReleaseCommentResource = ReleaseCommentResource;
		this.FileResource = FileResource;
		this.RomResource = RomResource;
		this.GameRatingResource = GameRatingResource;
		this.GameStarResource = GameStarResource;

		this.pageLoading = true;
		this.newRoms = $localStorage.game_data && $localStorage.game_data[this.gameId] ? $localStorage.game_data[this.gameId].roms : [];
		this.roms = RomResource.query({ id : this.gameId });
		this.romLanguages = [
			{ value: 'en', label: 'English' },
			{ value: 'es', label: 'Spanish' },
			{ value: 'de', label: 'German' },
			{ value: 'it', label: 'Italian' },
			{ value: 'fr', label: 'French' }
		];
		this.mediaConfig = {
			backglass_image: {
				imgclass: ['img--ar-bg'],
				variation: 'medium'
			},
			wheel_image: {
				imgclass: ['img--ar-bg', 'img--fit'],
				variation: 'medium'
			}
		};

		$localStorage.game_meta = map(mapValues($localStorage.game_meta, obj => map(obj, GameDetailsCtrl.isSetObject)), GameDetailsCtrl.isSetObject);

		// setup meta data
		if (!$localStorage.game_meta) {
			$localStorage.game_meta = {};
		}
		if (!$localStorage.game_meta[this.gameId]) {
			$localStorage.game_meta[this.gameId] = {
				romFiles: []
			};
		}
		this.meta = $localStorage.game_meta[this.gameId];
		this.romUploadCollapsed = !this.meta || !this.meta.romFiles || this.meta.romFiles.length === 0;

		this.fetchData();
	}

	/**
	 * Loads the game from the backend and updates meta data.
	 */
	fetchData() {

		this.GameResource.get({ id: this.gameId }, result => {

			this.game = result;
			this.pageLoading = false;
			this.hasReleases = this.game.releases.length > 0;

			// title
			let title = this.game.title;
			if (this.game.manufacturer && this.game.year) {
				title += ' (' + this.game.manufacturer + ' ' + this.game.year + ')';
			}
			this.App.setTitle(title);

			// seo meta
			let keywordItems = [];
			if (!isEmpty(this.game.short)) {
				keywordItems = keywordItems.concat(this.game.short);
			}
			if (!isEmpty(this.game.keywords)) {
				keywordItems = keywordItems.concat(this.game.keywords);
			}
			keywordItems.push('visual pinball');
			keywordItems.push('download');
			keywordItems.push('vpt');
			keywordItems.push('vpx');
			keywordItems.push('directb2s');
			keywordItems.push('rom');
			keywordItems.push('pinmame');
			keywordItems.push('vpinmame');
			const descriptionItems = [];
			if (this.game.owner) {
				descriptionItems.push('Produced by ' + this.game.owner);
			}
			if (!isEmpty(this.game.designers)) {
				descriptionItems.push('Designed by ' + this.game.designers.join(', '));
			}
			const s = descriptionItems.length === 0 ? '' : ' - ';
			this.App.setMeta({
				description: descriptionItems.join(', ') + s + 'Download tables, DirectB2S backglasses, ROMs and more.',
				keywords: keywordItems.join(', '),
				thumbnails: this.game.backglass.variations['small'].url
			});

			// seo structured data
			this.ldGame.name = title;
			this.ldGame.image = this.game.backglass.variations['medium-2x'].url;
			if (this.game.manufacturer) {
				this.ldGame.brand = this.game.manufacturer;
			}
			if (this.game.slogans) {
				this.ldGame.description = this.game.slogans.split('\n')[0];
			}
			if (this.game.rating.votes) {
				this.ldGame.aggregateRating = {
					"@type": "AggregateRating",
					"ratingValue": this.game.rating.average,
					"bestRating": "10",
					"worstRating": "1",
					"ratingCount": this.game.rating.votes
				};
			}
			this.TrackerService.trackPage();
		});

		// RATINGS
		if (this.AuthService.hasPermission('games/rate')) {
			this.GameRatingResource.get({gameId: this.gameId}).$promise.then(result => {
				this.userGameRating = result.value;
			}, err => {});
		}

		// STARS
		if (this.AuthService.hasPermission('games/star')) {
			this.GameStarResource.get({ gameId: this.gameId }).$promise.then(() => this.gameStarred = true, () => this.gameStarred = false);
		}
	}

	/**
	 * data is sent to the server and serves as persistent storage in case of browser refresh
	 * @return {*}
	 */
	data() {
		if (!this.$localStorage.game_data) {
			this.$localStorage.game_data = {};
		}
		if (!this.$localStorage.game_data[this.gameId]) {
			this.$localStorage.game_data[this.gameId] = {
				roms: {}
			};
		}
		this.newRoms = this.$localStorage.game_data[this.gameId].roms;
		return this.$localStorage.game_data[this.gameId];
	}

	/**
	 * Callback for ROM uploads
	 * @param status
	 */
	onRomUpload(status) {
		status.romId = status.name.substr(0, status.name.lastIndexOf('.'));
		const basename = status.romId;
		const m = basename.match(/(\d{2,}.?)$/);
		const version = m ? m[1][0] + '.' + m[1].substr(1) : '';
		this.data().roms[status.storage.id] = {
			_file: status.storage.id,
			id: status.romId,
			version: version,
			notes: '',
			language: this.romLanguages[0]
		};
	};

	/**
	 * Posts all uploaded ROM files to the API
	 */
	saveRoms() {
		this.data().roms.forEach(rom => {
			if (isObject(rom.language)) {
				rom.language = rom.language.value;
			}

			// we only allow one language through the UI, the API does multiple however.
			rom.languages = [ rom.language ];
			delete rom.language;

			// post to api
			this.RomResource.save({ id: this.gameId }, rom, () => {
				this.roms = this.RomResource.query({ id : this.gameId });
				this.meta.romFiles.splice(indexOf(this.meta.romFiles, find(this.meta.romFiles, { id : rom._file })), 1);
				delete this.data().roms[rom._file];

			}, response => {
				if (response.data.errors) {
					response.data.errors.forEach(err => {
						filter(this.meta.romFiles, { romId: rom.id })[0].error = err.message;
					});
				}
			});
		});
	};

	/**
	 * Downloads a single ROM
	 * @param rom
	 */
	downloadRom(rom) {
		this.DownloadService.downloadFile(rom.file, function() {
			rom.file.counter.downloads++;
		});
	}


	/**
	 * Deletes an uploaded file from the server and removes it from the list
	 * @param {object} file
	 */
	removeRom(file) {
		this.FileResource.delete({ id: file.storage.id }, () => {
			this.meta.romFiles.splice(this.meta.romFiles.indexOf(file), 1);
			delete this.data().roms[file.storage.id];

		}, this.ApiHelper.handleErrorsInDialog('Error removing file.', response => {
			if (response.status === 404) {
				this.meta.romFiles.splice(this.meta.romFiles.indexOf(file), 1);
				delete this.data().roms[file.storage.id];
				return true;
			}
		}));
	}

	/**
	 * Rates a game.
	 * @param {int} rating Rating
	 */
	rateGame(rating) {
		const done = result => {
			this.game.rating = result.game;
			this.userGameRating = rating;
		};
		if (this.userGameRating) {
			this.GameRatingResource.update({ gameId: this.gameId }, { value: rating }, done);
			this.App.showNotification('Successfully updated rating.');

		} else {
			this.GameRatingResource.save({ gameId: this.gameId }, { value: rating }, done);
			this.App.showNotification('Successfully rated game!');
		}
	}

	/**
	 * Stars or unstars a game depending if game is already starred.
	 */
	toggleStar() {
		const err = err => {
			if (err.data && err.data.error) {
				this.ModalService.error({
					subtitle: 'Error starring game.',
					message: err.data.error
				});
			} else {
				console.error(err);
			}
		};
		if (this.gameStarred) {
			this.GameStarResource.delete({ gameId: this.gameId }, {}, () => {
				this.gameStarred = false;
				this.game.counter.stars--;
			}, err);

		} else {
			this.GameStarResource.save({ gameId: this.gameId }, {}, result => {
				this.gameStarred = true;
				this.game.counter.stars = result.total_stars;
			}, err);
		}
	}

	showBackglass(backglass) {
		this.$uibModal.open({
			templateUrl: BackglassDetailsModalTpl,
			controller: 'BackglassDetailsModalCtrl',
			controllerAs: 'vm',
			size: 'md',
			resolve: {
				params: () => {
					return {
						game: this.game,
						backglass: backglass,
					};
				}
			}
		});
	}

	showMedium(medium) {
		this.$uibModal.open({
			templateUrl: MediumInfoModalTpl,
			controller: 'MediumInfoModalCtrl',
			controllerAs: 'vm',
			size: 'md',
			resolve: {
				params: () => {
					return {
						game: this.game,
						medium: medium
					};
				}
			}
		});
	}

	static isSetObject(val) {
		if (isObject(val) && isEmpty(val)) {
			return false;
		}
		return !!val;
	};
}