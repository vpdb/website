import { LoginModalPage } from './login.modal.page';
import { HomePage } from '../home/home.page';

describe('Login Modal', () => {


	beforeAll(() => {
		const homePage = new HomePage();
		homePage.get();
		homePage.openLoginModal();

		this.loginModal = homePage.loginModal;
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

	// it('should register correctly', () => {
	// 	this.loginModal.register();
	// 	expect(this.loginModal.successMessage.isDisplayed()).toBeTruthy();
	// 	expect(this.loginModal.successMessage.getText()).toContain('Registration successful.');
	// 	expect(this.loginModal.loginSubmit.isDisplayed()).toBeTruthy();
	// });

});