import { GameAddAdminPage } from './game.add.admin.page';
import { AppPage } from "../app.page";

describe('Add new game', () => {

	const addGamePage = new GameAddAdminPage();

	beforeAll(() => {
		addGamePage.get();
	});


	it('should display validation errors', () => {
		addGamePage.submit();
		expect(GameAddAdminPage.formGroup(addGamePage.title).getAttribute('class')).toMatch('error');
		expect(GameAddAdminPage.formGroup(addGamePage.gameIdRecreation).getAttribute('class')).toMatch('error');
		expect(addGamePage.backglassError.isDisplayed()).toBeTruthy();
	});

	it('should display the game info from IPDB', () => {
		const appPage = new AppPage();

		addGamePage.fetchIpdb('3781');
		appPage.waitUntilLoaded();
		expect(addGamePage.gameInfoPanel.isDisplayed()).toBeTruthy();
		expect(addGamePage.gameInfoTitle.getText()).toEqual('Attack from Mars');
		addGamePage.reset();
	});

	fit('should upload a backglass', () => {

		addGamePage.uploadBackglass('backglass-1280x1024.png');
	});

});