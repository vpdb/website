import { promise } from 'selenium-webdriver';
import { Game } from '../../test/models/Game';
import { BasePage } from '../../test/BasePage';
import { AppPage } from '../app.page';
import { browser, by, element } from 'protractor';

export class ReleaseAddPage extends BasePage {

	appPage = new AppPage();

	name = element(by.id('name'));
	fileUpload = element(by.id('ngf-file-upload'));
	fileUploadPanel = element(by.id('file-upload'));
	version = element(by.id('version'));
	submitButton = element(by.id('submit-btn'));

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

	submit() {
		this.submitButton.click();
	}

	hasFileUploadValidationError(): promise.Promise<boolean> {
		return this.hasClass(this.fileUploadPanel, 'error');
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
}