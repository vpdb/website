import { HomePage } from '../home/home.page';
import { by, element } from "protractor";

describe('Login Modal', () => {


	beforeAll(() => {
		const homePage = new HomePage();
		homePage.get();
		homePage.openLoginModal();

		this.loginModal = homePage.loginModal;
	});

	it('should toggle between login and register', () => {
		expect(this.loginModal.toggleButton.getText()).toEqual('Register');
		this.loginModal.toggle();
		expect(this.loginModal.toggleButton.getText()).toEqual('Login');
		this.loginModal.toggle();
	});

	it('should show validation errors when registering', () => {
		this.loginModal.toggle();
		this.loginModal.submitRegister();
		expect(this.loginModal.formGroup(this.loginModal.registerEmail).getAttribute('class')).toMatch('error');
		expect(this.loginModal.formGroup(this.loginModal.registerUsername).getAttribute('class')).toMatch('error');
		expect(this.loginModal.formGroup(this.loginModal.registerPassword).getAttribute('class')).toMatch('error');
		this.loginModal.toggle();
	})

});