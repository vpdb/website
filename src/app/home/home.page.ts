import { promise } from 'selenium-webdriver';
import { browser, element, by } from 'protractor';
import { LoginModalPage } from '../auth/login.modal.page';

export class HomePage {

	loggedUser = element(by.id('logged-user'));
	searchInput = element(by.model('vm.q'));
	searchResult = element(by.id('search-result'));
	noResult = element(by.id('no-result'));
	panel = element(by.id('whats-this'));
	panelToggle = element(by.id('toggle'));
	panelTitle = this.panel.element(by.css('h3'));
	panelClose = this.panel.element(by.css('.clear > svg'));

	get() {
		browser.get(browser.params.url);
	}

	search(query: string) {
		this.searchInput.sendKeys(query);
	}

	clearSearch() {
		this.searchInput.clear();
	}

	togglePanel() {
		this.panelToggle.click();
	}

	closePanel() {
		this.panelClose.click();
	}

	getNoResult(): promise.Promise<string> {
		return this.noResult.getText();
	}
}