/*
 * VPDB - Virtual Pinball Database
 * Copyright (C) 2019 freezy <freezy@vpdb.io>
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
import { GameAddAdminPage } from './game.add.admin.page';
import { AppPage } from '../../../app.page';
import { Games } from '../../../../test/backend/Games';

describe('Add new game', () => {

	const appPage = new AppPage();
	const addGamePage = new GameAddAdminPage();

	beforeAll(async () => {
		await addGamePage.get();
	});

	afterEach(async () => {
		await browser.executeScript('window.scrollTo(0,0);');
	});

	afterAll(async () => {
		await appPage.logout();
	});

	it('should display validation errors', async () => {
		await addGamePage.submit();
		expect(await addGamePage.hasTitleValidatorErrors()).toBe(true);
		expect(await addGamePage.hasRecreationIdValidationErrors()).toBe(true);
		expect(await addGamePage.hasBackglassValidationErrors()).toBe(true);
		await addGamePage.reset();
	});

	it('should display the game info from IPDB', async () => {
		await addGamePage.fetchIpdb('3781');
		await appPage.waitUntilLoaded();
		expect(await addGamePage.gameInfoPanel.isDisplayed()).toBeTruthy();
		expect(await addGamePage.gameInfoTitle.getText()).toEqual('Attack from Mars');
		await addGamePage.reset();
	});

	it('should upload a backglass', async () => {
		await addGamePage.uploadBackglass('backglass-1280x1024.png');
		expect(await addGamePage.backglassImage.getAttribute('style')).toContain('background-image: url');
		await addGamePage.reset();
	});

	it('should upload a logo', async () => {
		await addGamePage.uploadLogo('game.logo-800x300.png');
		expect(await addGamePage.logoImage.getAttribute('style')).toContain('background-image: url');
		await addGamePage.reset();
	});

	it('should successfully add a new game', async () => {
		const game = Games.getGame();
		await addGamePage.fetchIpdb(String(game.ipdb.number));
		await appPage.waitUntilLoaded();
		await addGamePage.uploadBackglass('backglass-1280x1024.png');
		await addGamePage.uploadLogo('game.logo-800x300.png');
		await addGamePage.submit();

		const modal = await appPage.getErrorInfoModal();
		expect(await modal.title.getText()).toEqual('GAME CREATED!');
		expect(await modal.subtitle.getText()).toEqual(game.title.toUpperCase());
		expect(await modal.message.getText()).toEqual('The game has been successfully created.');
		expect(await browser.getCurrentUrl()).toContain(browser.baseUrl + '/games/');
		await modal.close();
		await addGamePage.navigate();
	});

});
