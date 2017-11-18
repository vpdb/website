import { browser, protractor } from 'protractor';
import { LoginModalPage } from './login.modal.page';
import { HomePage } from '../home/home.page';
import { internet } from 'faker';

const until = protractor.ExpectedConditions;

describe('Login Modal', () => {

	beforeAll(() => {
		this.homePage = new HomePage();
		this.homePage.get();
		this.homePage.openLoginModal();

		this.loginModal = this.homePage.loginModal;
	});

	it('should toggle between login and register', () => {
		this.loginModal.toggleLogin();
		expect(this.loginModal.loginSubmit.isDisplayed()).toBeTruthy();
		expect(this.loginModal.registerSubmit.isDisplayed()).not.toBeTruthy();
		expect(this.loginModal.toggleButton.getText()).toEqual('Register');
		this.loginModal.toggleRegister();
		expect(this.loginModal.loginSubmit.isDisplayed()).not.toBeTruthy();
		expect(this.loginModal.registerSubmit.isDisplayed()).toBeTruthy();
		expect(this.loginModal.toggleButton.getText()).toEqual('Login');
		this.loginModal.toggle();
	});

	it('should show validation errors when registering', () => {
		this.loginModal.toggleRegister();
		this.loginModal.submitRegister();
		expect(LoginModalPage.formGroup(this.loginModal.registerEmail).getAttribute('class')).toMatch('error');
		expect(LoginModalPage.formGroup(this.loginModal.registerUsername).getAttribute('class')).toMatch('error');
		expect(LoginModalPage.formGroup(this.loginModal.registerPassword).getAttribute('class')).toMatch('error');
		this.loginModal.toggle();
	});

	it('should register and login correctly', () => {
		const username = internet.userName().replace(/[^a-z0-9]+/gi, '');
		const password = internet.password(6);

		this.loginModal.toggleRegister();
		this.loginModal.setRegister(internet.email().toLowerCase(), username, password);
		this.loginModal.submitRegister();

		expect(this.loginModal.successMessage.isDisplayed()).toBeTruthy();
		expect(this.loginModal.successMessage.getText()).toContain('Registration successful.');
		expect(this.loginModal.loginSubmit.isDisplayed()).toBeTruthy();

		this.loginModal.toggleLogin();
		this.loginModal.setLogin(username, password);
		this.loginModal.submitLogin();

		expect(this.loginModal.element.isPresent()).not.toBeTruthy();
		expect(this.homePage.loggedUser.getText()).toEqual(username.toUpperCase());

		this.homePage.logout();
		this.homePage.openLoginModal();
	});

	it('should be able to login as contributor', () => {
		this.loginModal.toggleLogin();
		this.loginModal.setLogin(browser.users.contributor.username, browser.users.contributor.password);
		this.loginModal.submitLogin();

		expect(this.loginModal.element.isPresent()).not.toBeTruthy();
		expect(this.homePage.loggedUser.getText()).toEqual('CONTRIBUTOR');

		this.homePage.logout();
		this.homePage.openLoginModal();
	});

});