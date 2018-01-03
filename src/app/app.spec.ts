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

describe('App', () => {

	const appPage = new AppPage();

	beforeAll(() => {
		appPage.get();
	});

	afterAll(() => {
		appPage.waitUtilFinished();
	});

	describe('as anonymous', () => {

		it('should open the login modal when clicking on login', () => {
			appPage.openLoginModal();
			expect(appPage.loginModal.element.isDisplayed()).toBeTruthy();
			appPage.loginModal.dismiss();
		});

		it('should be able to login as a pre-defined user', () => {
			appPage.loginAs('contributor');
			expect(appPage.loginModal.element.isPresent()).not.toBeTruthy();
			expect(appPage.getLoggedUsername()).toEqual('contributor');
			appPage.logout();
		});
	});

	describe('as contributor', () => {

		beforeAll(() => {
			appPage.loginAs('contributor');
			expect(appPage.uploadButton.isDisplayed()).toBeTruthy();
		});

		afterAll(() => {
			appPage.logout();
		});

		it('should be able to access the upload menu for game, release and backglass.', () => {

			appPage.uploadButton.click();
			expect(appPage.uploadGameButton.isDisplayed()).toBeTruthy();
			expect(appPage.uploadReleaseButton.isDisplayed()).toBeTruthy();
			expect(appPage.uploadBackglassButton.isDisplayed()).toBeTruthy();
			appPage.uploadButton.click();
		})
	});

});