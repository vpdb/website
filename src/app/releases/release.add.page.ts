import { Game } from "../../test/models/Game";
import { AppPage } from "../app.page";
import { browser, by, element } from "protractor";

export class ReleaseAddPage {

	appPage = new AppPage();

	submitButton = element(by.id('submit-btn'));

	get(game:Game) {
		this.appPage.get();
		this.appPage.loginAs('member');
		browser.get(browser.baseUrl + '/games/' + game.id + '/add-release');
	}

	submit() {
		this.submitButton.click();
	}
}