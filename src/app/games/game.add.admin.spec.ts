import { GameAddAdminPage } from './game.add.admin.page';

describe('Add new game', () => {

	const addGamePage = new GameAddAdminPage();

	beforeAll(() => {
		addGamePage.get();
	});


	it('noop', () => {
		addGamePage.title.sendKeys('My title');
	});


});