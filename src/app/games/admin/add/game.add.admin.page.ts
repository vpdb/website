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

import { browser, by, element } from 'protractor';
import { AppPage } from '../../../app.page';
import { BasePage } from '../../../../test/BasePage';

export class GameAddAdminPage extends BasePage {

	appPage = new AppPage();

	title = element(by.id('title'));
	ipdbUrl = element(by.id('ipdb-url'));
	ipdbFetchButton = element(by.id('ipdb-fetch'));
	gameIdRecreation = element(by.id('game-id-1'));
	resetButton = element(by.id('game-reset-btn'));
	submitButton = element(by.id('game-submit-btn'));
	gameInfoPanel = element(by.id('game-info-panel'));
	gameInfoTitle = this.gameInfoPanel.element(by.css('h2'));

	backglassUploadPanel = element(by.id('backglass-upload'));
	backglassImage = this.backglassUploadPanel.element(by.css('.img--ar-bg'));
	backglassProgress = this.backglassUploadPanel.element(by.css('.progress'));

	logoUploadPanel = element(by.id('logo-upload'));
	logoImage = this.logoUploadPanel.element(by.css('.img--ar-logo'));
	logoProgress = this.logoUploadPanel.element(by.css('.progress'));

	async get() {
		await this.appPage.get();
		await this.appPage.loginAs('contributor');
		await this.navigate();
	}

	async navigate() {
		await this.appPage.uploadButton.click();
		await this.appPage.uploadGameButton.click();
	}

	async submit() {
		await this.submitButton.click();
	}

	async reset() {
		await this.resetButton.click();
	}

	async fetchIpdb(ipdb:string) {
		await this.ipdbUrl.sendKeys(ipdb);
		await this.ipdbFetchButton.click();
	}

	async uploadBackglass(fileName:string) {
		await this.upload(this.backglassUploadPanel, fileName);
		await browser.wait(() => this.backglassProgress.isDisplayed().then(result => !result), 5000);
	}

	async uploadLogo(fileName:string) {
		await this.upload(this.logoUploadPanel, fileName);
		await browser.wait(() => this.logoProgress.isDisplayed().then(result => !result), 5000);
	}

	async hasTitleValidatorErrors(): Promise<boolean> {
		return await this.hasClass(this.formGroup(this.title), 'error');
	}

	async hasRecreationIdValidationErrors(): Promise<boolean> {
		return await this.hasClass(this.formGroup(this.gameIdRecreation), 'error');
	}

	async hasBackglassValidationErrors() {
		return await element(by.css(`[ng-show="vm.errors['_backglass']"]`)).isDisplayed();
	}

}
