import { HomePage } from './home.page';
import { $ } from 'protractor';

describe('Home Page', () => {

	beforeAll(() => {
		this.homePage = new HomePage();
		this.homePage.get();
	});

	it('should be in initial state', () => {
		expect(this.homePage.noResult.isDisplayed()).not.toBeTruthy();
		expect($('h3.h--large.h--primary').isDisplayed()).not.toBeTruthy();
	});

	it('should search in games', () => {
		this.homePage.search('qwert');
		expect(this.homePage.getNoResult()).toEqual('No games found containing "qwert".');
		this.homePage.search('');
	});

	it('should expand the info panel', () => {
		this.homePage.togglePanel();
		expect($('h3.h--large.h--primary').isDisplayed()).toBeTruthy();
	});

});