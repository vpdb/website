import { clone } from 'lodash';

const modalErrorInfoTpl = require('./modal.error.info.pug')();

/**
 * Provides easy access to spawning modal messages.
 *
 * @author freezy <freezy@vpdb.io>
 */
export default class ModalFlashService {

	/**
	 * @param $uibModal
	 * @param {ModalService} ModalService
	 */
	constructor($uibModal, ModalService) {
		this.$uibModal = $uibModal;
		this.ModalService = ModalService;
	}

	/**
	 * Displays an error dialog on the next page.
	 * @param {object} data Scope variables. Properties:
	 *     - `icon`: title bar icon, default 'warning'
	 *     - `title`: title in dialog bar, default ""
	 *     - `subtitle`: body title
	 *     - `message`: body message
	 *     - `close`: text of the close button
	 */
	error(data) {
		return this.ModalService.error(data, true);
	}

	/**
	 * Displays an info dialog on the next page.
	 * @param {object} data Scope variables. Properties:
	 *     - `icon`: title bar icon, default 'info'
	 *     - `title`: title in dialog bar
	 *     - `subtitle`: body title
	 *     - `message`: body message
	 *     - `close`: text of the close button, default "close".
	 */
	info(data) {
		return this.ModalService.info(data, true);
	}

	/**
	 * Displays the flash message, if there's any.
	 */
	process() {
		if (this.ModalService._flashMessage) {
			const data = clone(this.ModalService._flashMessage);
			this.ModalService._flashMessage = null;
			this.$uibModal.open({
				template: modalErrorInfoTpl,
				resolve: { data: () => data }
			});
		}
	}
}