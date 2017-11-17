import { browser, element, by } from 'protractor';

export class HomePage {

	searchInput = element(by.model('vm.q'));
	searchResult = element(by.id('search-result'));
	noResult = element(by.id('no-result'));
	panel = element(by.id('whats-this'));
	panelToggle = element(by.id('toggle'));
	panelTitle = this.panel.element(by.css('h3'));
	panelClose = this.panel.element(by.css('.clear > svg'));

	loginButton = element(by.id('login-btn'));
	loginModal = element(by.id('login-modal'));

	get() {
		browser.get(browser.params.url);
	}

	search(query: string) {
		this.searchInput.sendKeys(query);
	}

	togglePanel() {
		this.panelToggle.click();
	}

	getNoResult() {
		return this.noResult.getText();
	}

	openLoginModal() {
		this.loginButton.click();
	}
}