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

import { by, element, ElementArrayFinder } from 'protractor';
import { promise } from 'selenium-webdriver';
import { BasePage } from '../../test/BasePage';

export class AuthorSelectModalPage extends BasePage {

	private searchBox = element(by.id('user-search'));
	private searchResult = element(by.css('#user-search + ul.dropdown-menu'));
	private searchResults = this.searchResult.all(by.repeater('match in matches track by $index'));
	private submitButton = element(by.id('author-submit-btn'));
	private addedRoles = element.all(by.repeater('r in vm.roles'));

	search(name: string) {
		this.searchBox.sendKeys(name);
	}

	hasSearchResults(): promise.Promise<boolean> {
		return this.searchResults.count().then(count => count > 0);
	}

	selectSearchResult(nameOrPosition: string|number) {
		if (typeof nameOrPosition === 'string') {
			this.searchResults.filter(r => r.element(by.css('h3')).getText().then(text => text === nameOrPosition)).first().click();
		} else {
			this.searchResults.get(nameOrPosition).click();
		}
	}

	getSelectedName(): promise.Promise<string> {
		return this.searchBox.getAttribute('value');
	}

	setRole(title: string) {
		element(by.id('role')).sendKeys(title);
	}

	addRole(title: string = '') {
		if (title) {
			this.setRole(title);
		}
		element(by.id('add-btn')).click();
	}

	removeRole(title:string) {
		this.findRole(title).then(roles => roles[0].element(by.css('.a')).click());
	}

	hasRole(title: string): promise.Promise<boolean> {
		return this.findRole(title).then(roles => roles.length === 1);
	}

	hasAuthorValidationError() {
		return this.hasClass(this.formGroup(this.searchBox), 'error');
	}

	hasRoleValidationError() {
		return element(by.css('.alert[ng-show="vm.errors.roles"]')).isDisplayed();
	}

	getSubmitButtonText(): promise.Promise<string> {
		return this.submitButton.getText();
	}

	dismiss() {
		element(by.id('author-cancel-btn')).click();
	}

	submit() {
		this.submitButton.click();
	}

	private findRole(title:string): ElementArrayFinder {
		return this.addedRoles.filter(r => r.getText().then(role => role === title + '×'));
	}
}