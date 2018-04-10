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

import { HomePage } from './home.page';

describe('Home Page', () => {

	const homePage = new HomePage();

	beforeAll(async () => {
		await homePage.get();
	});

	it('should be in initial state', async () => {
		expect(await homePage.noResult.isDisplayed()).not.toBeTruthy();
		expect(await homePage.panelTitle.isDisplayed()).not.toBeTruthy();
	});

	it('should search in games', async () => {
		await homePage.search('qwert');
		expect(await homePage.noResult.isDisplayed()).toBeTruthy();
		expect(await homePage.getNoResult()).toEqual('No games found containing "qwert".');
		await homePage.clearSearch();
		expect(await homePage.noResult.isDisplayed()).not.toBeTruthy();
	});

	it('should expand the info panel', async () => {
		await homePage.togglePanel();
		expect(await homePage.panelTitle.isDisplayed()).toBeTruthy();
		await homePage.closePanel();
		expect(await homePage.panelTitle.isDisplayed()).not.toBeTruthy();
	});

});
