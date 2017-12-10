import { browser } from "protractor";
import { GameAddAdminPage } from './game.add.admin.page';
import { AppPage } from '../app.page';
import { Games } from '../../test/backend/Games';

describe('Add new game', () => {

	const appPage = new AppPage();
	const addGamePage = new GameAddAdminPage();

	beforeAll(() => {
		addGamePage.get();
	});

	afterEach(() => {
		browser.executeScript('window.scrollTo(0,0);');
	});

	afterAll(() => {
		appPage.logout();
	});

	it('should display validation errors', () => {
		addGamePage.submit();
		expect(GameAddAdminPage.formGroup(addGamePage.title).getAttribute('class')).toMatch('error');
		expect(GameAddAdminPage.formGroup(addGamePage.gameIdRecreation).getAttribute('class')).toMatch('error');
		expect(addGamePage.backglassError.isDisplayed()).toBeTruthy();
		addGamePage.reset();
	});

	it('should display the game info from IPDB', () => {
		addGamePage.fetchIpdb('3781');
		appPage.waitUntilLoaded();
		expect(addGamePage.gameInfoPanel.isDisplayed()).toBeTruthy();
		expect(addGamePage.gameInfoTitle.getText()).toEqual('Attack from Mars');
		addGamePage.reset();
	});

	it('should upload a backglass', () => {
		addGamePage.uploadBackglass('backglass-1280x1024.png');
		addGamePage.waitUntilBackglassUploaded();
		expect(addGamePage.backglassImage.getAttribute('style')).toContain('background-image: url');
		addGamePage.reset();
	});

	it('should upload a logo', () => {
		addGamePage.uploadLogo('game.logo-800x300.png');
		addGamePage.waitUntilLogoUploaded();
		expect(addGamePage.logoImage.getAttribute('style')).toContain('background-image: url');
		addGamePage.reset();
	});

	it('should successfully add a new game', () => {
		const game = Games.getGame();
		addGamePage.fetchIpdb(String(game.ipdb.number));
		appPage.waitUntilLoaded();
		addGamePage.uploadBackglass('backglass-1280x1024.png');
		addGamePage.waitUntilBackglassUploaded();
		addGamePage.uploadLogo('game.logo-800x300.png');
		addGamePage.waitUntilLogoUploaded();
		addGamePage.submit();

		const modal = appPage.getErrorInfoModal();
		expect(modal.title.getText()).toEqual('GAME CREATED!');
		expect(modal.subtitle.getText()).toEqual(game.title.toUpperCase());
		expect(modal.message.getText()).toEqual('The game has been successfully created.');
		expect(browser.getCurrentUrl()).toContain(browser.baseUrl + '/games/');
		modal.close();
		addGamePage.navigate();
	});

});