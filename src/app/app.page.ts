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

import { browser, by, element, ExpectedConditions as until } from 'protractor';
import { LoginModalPage } from './auth/login.modal.page';
import { ModalErrorInfoPage } from "./modal/modal.error.info.page";

export class AppPage {

	userButton = element(by.id('user-btn'));
	loginButton = element(by.id('login-btn'));
	loginModal = new LoginModalPage(element(by.id('login-modal')));
	logoutButton = element(by.id('logout-btn'));

	errorInfoModal = element(by.id('info-error-modal'));

	uploadButton = element(by.id('upload-btn'));
	uploadGameButton = element(by.id('upload-game-btn'));
	uploadReleaseButton = element(by.id('upload-release-btn'));
	uploadBackglassButton = element(by.id('upload-backglass-btn'));

	spinner = element(by.css('.spinner'));

	get() {
		browser.get(browser.baseUrl);
	}

	openLoginModal() {
		this.loginButton.click();
		browser.wait(until.presenceOf(this.loginModal.element), 1000);
	}

	loginAs(username: string) {
		this.openLoginModal();
		this.loginModal.toggleLogin();
		this.loginModal.setLogin(browser.users[username].username, browser.users[username].password);
		this.loginModal.submitLogin();
		browser.wait(() => this.getLoggedUsername().then(loggedUsername => loggedUsername === username), 1000);
	}

	logout() {
		this.userButton.click();
		this.logoutButton.click();
	}

	isLoading() {
		this.spinner.isDisplayed();
	}

	isLogged() {
		!this.loginButton.isDisplayed();
	}

	waitUntilLoaded() {
		browser.wait(() => this.spinner.isDisplayed().then(result => !result), 10000);
	}

	waitUtilFinished() {
		browser.wait(() => this.loginButton.isDisplayed(), 1000);
	}

	getLoggedUsername() {
		//const user = JSON.parse(browser.executeScript("return window.localStorage.getItem('key');");
		//expect(value).toEqual(expectedValue);
		//browser.wait(() => element(by.css('img.img-avatar')).isDisplayed(), 1000);
		//return this.loggedUser.getAttribute('textContent');
		return browser.driver.executeScript("return document.getElementById('logged-user').innerHTML");
	}

	getErrorInfoModal() {
		browser.wait(until.presenceOf(this.errorInfoModal), 1000);
		return new ModalErrorInfoPage(this.errorInfoModal);
	}

}