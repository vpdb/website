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

import { LoginModalPage } from './login.modal.page';
import { internet } from 'faker';
import { AppPage } from "../app.page";

describe('Login Modal', () => {

	const appPage = new AppPage();
	const loginModal = appPage.loginModal;

	beforeAll(() => {
		appPage.get();
		appPage.openLoginModal();
	});

	it('should toggle between login and register', () => {
		loginModal.toggleLogin();
		expect(loginModal.loginSubmit.isDisplayed()).toBeTruthy();
		expect(loginModal.registerSubmit.isDisplayed()).not.toBeTruthy();
		expect(loginModal.toggleButton.getText()).toEqual('Register');
		loginModal.toggleRegister();
		expect(loginModal.loginSubmit.isDisplayed()).not.toBeTruthy();
		expect(loginModal.registerSubmit.isDisplayed()).toBeTruthy();
		expect(loginModal.toggleButton.getText()).toEqual('Login');
		loginModal.toggle();
	});

	it('should show validation errors when registering', () => {
		loginModal.toggleRegister();
		loginModal.submitRegister();
		expect(LoginModalPage.formGroup(loginModal.registerEmail).getAttribute('class')).toMatch('error');
		expect(LoginModalPage.formGroup(loginModal.registerUsername).getAttribute('class')).toMatch('error');
		expect(LoginModalPage.formGroup(loginModal.registerPassword).getAttribute('class')).toMatch('error');
		loginModal.toggle();
	});

	it('should register and login correctly', () => {
		const username = internet.userName().replace(/[^a-z0-9]+/gi, '');
		const password = internet.password(6);

		loginModal.toggleRegister();
		loginModal.setRegister(internet.email().toLowerCase(), username, password);
		loginModal.submitRegister();

		expect(loginModal.successMessage.isDisplayed()).toBeTruthy();
		expect(loginModal.successMessage.getText()).toContain('Registration successful.');
		expect(loginModal.loginSubmit.isDisplayed()).toBeTruthy();

		loginModal.toggleLogin();
		loginModal.setLogin(username, password);
		loginModal.submitLogin();

		expect(loginModal.element.isPresent()).not.toBeTruthy();
		expect(appPage.getLoggedUsername()).toEqual(username);

		appPage.logout();
		appPage.openLoginModal();
	});

});