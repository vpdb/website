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

import { internet } from 'faker';
import { AppPage } from '../../app.page';
import { browser } from 'protractor';

describe('Login Modal', () => {

	const appPage = new AppPage();
	const loginModal = appPage.loginModal;

	beforeAll(async () => {
		await appPage.get();
		await appPage.openLoginModal();
	});

	afterEach(async () => {
		await loginModal.toggleLogin();
	});

	it('should toggle between login and register', async () => {
		await loginModal.toggleLogin();
		expect(await loginModal.loginSubmit.isDisplayed()).toBeTruthy();
		expect(await loginModal.registerSubmit.isDisplayed()).not.toBeTruthy();
		expect(await loginModal.toggleButton.getText()).toEqual('Register');
		await loginModal.toggleRegister();
		expect(await loginModal.loginSubmit.isDisplayed()).not.toBeTruthy();
		expect(await loginModal.registerSubmit.isDisplayed()).toBeTruthy();
		expect(await loginModal.toggleButton.getText()).toEqual('Login');
	});

	it('should show validation errors when registering', async () => {
		await loginModal.toggleRegister();
		await loginModal.submitRegister();
		expect(await loginModal.hasEmailValidationError()).toBeTruthy();
		expect(await loginModal.hasUsernameValidationError()).toBeTruthy();
		expect(await loginModal.hasPasswordValidationError()).toBeTruthy();
	});

	it('should register and login correctly', async () => {
		const username = internet.userName().replace(/[^a-z0-9]+/gi, '');
		const password = internet.password(6);

		await loginModal.toggleRegister();
		await loginModal.setRegister(internet.email().toLowerCase(), username, password);

		await loginModal.submitRegister();

		expect(await loginModal.successMessage.isDisplayed()).toBeTruthy();
		expect(await loginModal.successMessage.getText()).toContain('Registration successful.');
		expect(await loginModal.loginSubmit.isDisplayed()).toBeTruthy();

		await loginModal.toggleLogin();
		await loginModal.setLogin(username, password);
		await loginModal.submitLogin();

		expect(await loginModal.element.isPresent()).not.toBeTruthy();
		expect(await appPage.getLoggedUsername()).toEqual(username);

		await appPage.logout();
		await appPage.openLoginModal();
	});
});
