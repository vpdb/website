import { HomePage } from './home.page';

describe('Home Page', () => {

	beforeAll(() => {
		this.homePage = new HomePage();
		this.homePage.get();
	});

	it('should be in initial state', () => {
		expect(this.homePage.noResult.isDisplayed()).not.toBeTruthy();
		expect(this.homePage.panelTitle.isDisplayed()).not.toBeTruthy();
	});

	it('should search in games', () => {
		this.homePage.search('qwert');
		expect(this.homePage.getNoResult()).toEqual('No games found containing "qwert".');
		this.homePage.search('');
	});

	it('should expand the info panel', () => {
		this.homePage.togglePanel();
		expect(this.homePage.panelTitle.isDisplayed()).toBeTruthy();
		this.homePage.panelClose.click();
		expect(this.homePage.panelTitle.isDisplayed()).not.toBeTruthy();
	});

	it('should open the login modal when clicking on login', () => {
		this.homePage.openLoginModal();
		expect(this.homePage.loginModal.isDisplayed()).toBeTruthy();
	})

});