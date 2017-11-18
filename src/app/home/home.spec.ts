import { HomePage } from './home.page';

describe('Home Page', () => {

	const homePage = new HomePage();

	beforeAll(() => {
		homePage.get();
	});

	it('should be in initial state', () => {
		expect(homePage.noResult.isDisplayed()).not.toBeTruthy();
		expect(homePage.panelTitle.isDisplayed()).not.toBeTruthy();
	});

	it('should search in games', () => {
		homePage.search('qwert');
		expect(homePage.noResult.isDisplayed()).toBeTruthy();
		expect(homePage.getNoResult()).toEqual('No games found containing "qwert".');
		homePage.clearSearch();
		expect(homePage.noResult.isDisplayed()).not.toBeTruthy();
	});

	it('should expand the info panel', () => {
		homePage.togglePanel();
		expect(homePage.panelTitle.isDisplayed()).toBeTruthy();
		homePage.closePanel();
		expect(homePage.panelTitle.isDisplayed()).not.toBeTruthy();
	});

});