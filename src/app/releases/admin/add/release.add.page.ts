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
import { promise } from 'selenium-webdriver';
import { Game } from '../../../../test/models/Game';
import { ReleaseBasePage } from '../release.base.page';

export class ReleaseAddPage extends ReleaseBasePage {

	private version = element(by.id('version'));
	private modPermission = element(by.id('mod-permission'));
	private generateNameButton = element(by.id('generate-name-btn'));
	private resetButton = element(by.id('release-reset-btn'));
	private submitButton = element(by.id('release-submit-btn'));

	constructor() {
		super();
		this.authors = element.all(by.repeater('author in vm.release.authors'))
	}

	async get(game:Game) {
		await this.appPage.get();
		await this.appPage.loginAs('member');
		await this.navigate(game);
	}

	async navigate(game:Game) {
		await browser.get(browser.baseUrl + '/games/' + game.id + '/add-release');
	}

	async generateReleaseName() {
		await this.generateNameButton.click();
		await browser.wait(() => this.name.getAttribute('value').then(text => !!text), 5000);
	}

	async setVersion(version:string) {
		await this.version.sendKeys(version);
	}

	async setModPermission(pos:number) {
		await this.modPermission.all(by.tagName('label')).get(pos).click();
	}

	async reset() {
		await this.resetButton.click();
	}

	async submit() {
		await this.submitButton.click();
	}

	async hasVersionValidationError(): Promise<boolean> {
		return await this.hasClass(this.formGroup(this.version), 'error');
	}

	async hasLicenseValidationError(): Promise<boolean> {
		return await element(by.css('.alert[ng-show="vm.errors.license"]')).isDisplayed();
	}
}
