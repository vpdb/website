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

import { defaults } from 'lodash';

import ModalQuestionTpl from './modal.question.pug';
import ModalMarkdownDocTpl from './modal.markdown.doc.pug';
import ModalErrorInfoTpl from './modal.error.info.pug';

export default class ModalService {

	/**
	 * @param $uibModal
	 * @param ModalMarkdownFiddle
	 * @ngInject
	 */
	constructor($uibModal, $log, ModalMarkdownFiddle) {
		this.$uibModal = $uibModal;
		this.$log = $log;
		this.ModalMarkdownFiddle = ModalMarkdownFiddle;
		this._flashMessage = null;
	}

	/**
	 * Displays an error dialog.
	 * @param {object} data Scope variables. Properties:
	 *     <li> `icon`: title bar icon, default "warning"
	 *     <li> `title`: title in dialog bar, default ""
	 *     <li> `subtitle`: body title
	 *     <li> `message`: body message
	 *     <li> `close`: text of the close button
	 * @param {boolean} [flash] If true, the dialog isn't displayed instantly but on the next page.
	 */
	error(data, flash) {
		return this._modal(data, { icon: 'warning', title: 'Ooops!', close: 'Close' }, flash);
	}


	/**
	 * Displays an error dialog.
	 * @param {object} data Scope variables. Properties:
	 *     <li> `icon`: title bar icon, default "info"
	 *     <li> `title`: title in dialog bar
	 *     <li> `subtitle`: body title
	 *     <li> `message`: body message
	 *     <li> `close`: text of the close button, default "close".
	 * @param {boolean} [flash] If true, the dialog isn't displayed instantly but on the next page.
	 */
	info(data, flash) {
		return this._modal(data, { icon: 'info', close: 'Close' }, flash);
	}

	markdown() {
		return this.$uibModal.open({
			templateUrl: ModalMarkdownDocTpl,
			controller: 'ModalCtrl',
			controllerAs: 'vm',
			resolve: { data: () => this.ModalMarkdownFiddle },
			size: 'lg'
		});
	}


	/**
	 * Displays a question dialog.
	 * @param {object} data Scope variables. Properties:
	 *     <li> `icon`: title bar icon, default "question-circle"
	 *     <li> `title`: title in dialog bar
	 *     <li> `message`: message before the question
	 *     <li> `question`: question (centered)
	 *     <li> `yes`: text of the yes button, default "Yes"
	 *     <li> `no`: text of the no button, default "No"
	 */
	question(data) {
		const deflt = {
			icon: 'question-circle',
			yes: 'Yes',
			no: 'No'
		};
		data = defaults(data, deflt);

		return this.$uibModal.open({
			templateUrl: ModalQuestionTpl,
			controller: 'ModalCtrl',
			controllerAs: 'vm',
			resolve: { data: () => data }
		});
	}


	/**
	 * Displays a simple dialog.
	 * @see #error
	 * @see #info
	 * @param {object} data Scope variables under `data`.
	 * @param {object} defaultValues Default scope variables
	 * @param {boolean} flash If true, the dialog isn't displayed instantly but on the next page.
	 * @private
	 */
	_modal(data, defaultValues, flash) {

		data = defaults(data, defaultValues);
		if (flash) {
			this._flashMessage = data;
		} else {
			// if connection broke and the html isn't cached, this will fail too
			try {
				return this.$uibModal.open({
					templateUrl: ModalErrorInfoTpl,
					controller: 'ModalCtrl',
					controllerAs: 'vm',
					resolve: { data: () => data }
				});
			} catch (err) {
				this.$log.error(err);
			}
		}
	}
}
