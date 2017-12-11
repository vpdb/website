import { browser } from 'protractor';
import { Games } from '../../test/backend/Games';
import { Game } from '../../test/models/Game';
import { ReleaseAddPage } from './release.add.page';
import { AppPage } from '../app.page';

describe('Add new game', () => {

	const appPage = new AppPage();
	const releaseAddPage = new ReleaseAddPage();
	const games:Games = new Games(browser.params.vpdb);

	let game:Game;

	beforeAll(() => {
		return games.createGame().then((g:Game) => {
			game = g;
			releaseAddPage.get(game);
		});
	});

	afterEach(() => {
		browser.executeScript('window.scrollTo(0,0);');
	});

	afterAll(() => {
		appPage.logout();
	});

	it('should display validation errors when no file uploaded', () => {
		releaseAddPage.clearAuthors();
		releaseAddPage.submit();
		expect(releaseAddPage.hasFileUploadValidationError()).toBe(true);
		expect(releaseAddPage.hasNameValidationError()).toBe(true);
		expect(releaseAddPage.hasVersionValidationError()).toBe(true);
		expect(releaseAddPage.hasAuthorValidationError()).toBe(true);
		expect(releaseAddPage.hasLicenseValidationError()).toBe(true);
	});

});
