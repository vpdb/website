import { resolve } from 'path'
import { by, element, ElementFinder } from 'protractor';
import { AppPage } from "../app.page";

export class GameAddAdminPage {

	title = element(by.id('title'));
	ipdbUrl = element(by.id('ipdb-url'));
	ipdbFetchButton = element(by.id('ipdb-fetch'));
	gameIdRecreation = element(by.id('game-id-1'));
	resetButton = element(by.id('reset-btn'));
	submitButton = element(by.id('submit-btn'));
	gameInfoPanel = element(by.id('game-info-panel'));
	gameInfoTitle = this.gameInfoPanel.element(by.css('h2'));

	backglassError = element(by.css('[ng-show="vm.errors[\'_backglass\']"]'));

	backglassUploadSelect = element(by.id('backglass-upload'));
	backglassUpload = element(by.id('ngf-backglass-upload'));
	logoUpload = element(by.id('ngf-logo-upload'));

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

	reset() {
		this.resetButton.click();
	}

	fetchIpdb(ipdb:string) {
		this.ipdbUrl.sendKeys(ipdb);
		this.ipdbFetchButton.click();
	}

	uploadBackglass(fileName:string) {
		const path = resolve(__dirname, '../../../../src/test/assets/', fileName);
		this.backglassUploadSelect.click();
		this.backglassUpload.sendKeys(path);
	}

	static formGroup(input: ElementFinder) {
		return input.element(by.xpath('./ancestor::div[contains(concat(" ", @class, " "), " form-group ")][1]'));
	}

}