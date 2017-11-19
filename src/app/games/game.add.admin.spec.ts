import { GameAddAdminPage } from './game.add.admin.page';

describe('Add new game', () => {

	const addGamePage = new GameAddAdminPage();

	beforeAll(() => {
		addGamePage.get();
	});


	fit('should display validation errors', () => {
		addGamePage.submit();
		expect(GameAddAdminPage.formGroup(addGamePage.title).getAttribute('class')).toMatch('error');
		expect(GameAddAdminPage.formGroup(addGamePage.gameIdRecreation).getAttribute('class')).toMatch('error');
		expect(addGamePage.backglassError.isDisplayed()).toBeTruthy();
	});

});