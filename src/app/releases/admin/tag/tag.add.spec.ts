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
import { Games } from '../../../../test/backend/Games';
import { Game } from '../../../../test/models/Game';
import { AppPage } from '../../../app.page';
import { ReleaseAddPage } from '../add/release.add.page';
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
