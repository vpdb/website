import { AppPage } from './app.page';

describe('App', () => {

	const appPage = new AppPage();

	beforeAll(() => {
		appPage.get();
	});

	afterAll(() => {
		appPage.waitUtilFinished();
	});

	describe('as anonymous', () => {

		it('should open the login modal when clicking on login', () => {
			appPage.openLoginModal();
			expect(appPage.loginModal.element.isDisplayed()).toBeTruthy();
			appPage.loginModal.dismiss();
		});

		it('should be able to login as a pre-defined user', () => {
			appPage.loginAs('contributor');
			expect(appPage.loginModal.element.isPresent()).not.toBeTruthy();
			expect(appPage.getLoggedUsername()).toEqual('contributor');
			appPage.logout();
		});

	});

	describe('as contributor', () => {

		beforeAll(() => {
			appPage.loginAs('contributor');
			expect(appPage.uploadButton.isDisplayed()).toBeTruthy();
		});

		afterAll(() => {
			appPage.logout();
		});

		it('should be able to access the upload menu for game, release and backglass.', () => {

			appPage.uploadButton.click();
			expect(appPage.uploadGameButton.isDisplayed()).toBeTruthy();
			expect(appPage.uploadReleaseButton.isDisplayed()).toBeTruthy();
			expect(appPage.uploadBackglassButton.isDisplayed()).toBeTruthy();
			appPage.uploadButton.click();
		})
	});

});