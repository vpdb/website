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

describe('Login Modal', () => {

	const appPage = new AppPage();
	const loginModal = appPage.loginModal;

	beforeAll(async () => {
		await appPage.get();
		await appPage.openLoginModal();
	});

	it('should toggle between login and register', async () => {
		await loginModal.toggleLogin();
		await expect(loginModal.loginSubmit.isDisplayed()).toBeTruthy();
		await expect(loginModal.registerSubmit.isDisplayed()).not.toBeTruthy();
		await expect(loginModal.toggleButton.getText()).toEqual('Register');
		await loginModal.toggleRegister();
		await expect(loginModal.loginSubmit.isDisplayed()).not.toBeTruthy();
		await expect(loginModal.registerSubmit.isDisplayed()).toBeTruthy();
		await expect(loginModal.toggleButton.getText()).toEqual('Login');
		await loginModal.toggle();
	});

	it('should show validation errors when registering', async () => {
		await loginModal.toggleRegister();
		await loginModal.submitRegister();
		await expect(loginModal.hasEmailValidationError()).toBeTruthy();
		await expect(loginModal.hasUsernameValidationError()).toBeTruthy();
		await expect(loginModal.hasPasswordValidationError()).toBeTruthy();
		await loginModal.toggle();
	});

	it('should register and login correctly', async () => {
		const username = internet.userName().replace(/[^a-z0-9]+/gi, '');
		const password = internet.password(6);

		await loginModal.toggleRegister();
		await loginModal.setRegister(internet.email().toLowerCase(), username, password);
		await loginModal.submitRegister();

		await expect(loginModal.successMessage.isDisplayed()).toBeTruthy();
		await expect(loginModal.successMessage.getText()).toContain('Registration successful.');
		await expect(loginModal.loginSubmit.isDisplayed()).toBeTruthy();

		await loginModal.toggleLogin();
		await loginModal.setLogin(username, password);
		await loginModal.submitLogin();

		await expect(loginModal.element.isPresent()).not.toBeTruthy();
		await expect(appPage.getLoggedUsername()).toEqual(username);

		await appPage.logout();
		await appPage.openLoginModal();
	});
});
