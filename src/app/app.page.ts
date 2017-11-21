import { browser, by, element, ExpectedConditions as until } from 'protractor';
import { LoginModalPage } from './auth/login.modal.page';

export class AppPage {

	userButton = element(by.id('user-btn'));
	loginButton = element(by.id('login-btn'));
	loginModal = new LoginModalPage(element(by.id('login-modal')));
	logoutButton = element(by.id('logout-btn'));

	uploadButton = element(by.id('upload-btn'));
	uploadGameButton = element(by.id('upload-game-btn'));
	uploadReleaseButton = element(by.id('upload-release-btn'));
	uploadBackglassButton = element(by.id('upload-backglass-btn'));

	spinner = element(by.css('.spinner'));

	get() {
		browser.get(browser.baseUrl);
	}

	openLoginModal() {
		this.loginButton.click();
		browser.wait(until.presenceOf(this.loginModal.element), 1000);
	}

	loginAs(username: string) {
		this.openLoginModal();
		this.loginModal.toggleLogin();
		this.loginModal.setLogin(browser.users[username].username, browser.users[username].password);
		this.loginModal.submitLogin();
	}

	logout() {
		this.userButton.click();
		this.logoutButton.click();
	}

	isLoading() {
		this.spinner.isDisplayed();
	}

	waitUntilLoaded() {
		browser.wait(() => this.spinner.isDisplayed().then(result => !result), 10000);
	}

	waitUtilFinished() {
		browser.wait(() => this.loginButton.isDisplayed(), 1000);
	}

	getLoggedUsername() {
		//const user = JSON.parse(browser.executeScript("return window.localStorage.getItem('key');");
		//expect(value).toEqual(expectedValue);
		//browser.wait(() => element(by.css('img.img-avatar')).isDisplayed(), 1000);
		//return this.loggedUser.getAttribute('textContent');
		return browser.driver.executeScript("return document.getElementById('logged-user').innerHTML");
	}
}