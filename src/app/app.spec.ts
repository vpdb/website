import { AppPage } from './app.page';

describe('App', () => {

	const appPage = new AppPage();

	beforeAll(() => {
		appPage.get();
	});

	it('should open the login modal when clicking on login', () => {
		appPage.openLoginModal();
		expect(appPage.loginModal.element.isDisplayed()).toBeTruthy();
		appPage.loginModal.dismiss();
	});

	it('should be able to login as a pre-defined user', () => {

		appPage.loginAs('contributor');
		expect(appPage.loginModal.element.isPresent()).not.toBeTruthy();
		expect(appPage.loggedUser.getText()).toEqual('CONTRIBUTOR');
		appPage.logout();
	})

});