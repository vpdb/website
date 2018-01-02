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

import { by, ElementFinder } from 'protractor';

export class ModalErrorInfoPage {

	title = this.element.element(by.exactBinding ('vm.data.title'));
	subtitle = this.element.element(by.exactBinding ('vm.data.subtitle'));
	message = this.element.element(by.exactBinding ('vm.data.message'));
	closeButton = this.element.element(by.id ('modal-close'));

	constructor(public element: ElementFinder) {
	}

	close() {
		this.closeButton.click();
	}
}