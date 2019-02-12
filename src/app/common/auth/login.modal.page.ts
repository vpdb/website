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

import { by, ElementFinder } from 'protractor';
import { BasePage } from '../../../test/BasePage';

export class LoginModalPage extends BasePage {

	public static EMAIL = "root@vpdb.io";
	public static USERNAME = "root";
	public static PASSWORD = "abc123";

	constructor(public element: ElementFinder) {
		super();
	}

	public loginUsername = this.element.element(by.id('login-username'));
	public loginPassword = this.element.element(by.id('login-password'));
	public loginSubmit = this.element.element(by.id('login-submit'));
	public registerEmail = this.element.element(by.id('register-email'));
	public registerUsername = this.element.element(by.id('register-username'));
	public registerPassword = this.element.element(by.id('register-password'));
	public registerSubmit = this.element.element(by.id('register-submit'));
	public toggleButton = this.element.element(by.id('login-toggle'));
	public dismissButton = this.element.element(by.id('dismiss-button'));
	public successMessage = this.element.element(by.css('.modal-body > .alert-success[ng-show="vm.message"]'));

	async toggle(): Promise<void> {
		await this.toggleButton.click();
	}

	async toggleRegister() {
		const isDisplayed = await this.registerSubmit.isDisplayed();
		if (!isDisplayed) {
			await this.toggle();
		}
	}

	async setRegister(email:string, username:string, password:string) {
		await this.registerEmail.sendKeys(email);
		await this.registerUsername.sendKeys(username);
		await this.registerPassword.sendKeys(password);
	}

	async submitRegister() {
		await this.registerSubmit.click();
	}

	async toggleLogin() {
		const isDisplayed = await this.loginSubmit.isDisplayed();
		if (!isDisplayed) {
			await this.toggle();
		}
	}

	async setLogin(username:string, password:string) {
		await this.loginUsername.sendKeys(username);
		await this.loginPassword.sendKeys(password);
	}

	async submitLogin() {
		await this.loginSubmit.click();
	}

	async login() {
		const isDisplayed = await this.loginSubmit.isDisplayed();
		if (!isDisplayed) {
			await this.toggle();
		}
		await this.setLogin(LoginModalPage.USERNAME, LoginModalPage.PASSWORD);
		await this.submitLogin();
	}

	async hasEmailValidationError(): Promise<boolean> {
		return await this.hasClass(this.formGroup(this.registerEmail), 'error');
	}

	async hasUsernameValidationError(): Promise<boolean> {
		return await this.hasClass(this.formGroup(this.registerUsername), 'error');
	}

	async hasPasswordValidationError(): Promise<boolean> {
		return await this.hasClass(this.formGroup(this.registerPassword), 'error');
	}

	async dismiss(): Promise<void> {
		return await this.dismissButton.click();
	}

	static formGroup(input: ElementFinder) {
		return input.element(by.xpath('./ancestor::div[contains(concat(" ", @class, " "), " form-group ")][1]'));
	}

}
