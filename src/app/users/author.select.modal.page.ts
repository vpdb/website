import { by, element, ElementArrayFinder } from 'protractor';
import { promise } from 'selenium-webdriver';
import { BasePage } from '../../test/BasePage';

export class AuthorSelectModalPage extends BasePage {

	private searchBox = element(by.id('user-search'));
	private searchResult = element(by.css('#user-search + ul.dropdown-menu'));
	private searchResults = this.searchResult.all(by.repeater('match in matches track by $index'));
	private submitButton = element(by.id('submit-btn'));
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
		element(by.id('cancel-btn')).click();
	}

	submit() {
		this.submitButton.click();
	}

	private findRole(title:string): ElementArrayFinder {
		return this.addedRoles.filter(r => r.getText().then(role => role === title + '×'));
	}
}