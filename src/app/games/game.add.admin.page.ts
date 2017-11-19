import { promise } from 'selenium-webdriver';
import { browser, element, by, ElementFinder } from 'protractor';
import { AppPage } from "../app.page";

export class GameAddAdminPage {

	title = element(by.id('title'));
	ipdbUrl = element(by.id('ipdb-url'));
	ipdbFetchButton = element(by.id('ipdb-fetch'));
	gameIdRecreation = element(by.id('game-id-1'));
	resetButton = element(by.id('reset-btn'));
	submitButton = element(by.id('submit-btn'));

	backglassError = element(by.css('[ng-show="vm.errors[\'_backglass\']"]'));

	get() {
		const appPage = new AppPage();
		appPage.get();
		appPage.loginAs('contributor');
		appPage.uploadButton.click();
		appPage.uploadGameButton.click();
	}

	submit() {
		this.submitButton.click();
	}

	static formGroup(input: ElementFinder) {
		return input.element(by.xpath('./ancestor::div[contains(concat(" ", @class, " "), " form-group ")][1]'));
	}

}