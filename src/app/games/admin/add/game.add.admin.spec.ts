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

import { browser } from "protractor";
import { GameAddAdminPage } from './game.add.admin.page';
import { AppPage } from '../../../app.page';
import { Games } from '../../../../test/backend/Games';

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
		expect(addGamePage.hasTitleValidatorErrors()).toBe(true);
		expect(addGamePage.hasRecreationIdValidationErrors()).toBe(true);
		expect(addGamePage.hasBackglassValidationErrors()).toBe(true);
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
		expect(addGamePage.backglassImage.getAttribute('style')).toContain('background-image: url');
		addGamePage.reset();
	});

	it('should upload a logo', () => {
		addGamePage.uploadLogo('game.logo-800x300.png');
		expect(addGamePage.logoImage.getAttribute('style')).toContain('background-image: url');
		addGamePage.reset();
	});

	it('should successfully add a new game', () => {
		const game = Games.getGame();
		addGamePage.fetchIpdb(String(game.ipdb.number));
		appPage.waitUntilLoaded();
		addGamePage.uploadBackglass('backglass-1280x1024.png');
		addGamePage.uploadLogo('game.logo-800x300.png');
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
