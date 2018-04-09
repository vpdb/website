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
import { ReleaseBasePage } from '../release.base.page';
import { Release } from '../../../../test/models/Release';

export class ReleaseAddVersionPage extends ReleaseBasePage {

	private resetButton = element(by.id('version-reset-btn'));
	private submitButton = element(by.id('version-submit-btn'));
	private uploadMode = element(by.id('upload-mode'));

	async get(release: Release) {
		await this.appPage.get();
		await this.appPage.loginAs('member');
		await this.navigate(release);
	}

	async navigate(release: Release) {
		await browser.get(browser.baseUrl + '/games/' + release.game.id + '/releases/' + release.id + '/add');
	}

	async setExistingVersion(version: string) {
		await this.uploadMode.all(by.className('radio--lg')).get(0).element(by.tagName('label')).click();
		await this.uploadMode.element(by.model('vm.meta.version'))
			.all(by.tagName('option'))
			.filter(el => el.getText().then(text => text === version))
			.first()
			.click();
	}

	async setNewVersion(version: string) {
		await this.uploadMode.all(by.className('radio--lg')).get(1).element(by.tagName('label')).click();
		await this.uploadMode.element(by.model('vm.releaseVersion.version')).sendKeys(version);
	}

	async reset() {
		await this.resetButton.click();
	}

	async submit() {
		await this.submitButton.click();
	}
}
