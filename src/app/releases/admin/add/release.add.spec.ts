/*
 * VPDB - Virtual Pinball Database
 * Copyright (C) 2018 freezy <freezy@vpdb.io>
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.
 */

import { browser } from 'protractor';
import { company } from 'faker';
import { Games } from '../../../../test/backend/Games';
import { Releases } from '../../../../test/backend/Releases';
import { Users } from '../../../../test/backend/Users';
import { Game } from '../../../../test/models/Game';
import { AppPage } from '../../../app.page';
import { ReleaseAddPage } from './release.add.page';
import { AuthorSelectModalPage } from '../../../shared/author-select/author.select.modal.page';

describe('Add new release', () => {

	const appPage = new AppPage();
	const releaseAddPage = new ReleaseAddPage();
	const games:Games = new Games(browser.params.vpdb);
	const users:Users = new Users(browser.params.vpdb);
	const releases:Releases = new Releases(browser.params.vpdb);
	let game:Game;

	beforeAll(async () => {
		return users.authenticateOrCreateUser('rlsaddauthor')
			.then(() => games.createGame())
			.then((createdGame:Game) =>  {
				game = createdGame;
				releaseAddPage.get(game)
			});
	});

	afterEach(async () => {
		browser.executeScript('window.scrollTo(0,0);');
	});

	afterAll(async () => {
		appPage.logout();
	});

	it('should display validation errors when no file uploaded', async () => {
		await releaseAddPage.clearAuthors();
		await releaseAddPage.submit();
		expect(await releaseAddPage.hasFileUploadValidationError()).toBe(true);
		expect(await releaseAddPage.hasNameValidationError()).toBe(true);
		expect(await releaseAddPage.hasVersionValidationError()).toBe(true);
		expect(await releaseAddPage.hasAuthorValidationError()).toBe(true);
		expect(await releaseAddPage.hasLicenseValidationError()).toBe(true);
		await releaseAddPage.reset();
	});

	it('should display validation errors when a file is uploaded.', async () => {
		const fileName = 'blank.vpt';
		await releaseAddPage.uploadFile(fileName);
		await releaseAddPage.submit();
		expect(await releaseAddPage.hasFlavorValidationError(fileName)).toBe(true);
		expect(await releaseAddPage.hasCompatibilityValidationError(fileName)).toBe(true);
		expect(await releaseAddPage.hasPlayfieldImageValidationError(fileName)).toBe(true);
		await releaseAddPage.reset();
	});

	it('should be able to add an author', async () => {
		await releaseAddPage.addAuthor('rlsaddauthor', 'Drama Queen');
		expect(await releaseAddPage.hasAuthor('rlsaddauthor', 'Drama Queen')).toBe(true);
		await releaseAddPage.reset();
	});

	it('should be able to edit an author', async () => {
		await releaseAddPage.editAuthor('member');
		const authorModal = new AuthorSelectModalPage();
		expect(await authorModal.getSubmitButtonText()).toContain('UPDATE');
		await authorModal.removeRole('Table Creator');
		await authorModal.addRole('Coke Fetcher');
		await authorModal.submit();
		expect(await releaseAddPage.hasAuthor('member', 'Coke Fetcher')).toBe(true);
	});

	it('should be able to create a new tag', async () => {
		const tagName = company.bsAdjective();
		await releaseAddPage.createTag(tagName, company.catchPhraseDescriptor());
		expect(await releaseAddPage.hasAvailableTag(tagName)).toBe(true);
		expect(await releaseAddPage.hasSelectedTag(tagName)).toBe(false);
		await releaseAddPage.reset();
	});

	it('should be able to add an existing tag', async () => {
		await releaseAddPage.selectTag('HD');
		expect(await releaseAddPage.hasAvailableTag('HD')).toBe(false);
		expect(await releaseAddPage.hasSelectedTag('HD')).toBe(true);
		await releaseAddPage.reset();
	});

	it('should be able to remove a tag by dragging', async () => {
		await releaseAddPage.selectTag('3D');
		await releaseAddPage.removeTagByDrag('3D');
		expect(await releaseAddPage.hasAvailableTag('3D')).toBe(true);
		expect(await releaseAddPage.hasSelectedTag('3D')).toBe(false);
		await releaseAddPage.reset();
	});

	it('should be able to remove a tag by clicking', async () => {
		await releaseAddPage.selectTag('3D');
		await releaseAddPage.removeTagByClick('3D');
		expect(await releaseAddPage.hasAvailableTag('3D')).toBe(true);
		expect(await releaseAddPage.hasSelectedTag('3D')).toBe(false);
		await releaseAddPage.reset();
	});

	it('should be able to add a minimal release', async () => {
		const fileName = 'blank.vpt';
		await releaseAddPage.uploadFile(fileName);
		await releaseAddPage.generateReleaseName();
		await releaseAddPage.setFlavor(fileName, 0, 0); // orientation: desktop
		await releaseAddPage.setFlavor(fileName, 1, 1); // lighting: day
		await releaseAddPage.setVersion('v1.0.0');
		await releaseAddPage.setModPermission(1);
		await releaseAddPage.setCompatibility(fileName, 0, 0);
		await releaseAddPage.setCompatibility(fileName, 0, 1);
		await releaseAddPage.uploadPlayfield(fileName,'playfield-1920x1080.png');
		await releaseAddPage.submit();

		const modal = await appPage.getErrorInfoModal();
		expect(await modal.title.getText()).toEqual('RELEASE CREATED!');
		expect(await modal.subtitle.getText()).toEqual(game.title.toUpperCase());
		expect(await modal.message.getText()).toContain('The release has been successfully created.');
		expect(await modal.message.getText()).toContain('You will be notified');
		expect(await browser.getCurrentUrl()).toContain(browser.baseUrl + '/games/' + game.id + '/releases/');
		await modal.close();
		await releaseAddPage.navigate(game);
	});

});
