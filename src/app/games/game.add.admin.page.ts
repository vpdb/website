import { promise } from 'selenium-webdriver';
import { browser, element, by } from 'protractor';
import { AppPage } from "../app.page";

export class GameAddAdminPage {

	title = element(by.id('title'));

	get() {
		const appPage = new AppPage();
		appPage.get();
		appPage.loginAs('contributor');
		appPage.uploadButton.click();
		appPage.uploadGameButton.click();
	}

}