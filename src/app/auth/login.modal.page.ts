import { browser, element, by, ElementHelper, ElementFinder } from 'protractor';

export class LoginModalPage {

	constructor(public element:ElementFinder) {
	}

	public loginUsername = this.element.element(by.id('login-username'));
	public loginPassword = this.element.element(by.id('login-password'));
	public loginSubmit = this.element.element(by.id('login-submit'));
	public registerEmail = this.element.element(by.id('register-email'));
	public registerUsername = this.element.element(by.id('register-username'));
	public registerPassword = this.element.element(by.id('register-password'));
	public registerSubmit = this.element.element(by.id('register-submit'));
	public toggleButton = this.element.element(by.id('login-toggle'));

	toggle() {
		this.toggleButton.click();
	}

	setRegister(email:string, username:string, password:string) {
		this.registerEmail.sendKeys(email);
		this.registerUsername.sendKeys(username);
		this.registerPassword.sendKeys(password);
	}

	submitRegister() {
		this.registerSubmit.click();
	}

	setLogin(username:string, password:string) {
		this.loginUsername.sendKeys(username);
		this.loginPassword.sendKeys(password);
	}

	submitLogin() {
		this.loginSubmit.click();
	}

	formGroup(input:ElementFinder) {
		return input.element(by.xpath('./ancestor::div[contains(concat(" ", @class, " "), " form-group ")][1]'));
	}

}