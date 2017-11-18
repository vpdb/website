import { promise } from 'selenium-webdriver';
import { browser, element, by } from 'protractor';
import { LoginModalPage } from './auth/login.modal.page';

export class AppPage {

	loggedUser = element(by.id('logged-user'));
	loginButton = element(by.id('login-btn'));
	loginModal = new LoginModalPage(element(by.id('login-modal')));
	logoutButton = element(by.id('logout-btn'));

	get() {
		browser.get(browser.params.url);
	}

	openLoginModal(): promise.Promise<void> {
		return this.loginButton.click();
	}

	loginAs(username: string) {
		this.openLoginModal();
		this.loginModal.toggleLogin();
		this.loginModal.setLogin(browser.users[username].username, browser.users[username].password);
		this.loginModal.submitLogin();
	}

	logout() {
		this.loggedUser.click();
		this.logoutButton.click();
	}
}