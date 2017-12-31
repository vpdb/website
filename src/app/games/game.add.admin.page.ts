import { resolve } from 'path'
import { browser, by, element, ElementFinder } from 'protractor';
import { AppPage } from '../app.page';
import { BasePage } from '../../test/BasePage';
import { promise } from 'selenium-webdriver';

export class GameAddAdminPage extends BasePage {

	appPage = new AppPage();

	title = element(by.id('title'));
	ipdbUrl = element(by.id('ipdb-url'));
	ipdbFetchButton = element(by.id('ipdb-fetch'));
	gameIdRecreation = element(by.id('game-id-1'));
	resetButton = element(by.id('game-reset-btn'));
	submitButton = element(by.id('game-submit-btn'));
	gameInfoPanel = element(by.id('game-info-panel'));
	gameInfoTitle = this.gameInfoPanel.element(by.css('h2'));

	backglassUpload = element(by.id('ngf-backglass-upload'));
	backglassUploadPanel = element(by.id('backglass-upload'));
	backglassImage = this.backglassUploadPanel.element(by.css('.img--ar-bg'));
	backglassProgress = this.backglassUploadPanel.element(by.css('.progress'));

	logoUpload = element(by.id('ngf-logo-upload'));
	logoUploadPanel = element(by.id('logo-upload'));
	logoImage = this.logoUploadPanel.element(by.css('.img--ar-logo'));
	logoProgress = this.logoUploadPanel.element(by.css('.progress'));

	get() {
		this.appPage.get();
		this.appPage.loginAs('contributor');
		this.navigate();
	}

	navigate() {
		this.appPage.uploadButton.click();
		this.appPage.uploadGameButton.click();
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
		this.backglassUploadPanel.click();
		this.backglassUpload.sendKeys(path);
		browser.wait(() => this.backglassProgress.isDisplayed().then(result => !result), 5000);
	}

	uploadLogo(fileName:string) {
		const path = resolve(__dirname, '../../../../src/test/assets/', fileName);
		this.logoUploadPanel.click();
		this.logoUpload.sendKeys(path);
		browser.wait(() => this.logoProgress.isDisplayed().then(result => !result), 5000);
	}

	hasTitleValidatorErrors(): promise.Promise<boolean> {
		return this.hasClass(this.formGroup(this.title), 'error');
	}

	hasRecreationIdValidationErrors(): promise.Promise<boolean> {
		return this.hasClass(this.formGroup(this.gameIdRecreation), 'error');
	}

	hasBackglassValidationErrors() {
		return element(by.css(`[ng-show="vm.errors['_backglass']"]`)).isDisplayed();
	}

}