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

import { browser, by, element, ExpectedConditions as until, protractor } from 'protractor';
import { LoginModalPage } from './common/auth/login.modal.page';
import { ModalErrorInfoPage } from "./common/modal/modal.error.info.page";

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

	async get() {
		await browser.get(browser.baseUrl);
	}

	async openLoginModal() {
		await this.loginButton.click();
		await browser.wait(until.presenceOf(this.loginModal.element), 1000);
	}

	async loginAs(username: string) {
		await this.openLoginModal();
		await this.loginModal.toggleLogin();
		await this.loginModal.setLogin(browser.users[username].username, browser.users[username].password);
		await this.loginModal.submitLogin();
		await browser.wait(() => this.getLoggedUsername().then(loggedUsername => loggedUsername === username), 1000);
	}

	async logout() {
		this.userButton.click();
		this.logoutButton.click();
	}
	//
	// async isLoading() {
	// 	return await this.spinner.isDisplayed();
	// }
	//
	// async isLogged() {
	// 	return !(await this.loginButton.isDisplayed());
	// }

	async waitUntilLoaded() {
		await browser.wait(() => this.spinner.isDisplayed().then(result => !result), 10000);
	}

	async waitUtilFinished() {
		const until = protractor.ExpectedConditions;
		//await browser.wait(until.presenceOf(this.loginButton), 5000, 'Login button should have appeared.');
		await browser.sleep(1000);
		//await browser.wait(() => this.loginButton.isDisplayed(), 3000);
	}

	async getLoggedUsername() {
		// might be hidden in small viewports, so we need to retrieve it differently.
		return await browser.driver.executeScript("return document.getElementById('logged-user').innerHTML");
	}

	async getErrorInfoModal() {
		await browser.wait(until.presenceOf(this.errorInfoModal), 3000);
		return new ModalErrorInfoPage(this.errorInfoModal);
	}

}
