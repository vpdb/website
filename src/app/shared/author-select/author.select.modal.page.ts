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

import { by, element, ElementArrayFinder } from 'protractor';
import { promise } from 'selenium-webdriver';
import { BasePage } from '../../../test/BasePage';

export class AuthorSelectModalPage extends BasePage {

	private searchBox = element(by.id('user-search'));
	private searchResult = element(by.css('#user-search + ul.dropdown-menu'));
	private searchResults = this.searchResult.all(by.repeater('match in matches track by $index'));
	private submitButton = element(by.id('author-submit-btn'));
	private addedRoles = element.all(by.repeater('r in vm.roles'));

	async search(name: string) {
		await this.searchBox.sendKeys(name);
	}

	async hasSearchResults(): Promise<boolean> {
		const count = await this.searchResults.count();
		return count > 0;
	}

	async selectSearchResult(nameOrPosition: string|number) {
		if (typeof nameOrPosition === 'string') {
			await this.searchResults.filter(r => r.element(by.css('h3')).getText().then(text => text === nameOrPosition)).first().click();
		} else {
			await this.searchResults.get(nameOrPosition).click();
		}
	}

	async getSelectedName(): Promise<string> {
		return await this.searchBox.getAttribute('value');
	}

	async setRole(title: string) {
		await element(by.id('role')).sendKeys(title);
	}

	async addRole(title: string = '') {
		if (title) {
			await this.setRole(title);
		}
		await element(by.id('add-btn')).click();
	}

	async removeRole(title:string) {
		const roles = await this.findRole(title);
		await roles[0].element(by.css('.a')).click();
	}

	async hasRole(title: string): Promise<boolean> {
		const roles = await this.findRole(title);
		return roles.length === 1;
	}

	async hasAuthorValidationError() {
		return await this.hasClass(this.formGroup(this.searchBox), 'error');
	}

	async hasRoleValidationError() {
		return await element(by.css('.alert[ng-show="vm.errors.roles"]')).isDisplayed();
	}

	async getSubmitButtonText(): Promise<string> {
		return await this.submitButton.getText();
	}

	async dismiss() {
		await element(by.id('author-cancel-btn')).click();
	}

	async submit() {
		await this.submitButton.click();
	}

	private findRole(title:string): ElementArrayFinder {
		return this.addedRoles.filter(r => r.getText().then(role => role === title + '×'));
	}
}
