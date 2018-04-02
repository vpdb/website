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

/**
 * Uploads files to the server and stores the result.
 *
 * Pass the following parameters:
 *
 *  - `controller`: Instance of the scope's controller
 *  - `type`:       Upload type posted to the API
 *  - `status`:     A list where the status of the uploaded file is pushed to. If
 *                  you additionally provide `key`, it'll be added as a property
 *                  with the given key.
 *  - `key`:        If set, set status and response as property instead of array
 *                  element
 *  - `onSuccess`:  function called when upload successfully finishes
 *  - `onClear`:    function called when a previous upload was deleted
 *  - `onError`:    function called when the upload failed
 *  - `allowedExtensions`: Only allow file extensions of this array if specified.
 *  - 'allowMultipleFiles`: Allow multiple files if true. Default false.
 *
 * All parameters must be already initialized.
 *
 * @param $parse
 * @param $compile
 * @param $log
 * @param {Upload} Upload The module from ng-file-upload
 * @param {ApiHelper} ApiHelper
 * @param {AuthService} AuthService
 * @param {ModalService} ModalService
 * @param {FileUploadHelperService} FileUploadHelperService
 * @param {ConfigService} ConfigService
 * @param FileResource
 * @ngInject
 */
export default function($parse, $compile, $log, Upload, ApiHelper, AuthService, ModalService,
			FileUploadHelperService, ConfigService, FileResource) {
	return {
		restrict: 'A',
		scope: true,
		terminal: true,
		priority: 1000,
		link: function(scope, element, attrs) {

			// parse parameters
			const params = $parse(attrs.fileUpload)(scope);
			const fctName = 'onFilesUpload';

			if (!params.controller) {
				throw new Error('Must define `controller` in `file-upload` directive!');
			}

			// add file drop directive: https://github.com/danialfarid/ng-file-upload#file-drop
			element.attr('ngf-drop', 'true');
			element.attr('ngf-change', fctName + '($files)');
			if (!params.disableSelect) {
				element.attr('ngf-select', fctName + '($files)');
			}
			element.attr('ngf-multiple', params.allowMultipleFiles === true ? 'true' : 'false');

			// remove the attribute to avoid indefinite loop
			element.removeAttr('file-upload');
			$compile(element)(scope);

			// can be removed at some point..
			if (params.key && params.allowMultipleFiles) {
				$log.error('Multiple files allowed AND key set. Probably a bug?');
				return;
			}

			scope[fctName] = $files => {

				if (!$files) {
					return;
				}

				// parse again, in case refs have changed (like, someone pressed the reset button).
				const params = $parse(attrs.fileUpload)(scope);

				// check for multiple files
				let allowMultipleFiles = params.allowMultipleFiles === true;
				if (!allowMultipleFiles && $files.length > 1) {
					$log.error('Cannot upload multiple files: ');
					$files.forEach(file => $log.error('-> %s (%s bytes)', file.name, file.size));

					return ModalService.info({
						icon: 'upload-circle',
						title: 'File Upload',
						subtitle: 'Multiple files',
						message: 'You cannot upload multiple files. Please drop only a single file.'
					});
				}

				// validate file types
				for (let i = 0; i < $files.length; i++) {
					const file = $files[i];
					const ext = file.name.substr(file.name.lastIndexOf('.') + 1, file.name.length).toLowerCase();
					if (!params.allowedExtensions.includes(ext)) {
						return ModalService.info({
							icon: 'upload-circle',
							title: 'File Upload',
							subtitle: 'Wrong file type.',
							message: 'Please upload a valid file type. Allowed file extensions: ' + params.allowedExtensions.join(', ')
						});
					}
				}

				// upload files
				$files.forEach(file => {

					// delete if exists
					if (params.key && params.status[params.key] && params.status[params.key].storage && params.status[params.key].storage.id) {
						FileResource.delete({ id : params.status[params.key].storage.id });
						if (params.onClear) {
							params.onClear.bind(params.controller)(params.key);
						}
						scope.$emit('imageUnloaded');
					}

					// setup result variables
					const mimeType = FileUploadHelperService.getMimeType(file);
					const status = {
						name: file.name,
						bytes: file.size,
						mimeType: mimeType,
						icon: FileUploadHelperService.fileIcon(mimeType),
						uploaded: false,
						uploading: true,
						progress: 0,
						text: 'Uploading file...',
						storage: {},
						key: params.key,
						randomId: FileUploadHelperService.makeid(32)
					};

					if (params.key) {
						params.status[params.key] = status;
					} else {
						params.status.push(status);
					}

					// run pre-function if defined
					if (params.beforeUpload) {
						params.beforeUpload.bind(params.controller)(status);
					}

					// post data
					Upload.upload({
						url: ConfigService.storageUri('/v1/files'),
						method: 'POST',
						params: { type: params.type, content_type: mimeType },
						data: { file: file }

					}).then(response => {

						status.uploading = false;
						status.storage = response.data;

						params.onSuccess.bind(params.controller)(status);

					}, ApiHelper.handleErrorsInDialog('Error uploading file.', () => {
						if (params.onError) {
							params.onError.bind(params.controller)(status);
						}
						if (params.key) {
							delete params.status[params.key];
						} else {
							params.status.splice(params.status.indexOf(status), 1);
						}
					}), evt => status.progress = parseInt(100.0 * evt.loaded / evt.total));
				});
			};
		}
	};
}