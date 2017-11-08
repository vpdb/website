import { HomePage } from './home.page';

describe('Home Page', () => {

	it ('should search in games', () => {
		let homePage = new HomePage();
		homePage.get();
		homePage.search('qwert');
		expect(homePage.getNoResult()).toEqual('No games found containing "qwert".')
	})

});