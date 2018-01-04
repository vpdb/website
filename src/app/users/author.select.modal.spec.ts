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
import { Games } from '../../test/backend/Games';
import { Users } from '../../test/backend/Users';
import { Game } from '../../test/models/Game';
import { AppPage } from '../app.page';
import { ReleaseAddPage } from '../releases/release.add.page';
import { AuthorSelectModalPage } from './author.select.modal.page';

describe('Add author', () => {

	const appPage = new AppPage();
	const releaseAddPage = new ReleaseAddPage();
	const authorSelectModal = new AuthorSelectModalPage();
	const games:Games = new Games(browser.params.vpdb);
	const users:Users = new Users(browser.params.vpdb);

	beforeAll(() => {

		return users.authenticateOrCreateUser('membah')
			.then(() => users.authenticateOrCreateUser('membrrr'))
			.then(() => games.createGame())
			.then((game:Game) => releaseAddPage.get(game));
	});

	beforeEach(() => {
		releaseAddPage.addAuthor();
	});


	afterAll(() => {
		appPage.logout();
	});

	it('should display validation errors', () => {
		authorSelectModal.submit();
		expect(authorSelectModal.hasAuthorValidationError()).toBe(true);
		expect(authorSelectModal.hasRoleValidationError()).toBe(true);
		authorSelectModal.dismiss();
	});

	it('should find a member', () => {
		authorSelectModal.search('memb');
		expect(authorSelectModal.hasSearchResults()).toBe(true);

		authorSelectModal.dismiss();
	});

	it('should select a member', () => {
		authorSelectModal.search('memb');
		authorSelectModal.selectSearchResult('member');
		expect(authorSelectModal.getSelectedName()).toBe('member');

		authorSelectModal.dismiss();
	});

	it('should add a role', () => {
		authorSelectModal.addRole('superhero');
		expect(authorSelectModal.hasRole('superhero')).toBe(true);

		authorSelectModal.dismiss();
	});

	it('should add multiple roles', () => {
		authorSelectModal.addRole('idiot');
		authorSelectModal.addRole('gros con');
		expect(authorSelectModal.hasRole('idiot')).toBe(true);
		expect(authorSelectModal.hasRole('gros con')).toBe(true);

		authorSelectModal.dismiss();
	});

	it('should remove a role', () => {
		authorSelectModal.addRole('hangman');
		expect(authorSelectModal.hasRole('hangman')).toBe(true);

		authorSelectModal.removeRole('hangman')
		expect(authorSelectModal.hasRole('hangman')).toBe(false);

		authorSelectModal.dismiss();
	});


});
