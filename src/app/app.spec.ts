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

import { AppPage } from './app.page';

process.on('unhandledRejection', r => console.log(r));

describe('App', () => {

	const appPage = new AppPage();

	beforeAll(async () => {
		await appPage.get();
	});


	describe('as anonymous', () => {

		it('should open the login modal when clicking on login', async () => {
			await appPage.openLoginModal();
			expect(await appPage.loginModal.element.isDisplayed()).toBeTruthy();
			await appPage.loginModal.dismiss();
		});

		it('should be able to login as a pre-defined user', async () => {
			await appPage.loginAs('contributor');
			expect(await appPage.loginModal.element.isPresent()).not.toBeTruthy();
			expect(await appPage.getLoggedUsername()).toEqual('contributor');
			await appPage.logout();
		});
	});

	describe('as contributor', () => {

		beforeAll(async () => {
			await appPage.loginAs('contributor');
			expect(await appPage.uploadButton.isDisplayed()).toBeTruthy();
		});

		afterAll(async () => {
			await appPage.logout();
		});

		it('should be able to access the upload menu for game, release and backglass.', async () => {

			await appPage.uploadButton.click();
			expect(await appPage.uploadGameButton.isDisplayed()).toBeTruthy();
			expect(await appPage.uploadReleaseButton.isDisplayed()).toBeTruthy();
			expect(await appPage.uploadBackglassButton.isDisplayed()).toBeTruthy();
			await appPage.uploadButton.click();
		});
	});

});
