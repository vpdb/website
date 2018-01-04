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

import { clone } from 'lodash';

import ModalErrorInfoTpl from './modal.error.info.pug';

/**
 * Provides easy access to spawning modal messages.
 *
 * @author freezy <freezy@vpdb.io>
 */
export default class ModalFlashService {

	/**
	 * @param $uibModal
	 * @param {ModalService} ModalService
	 * @ngInject
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
				templateUrl: ModalErrorInfoTpl,
				controller: 'ModalCtrl',
				controllerAs: 'vm',
				resolve: { data: () => data }
			});
		}
	}
}