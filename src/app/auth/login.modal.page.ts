import { promise } from 'selenium-webdriver';
import { browser, element, by, ElementHelper, ElementFinder } from 'protractor';

export class LoginModalPage {

	public static EMAIL = "root@vpdb.io";
	public static USERNAME = "root";
	public static PASSWORD = "abc123";

	constructor(public element: ElementFinder) {
	}

	public loginUsername = this.element.element(by.id('login-username'));
	public loginPassword = this.element.element(by.id('login-password'));
	public loginSubmit = this.element.element(by.id('login-submit'));
	public registerEmail = this.element.element(by.id('register-email'));
	public registerUsername = this.element.element(by.id('register-username'));
	public registerPassword = this.element.element(by.id('register-password'));
	public registerSubmit = this.element.element(by.id('register-submit'));
	public toggleButton = this.element.element(by.id('login-toggle'));
	public dismissButton = this.element.element(by.id('dismiss-button'));
	public successMessage = this.element.element(by.css('.modal-body > .alert-success[ng-show="vm.message"]'));

	toggle(): promise.Promise<void> {
		return this.toggleButton.click();
	}

	toggleRegister() {
		return this.registerSubmit.isDisplayed().then(isDisplayed => {
			if (!isDisplayed) {
				return this.toggle();
			}
			return null;
		});
	}

	setRegister(email:string, username:string, password:string) {
		this.registerEmail.sendKeys(email);
		this.registerUsername.sendKeys(username);
		this.registerPassword.sendKeys(password);
	}

	submitRegister() {
		this.registerSubmit.click();
	}

	toggleLogin() {
		return this.loginSubmit.isDisplayed().then(isDisplayed => {
			if (!isDisplayed) {
				return this.toggle();
			}
			return null;
		});
	}

	setLogin(username:string, password:string) {
		this.loginUsername.sendKeys(username);
		this.loginPassword.sendKeys(password);
	}

	submitLogin() {
		this.loginSubmit.click();
	}

	login() {
		return this.loginSubmit.isDisplayed().then(isDisplayed => {
			if (!isDisplayed) {
				this.toggle();
			}
			this.setLogin(LoginModalPage.USERNAME, LoginModalPage.PASSWORD);
			this.submitLogin();
		});
	}


	dismiss(): promise.Promise<void> {
		return this.dismissButton.click();
	}

	static formGroup(input: ElementFinder) {
		return input.element(by.xpath('./ancestor::div[contains(concat(" ", @class, " "), " form-group ")][1]'));
	}

}