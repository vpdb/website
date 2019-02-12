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

import { browser, by, element, ExpectedConditions as until } from 'protractor';
import { ReleaseBasePage } from '../release.base.page';
import { Release } from '../../../../test/models/Release';

export class ReleaseEditPage extends ReleaseBasePage {

	private versions = element(by.id('versions'));
	private cancelButton = element(by.id('release-cancel-btn'));
	private resetButton = element(by.id('release-reset-btn'));
	private submitButton = element(by.id('release-submit-btn'));

	constructor() {
		super();
		this.authors = element.all(by.repeater('author in vm.updatedRelease.authors'))
	}

	async get(release: Release) {
		await this.appPage.get();
		await this.appPage.loginAs('member');
		await this.navigate(release);
	}

	async navigate(release: Release) {
		await browser.get(browser.baseUrl + '/games/' + release.game.id + '/releases/' + release.id + '/edit');
	}

	async setReleaseName(name:string) {
		await this.name.clear();
		await this.name.sendKeys(name);
	}

	async cancel() {
		await this.submitButton.click();
	}

	async reset() {
		await this.resetButton.click();
	}

	async submit() {
		await this.submitButton.click();
	}

	async editVersion(version: string) {
		await this.versions
			.all(by.tagName('td'))
			.filter(el => el.getText().then(text => text === version))
			.first()
			.click();
		await browser.wait(until.presenceOf(element(by.className('modal-dialog'))), 1000);
	}
}
