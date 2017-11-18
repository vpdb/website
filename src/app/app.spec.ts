import { AppPage } from './app.page';

describe('App', () => {

	const appPage = new AppPage();

	beforeAll(() => {
		appPage.get();
	});

	it('should open the login modal when clicking on login', () => {
		appPage.openLoginModal();
		expect(appPage.loginModal.element.isDisplayed()).toBeTruthy();
	});

});