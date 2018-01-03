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
import { Games } from '../../test/backend/Games';
import { Releases } from '../../test/backend/Releases';
import { Users } from '../../test/backend/Users';
import { Game } from '../../test/models/Game';
import { AppPage } from '../app.page';
import { ReleaseAddPage } from './release.add.page';
import { AuthorSelectModalPage } from '../users/author.select.modal.page';

describe('Add new release', () => {

	const appPage = new AppPage();
	const releaseAddPage = new ReleaseAddPage();
	const games:Games = new Games(browser.params.vpdb);
	const users:Users = new Users(browser.params.vpdb);
	const releases:Releases = new Releases(browser.params.vpdb);
	let game:Game;

	beforeAll(() => {
		return users.authenticateOrCreateUser('rlsaddauthor')
			.then(() => games.createGame())
			.then((createdGame:Game) =>  {
				game = createdGame;
				releaseAddPage.get(game)
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

	it('should be able to edit an author', () => {
		releaseAddPage.editAuthor('member');
		const authorModal = new AuthorSelectModalPage();
		expect(authorModal.getSubmitButtonText()).toContain('UPDATE');
		authorModal.removeRole('Table Creator');
		authorModal.addRole('Coke Fetcher');
		authorModal.submit();
		expect(releaseAddPage.hasAuthor('member', 'Coke Fetcher')).toBe(true);
	});

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

	it('should be able to add a minimal release', () => {
		const fileName = 'blank.vpt';
		releaseAddPage.uploadFile(fileName);
		releaseAddPage.generateReleaseName();
		releaseAddPage.setFlavor(fileName, 0, 0); // orientation: desktop
		releaseAddPage.setFlavor(fileName, 1, 1); // lighting: day
		releaseAddPage.setVersion('v1.0.0');
		releaseAddPage.setModPermission(1);
		releaseAddPage.setCompatibility(fileName, 0, 0);
		releaseAddPage.setCompatibility(fileName, 0, 1);
		releaseAddPage.uploadPlayfield(fileName,'playfield-1920x1080.png');
		releaseAddPage.submit();

		const modal = appPage.getErrorInfoModal();
		expect(modal.title.getText()).toEqual('RELEASE CREATED!');
		expect(modal.subtitle.getText()).toEqual(game.title.toUpperCase());
		expect(modal.message.getText()).toContain('The release has been successfully created.');
		expect(modal.message.getText()).toContain('You will be notified');
		expect(browser.getCurrentUrl()).toContain(browser.baseUrl + '/games/' + game.id + '/releases/');
		modal.close();
		releaseAddPage.navigate(game);
	});

});
