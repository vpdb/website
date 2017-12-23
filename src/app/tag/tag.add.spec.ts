import { browser } from 'protractor';
import { Games } from '../../test/backend/Games';
import { Game } from '../../test/models/Game';
import { AppPage } from '../app.page';
import { ReleaseAddPage } from '../releases/release.add.page';
import { TagAddModalPage } from './tag.add.modal.page';

describe('Add tag', () => {

	const appPage = new AppPage();
	const releaseAddPage = new ReleaseAddPage();
	const tagAddModal = new TagAddModalPage();
	const games: Games = new Games(browser.params.vpdb);

	beforeAll(() => {
		return games.createGame().then((game: Game) => releaseAddPage.get(game));
	});

	beforeEach(() => {
		releaseAddPage.createTag();
	});


	afterAll(() => {
		appPage.logout();
	});

	it('should display validation errors', () => {
		tagAddModal.submit();
		expect(tagAddModal.hasNameValidationError()).toBe(true);
		expect(tagAddModal.hasDescriptionValidationError()).toBe(true);
		tagAddModal.dismiss();
	});

});