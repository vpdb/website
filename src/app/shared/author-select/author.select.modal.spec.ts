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
import { Games } from '../../../test/backend/Games';
import { Users } from '../../../test/backend/Users';
import { Game } from '../../../test/models/Game';
import { AppPage } from '../../app.page';
import { ReleaseAddPage } from '../../releases/admin/add/release.add.page';
import { AuthorSelectModalPage } from './author.select.modal.page';

describe('Add author', () => {

	const appPage = new AppPage();
	const releaseAddPage = new ReleaseAddPage();
	const authorSelectModal = new AuthorSelectModalPage();
	const games:Games = new Games(browser.params.vpdb);
	const users:Users = new Users(browser.params.vpdb);

	beforeAll(async () => {
		await users.authenticateOrCreateUser('membah');
		await users.authenticateOrCreateUser('membrrr');
		const game = await games.createGame();
		await releaseAddPage.get(game);
	});

	beforeEach(async () => {
		await releaseAddPage.addAuthor();
	});

	afterAll(async () => {
		await appPage.logout();
	});

	it('should display validation errors', async () => {
		await authorSelectModal.submit();
		expect(await authorSelectModal.hasAuthorValidationError()).toBe(true);
		expect(await authorSelectModal.hasRoleValidationError()).toBe(true);
		await authorSelectModal.dismiss();
	});

	it('should find a member', async () => {
		await authorSelectModal.search('memb');
		expect(await authorSelectModal.hasSearchResults()).toBe(true);

		await authorSelectModal.dismiss();
	});

	it('should select a member', async () => {
		await authorSelectModal.search('memb');
		await authorSelectModal.selectSearchResult('member');
		expect(await authorSelectModal.getSelectedName()).toBe('member');

		await authorSelectModal.dismiss();
	});

	it('should add a role', async () => {
		await authorSelectModal.addRole('superhero');
		expect(await authorSelectModal.hasRole('superhero')).toBe(true);

		await authorSelectModal.dismiss();
	});

	it('should add multiple roles', async () => {
		await authorSelectModal.addRole('idiot');
		await authorSelectModal.addRole('gros con');
		expect(await authorSelectModal.hasRole('idiot')).toBe(true);
		expect(await authorSelectModal.hasRole('gros con')).toBe(true);

		await authorSelectModal.dismiss();
	});

	it('should remove a role', async () => {
		await authorSelectModal.addRole('hangman');
		expect(await authorSelectModal.hasRole('hangman')).toBe(true);

		await authorSelectModal.removeRole('hangman')
		expect(await authorSelectModal.hasRole('hangman')).toBe(false);

		await authorSelectModal.dismiss();
	});
});
