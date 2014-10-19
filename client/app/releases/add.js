"use strict"; /* global _ */

angular.module('vpdb.releases.add', [])

	.controller('ReleaseAddCtrl', function($scope, $upload, $modal, $window, $localStorage, $routeParams,
										   AuthService, ApiHelper,
										   FileResource, TagResource, VPBuildResource, GameResource,
										   ConfigService, DisplayService, MimeTypeService) {

		$scope.theme('light');
		$scope.setMenu('admin');
		$scope.setTitle('Add Release');

		$scope.files = [];

//		$scope.files = [
//			{
//				name: 'Filename.vpt',
//				bytes: 1337,
//				icon: DisplayService.fileIcon('application/x-visual-pinball-table'),
//				uploaded: true,
//				uploading: false,
//				progress: 100,
//				storage: { id: 'abcd' },
//				flavor: {}
//			},
//			{
//				name: 'Anotherfile.vpx',
//				bytes: 12213,
//				icon: DisplayService.fileIcon('application/x-visual-pinball-table-x'),
//				uploaded: true,
//				uploading: false,
//				progress: 100,
//				storage: { id: 'asdf' },
//				flavor: {}
//			},
//			{
//				name: 'Filename.jpg',
//				bytes: 3321,
//				icon: DisplayService.fileIcon('image/jpeg'),
//				uploaded: true,
//				uploading: false,
//				progress: 100,
//				storage: { id: '1234' },
//				flavor: {}
//			}
//		];

		$scope.flavors = [
			{
				header: 'Orientation',
				name: 'orientation',
				values: [
					{ name: 'Desktop', other: 'Landscape', value: 'ws' },
					{ name: 'Cabinet', other: 'Portrait', value: 'fs' }
				]
			}, {
				header: 'Lightning',
				name: 'lightning',
				values: [
					{ name: 'Night', other: 'Dark Playfield', value: 'night' },
					{ name: 'Day', other: 'Illuminated Playfield', value: 'day' }
				]
			}
		];

		$scope.tags = TagResource.query();

		$scope.game = GameResource.get({ id: $routeParams.id }, function() {
			$scope.game.lastrelease = new Date($scope.game.lastrelease).getTime();
			$scope.setTitle('Add Release - ' + $scope.game.title);
		});


		var vpbuilds = VPBuildResource.query(function() {
			$scope.builds = {};
			var types = [];
			_.each(vpbuilds, function(vpbuild) {
				if (!$scope.builds[vpbuild.type]) {
					$scope.builds[vpbuild.type] = [];
					types.push(vpbuild.type);
				}
				vpbuild.built_at = new Date(vpbuild.built_at);
				$scope.builds[vpbuild.type].push(vpbuild);
			});
			_.each(types, function(type) {
				$scope.builds[type].sort(function(a, b) {
					return a.built_at.getTime() === b.built_at.getTime() ? 0 : (a.built_at.getTime() > b.built_at.getTime() ? -1 : 1);
				});
			});
		});


		$scope.reset = function() {

			var emptyMedia = {
				playfieldImage: {
					url: false,
					variations: {
						'medium-2x': { url: false }
					}
				},
				playfieldVideo: {
					url: false,
					variations: {
						'still': { url: false },
						'small-rotated': { url: undefined }
					}
				}
			};

			$scope.release = $localStorage.release = {
				authors: [{ user: AuthService.getUser(), roles: [ 'Table Creator' ]}],
				tags: [],
				links: [],
				vpbuilds: {
					developed: [],
					tested: [],
					incompat: []
				},
				_media: {},
				mediaFiles: {
					'abcd': _.cloneDeep(emptyMedia),
					'asdf': _.cloneDeep(emptyMedia)
				}
			};
		};


		$scope.removeFile = function(file) {
			FileResource.delete({ id: file.storage.id }, function() {
				$scope.files.splice($scope.files.indexOf(file), 1);

			}, ApiHelper.handleErrorsInDialog($scope, 'Error removing file.'));
		};


		$scope.onFilesUpload = function($files) {

			// 1. validate file types
			for (var i = 0; i < $files.length; i++) {
				var file = $files[i];
				var ext = file.name.substr(file.name.lastIndexOf('.') + 1, file.name.length);

				if (!_.contains(['image/jpeg', 'image/png'], file.type) && !_.contains(['vpt', 'vpx', 'vbs'], ext)) {
					//noinspection JSHint
					return $modal.open({
						templateUrl: 'common/modal-info.html',
						controller: 'InfoModalCtrl',
						resolve: {
							icon: function() { return 'fa-file-image-o'; },
							title: function() { return 'Image Upload'; },
							subtitle: function() { return 'Wrong file type!'; },
							message: function() { return 'Please upload a valid file type (more info to come).'; }
						}
					});
				}
			}

			// 2. upload files
			_.each($files, function(upload) {
				var fileReader = new FileReader();
				fileReader.readAsArrayBuffer(upload);
				fileReader.onload = function(event) {
					var key = upload.name; // TODO use another id, such as a hash or whatever so we can upload files with the same filename.
					var ext = upload.name.substr(upload.name.lastIndexOf('.') + 1, upload.name.length);
					var type = upload.type;
					if (!type) {
						switch (ext) {
							case 'vpt':
								type = 'application/x-visual-pinball-table';
								break;
							case 'vpx':
								type = 'application/x-visual-pinball-table-x';
								break;
							case 'vbs':
								type = 'application/vbscript';
								break;
						}
					}
					var file = {
						name: upload.name,
						bytes: upload.size,
						icon: DisplayService.fileIcon(type),
						uploaded: false,
						uploading: true,
						progress: 0,
						flavor: {}
					};
					$scope.files.push(file);
					$upload.http({
						url: '/storage',
						method: 'POST',
						params: { type: 'release' },
						headers: {
							'Content-Type': type,
							'Content-Disposition': 'attachment; filename="' + upload.name + '"'
						},
						data: event.target.result
					}).then(function(response) {
						file.uploading = false;
						file.storage = response.data;
					}, ApiHelper.handleErrorsInDialog($scope, 'Error uploading file.', function() {
						$scope.files.splice($scope.files.indexOf(file), 1);
					}), function (evt) {
						file.progress = parseInt(100.0 * evt.loaded / evt.total);
					});
				};
			});
		};


		$scope.addAuthor = function(author) {
			$modal.open({
				templateUrl: 'releases/modal-author-add.html',
				controller: 'ChooseAuthorCtrl',
				resolve: {
					release: function() { return $scope.release; },
					author: function() { return author; }
				}
			}).result.then(function(newAuthor) {
					if (author) {
						$scope.release.authors[$scope.release.authors.indexOf(author)] = newAuthor;
					} else {
						$scope.release.authors.push(newAuthor);
					}

				});
		};


		$scope.removeAuthor = function(author) {
			$scope.release.authors.splice($scope.release.authors.indexOf(author), 1);
		};


		$scope.createTag = function() {
			$modal.open({
				templateUrl: 'releases/modal-tag-create.html',
				controller: 'CreateTagCtrl'
			}).result.then(function(newTag) {
					$scope.tags.push(newTag);
				});
		};


		$scope.removeTag = function(tag) {
			$scope.release.tags.splice($scope.release.tags.indexOf(tag), 1);
			$scope.tags.push(tag);
		};


		$scope.addLink = function(link) {
			$scope.release.links.push(link);
			return {};
		};


		$scope.removeLink = function(link) {
			$scope.release.links.splice($scope.release.links.indexOf(link), 1);
		};


		$scope.addVPBuild = function() {
			$modal.open({
				templateUrl: 'releases/modal-vpbuild-create.html',
				controller: 'AddVPBuildCtrl',
				size: 'lg'
			}).result.then(function(newTag) {
					$scope.tags.push(newTag);
				});
		};


		/**
		 * Statuses
		 *
		 * - uploading
		 * - extracting still
		 * - generating thumb
		 * - finished
		 *
		 * @param {string} tableFileId Storage ID of the uploaded vpt
		 * @param {string} type Media type, e.g. "playfieldImage" or "playfieldVideo"
		 * @param {array} $files Uploaded file(s), assuming that one was chosen.
		 */
		$scope.onMediaUpload = function(tableFileId, type, $files) {

			var file = $files[0];
			var mimeType = MimeTypeService.fromFile(file);

			// init
			_.defaults($scope, { mediaFiles: {}});
			if (!$scope.mediaFiles[tableFileId]) {
				$scope.mediaFiles[tableFileId] = {};
			}
			$scope.mediaFiles[tableFileId][type] = {};

			if ($scope.release.mediaFiles[tableFileId][type] && $scope.release.mediaFiles[tableFileId][type].id) {
				FileResource.delete({ id : $scope.release.mediaFiles[tableFileId][type].id });

				$scope.release.mediaFiles[tableFileId][type] = {
					url: false,
					variations: {
						'medium-2x': { url: false },
						'still': { url: false }
					}
				};
				this.$emit('imageUnloaded');
			}

			// upload image
			var fileReader = new FileReader();
			fileReader.readAsArrayBuffer(file);
			fileReader.onload = function(event) {

				if (!$scope.release.mediaFiles[tableFileId]) {
					$scope.release.mediaFiles[tableFileId] = {};
				}
				$scope.release.mediaFiles[tableFileId][type] = { url: false };
				$scope.mediaFiles[tableFileId][type].uploaded = false;
				$scope.mediaFiles[tableFileId][type].uploading = true;
				$scope.mediaFiles[tableFileId][type].status = 'Uploading file...';
				$upload.http({
					url: ConfigService.storageUri(),
					method: 'POST',
					params: { type: 'playfield' },
					headers: {
						'Content-Type': mimeType,
						'Content-Disposition': 'attachment; filename="' + file.name + '"'
					},
					data: event.target.result
				}).then(function(response) {
					$scope.mediaFiles[tableFileId][type].uploading = false;
					$scope.mediaFiles[tableFileId][type].status = 'Uploaded';

					var mediaResult = response.data;
					$scope.release.mediaFiles[tableFileId][type].id = mediaResult.id;
					$scope.release.mediaFiles[tableFileId][type].url = AuthService.setUrlParam(mediaResult.url, mediaResult.is_protected);
					$scope.release.mediaFiles[tableFileId][type].variations = AuthService.setUrlParam(mediaResult.variations, mediaResult.is_protected);
					$scope.release.mediaFiles[tableFileId][type].metadata = mediaResult.metadata;

				}, ApiHelper.handleErrorsInDialog($scope, 'Error uploading image.', function() {
					$scope.mediaFiles[tableFileId][type] = {};

				}), function (evt) {
					$scope.mediaFiles[tableFileId][type].progress = parseInt(100.0 * evt.loaded / evt.total);
				});
			};
		};


		// either copy data from local storage or reset release data.
		if ($localStorage.release) {
			$scope.release  = $localStorage.release;
		} else {
			$scope.reset();
		}
	})


	.controller('ChooseAuthorCtrl', function($scope, $modalInstance, UserResource, release, author) {

		if (author) {
			$scope.author = author;
			$scope.user = author.user;
			$scope.roles = author.roles.slice();
			$scope.query = author.user.name;
			$scope.isValidUser = true;
		} else {
			$scope.user = null;
			$scope.roles = [];
			$scope.isValidUser = false;
		}
		$scope.adding = author ? false : true;
		$scope.errors = {};
		$scope.release = release;
		$scope.role = '';

		$scope.findUser = function(val) {
			return UserResource.query({ q: val }).$promise;
		};

		$scope.userSelected = function(item, model) {
			$scope.user = model;
			$scope.isValidUser = true;
		};

		$scope.queryChange = function() {
			$scope.isValidUser = false;
		};

		$scope.addRole = function(role) {
			if (role && !~$scope.roles.indexOf(role)) {
				$scope.roles.push(role);
			}
			$scope.role = '';
		};

		$scope.removeRole = function(role) {
			$scope.roles.splice($scope.roles.indexOf(role), 1);
		};

		$scope.add = function() {
			$scope.addRole($scope.role);

			var valid = true;
			if (!$scope.isValidUser) {
				$scope.errors.user = 'You must select a user. Typing after selecting a user erases the selected user.';
				valid = false;
			} else if (_.filter($scope.release.authors, function(author) { return author.user.id === $scope.user.id; }).length > 0 &&
				($scope.adding || $scope.user.id !== $scope.author.user.id)) {
				$scope.errors.user = 'User "' + $scope.user.name + '" is already added as author.';
				valid = false;
			} else {
				delete $scope.errors.user;
			}

			if ($scope.roles.length === 0) {
				$scope.errors.roles = 'Please add at least one role.';
				valid = false;
			} else if ($scope.roles.length > 3) {
				$scope.errors.roles = 'Three is the maxmimal number of roles an author can have. Please group roles if that\'s not enough.';
				valid = false;
			} else {
				delete $scope.errors.roles;
			}

			if (valid) {
				$modalInstance.close({ user: $scope.user, roles: $scope.roles });
			}
		};
	})


	.controller('CreateTagCtrl', function($scope, $modalInstance, ApiHelper, TagResource) {

		$scope.tag = {};
		$scope.create = function() {
			TagResource.save($scope.tag, function(tag) {
				$modalInstance.close(tag);

			}, ApiHelper.handleErrors($scope));
		};
	})


	.controller('AddVPBuildCtrl', function($scope, $modalInstance, ApiHelper, VPBuildResource) {

		$scope.vpbuild = {};
		$scope.showWeeks = false;

		$scope.openCalendar = function($event) {
			$event.preventDefault();
			$event.stopPropagation();

			$scope.calendarOpened = true;
		};

		$scope.add = function() {
			VPBuildResource.save($scope.tag, function(tag) {
				$modalInstance.close(tag);

			}, ApiHelper.handleErrors($scope));
		};
	});