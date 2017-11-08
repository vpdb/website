import { browser, element, by } from 'protractor';

export class HomePage {
	searchInput = element(by.model('vm.q'));
	noResult = element(by.id('noresult'));

	get() {
		browser.get('http://localhost:3333/');
	}

	search(query: string) {
		this.searchInput.sendKeys(query);
	}

	getNoResult() {
		return this.noResult.getText();
	}
}