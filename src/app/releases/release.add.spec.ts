import { browser } from 'protractor';
import { Games } from '../../test/backend/Games';
import { Users } from '../../test/backend/Users';
import { Game } from '../../test/models/Game';
import { ReleaseAddPage } from './release.add.page';
import { AppPage } from '../app.page';
import { company } from 'faker';
import { release } from "os";

describe('Add new release', () => {

	const appPage = new AppPage();
	const releaseAddPage = new ReleaseAddPage();
	const games:Games = new Games(browser.params.vpdb);
	const users:Users = new Users(browser.params.vpdb);

	beforeAll(() => {
		return users.authenticateOrCreateUser('rlsaddauthor')
			.then(() => games.createGame())
			.then((game:Game) => releaseAddPage.get(game));
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
		releaseAddPage.reset();
	});

	it('should display validation errors when a file is uploaded.', () => {
		const fileName = 'blank.vpt';
		releaseAddPage.uploadFile(fileName);
		releaseAddPage.submit();
		expect(releaseAddPage.hasFlavorValidationError(fileName)).toBe(true);
		expect(releaseAddPage.hasCompatibilityValidationError(fileName)).toBe(true);
		expect(releaseAddPage.hasPlayfieldImageValidationError(fileName)).toBe(true);
		releaseAddPage.reset();
	});

	it('should be able to add an author', () => {
		releaseAddPage.addAuthor('rlsaddauthor', 'Drama Queen');
		expect(releaseAddPage.hasAuthor('rlsaddauthor', 'Drama Queen')).toBe(true);
		releaseAddPage.reset();
	});

	//it('should be able to edit an author');

	it('should be able to create a new tag', () => {
		const tagName = company.bsAdjective();
		releaseAddPage.createTag(tagName, company.catchPhraseDescriptor());
		expect(releaseAddPage.hasTag(tagName)).toBe(true);
		expect(releaseAddPage.hasSelectedTag(tagName)).toBe(false);
		releaseAddPage.reset();
	});

	it('should be able to add an existing tag', () => {
		releaseAddPage.selectTag('HD');
		expect(releaseAddPage.hasTag('HD')).toBe(false);
		expect(releaseAddPage.hasSelectedTag('HD')).toBe(true);
		releaseAddPage.reset();
	});

	it('should be able to remove a tag by dragging', () => {
		releaseAddPage.selectTag('3D');
		releaseAddPage.removeTagByDrag('3D');
		expect(releaseAddPage.hasTag('3D')).toBe(true);
		expect(releaseAddPage.hasSelectedTag('3D')).toBe(false);
		releaseAddPage.reset();
	});

	it('should be able to remove a tag by clicking', () => {
		releaseAddPage.selectTag('3D');
		releaseAddPage.removeTagByClick('3D');
		expect(releaseAddPage.hasTag('3D')).toBe(true);
		expect(releaseAddPage.hasSelectedTag('3D')).toBe(false);
		releaseAddPage.reset();
	});

});
