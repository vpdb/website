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

import { by, element } from 'protractor';
import { BasePage } from '../../../../test/BasePage';

export class TagAddModalPage extends BasePage {

	private name = element(by.id('tag-name'));
	private description = element(by.id('tag-description'));
	private submitButton = element(by.id('tag-submit-btn'));

	async setName(name: string) {
		await this.name.sendKeys(name);
	}

	async setDescription(description: string) {
		await this.description.sendKeys(description);
	}

	async hasNameValidationError() {
		return await this.hasClass(this.formGroup(this.name), 'error');
	}

	async hasDescriptionValidationError() {
		return await this.hasClass(this.formGroup(this.description), 'error');
	}

	async dismiss() {
		await element(by.id('tag-cancel-btn')).click();
	}

	async submit() {
		await this.submitButton.click();
	}
}
