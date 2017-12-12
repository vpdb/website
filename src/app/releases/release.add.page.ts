import { resolve } from 'path';
import { browser, by, element } from 'protractor';
import { promise } from 'selenium-webdriver';
import { Game } from '../../test/models/Game';
import { BasePage } from '../../test/BasePage';
import { AppPage } from '../app.page';

export class ReleaseAddPage extends BasePage {

	private appPage = new AppPage();

	private name = element(by.id('name'));
	private filesUpload = element(by.id('ngf-files-upload'));
	private filesUploadPanel = element(by.id('files-upload'));
	private version = element(by.id('version'));
	private resetButton = element(by.id('reset-btn'));
	private submitButton = element(by.id('submit-btn'));

	get(game:Game) {
		this.appPage.get();
		this.appPage.loginAs('member');
		browser.get(browser.baseUrl + '/games/' + game.id + '/add-release');
	}

	clearAuthors() {
		const authors = element.all(by.repeater('author in vm.release.authors'));
		authors.each(author => {
			browser.actions().mouseMove(author).perform();
			const delButton = author.element(by.css('[ng-click="vm.removeAuthor(author)"]'));
			delButton.click();
		});
	}

	uploadFile(fileName:string) {
		const path = resolve(__dirname, '../../../../src/test/assets/', fileName);
		this.filesUploadPanel.click();
		this.filesUpload.sendKeys(path);
	}

	reset() {
		this.resetButton.click();
	}

	submit() {
		this.submitButton.click();
	}

	hasFileUploadValidationError(): promise.Promise<boolean> {
		return this.hasClass(this.filesUploadPanel, 'error');
	}

	hasNameValidationError(): promise.Promise<boolean> {
		return this.hasClass(this.formGroup(this.name), 'error');
	}

	hasVersionValidationError(): promise.Promise<boolean> {
		return this.hasClass(this.formGroup(this.version), 'error');
	}

	hasAuthorValidationError(): promise.Promise<boolean> {
		return element(by.css('.alert[ng-show="vm.errors.authors"]')).isDisplayed();
	}

	hasLicenseValidationError(): promise.Promise<boolean> {
		return element(by.css('.alert[ng-show="vm.errors.license"]')).isDisplayed();
	}

	hasFlavorValidationError(filename:string): promise.Promise<boolean> {
		return this.hasClass(this.parentWithText('flavors', filename), 'error');
	}

	hasCompatibilityValidationError(filename:string): promise.Promise<boolean> {
		return this.hasClass(this.parentWithText('compatibility', filename), 'error');
	}

	hasPlayfieldImageValidationError(filename:string): promise.Promise<boolean> {
		return this.parentWithText('media', filename, 'span', 'ng-scope').element(by.css('.alert')).isDisplayed();
	}
}