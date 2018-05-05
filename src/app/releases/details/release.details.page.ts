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

import { BasePage } from '../../../test/BasePage';
import { browser, by, element } from 'protractor';
import { Release } from '../../../test/models/Release';
import { AppPage } from '../../app.page';

export class ReleaseDetailsPage extends BasePage {

	private appPage = new AppPage();

	private title = element(by.id('title'));
	private description = element(by.id('description'));
	private showFilenames = element(by.css('#show-filenames + label'));
	private addVersionButton = element(by.id('release-add-version-btn'));
	private editReleaseButton = element(by.id('release-edit-btn'));
	private adminZone = element(by.id('admin-zone'));
	private moderationZone = element(by.id('moderation-zone'));
	private destructionPic = element(by.className('pinball-destruct'));
	private moderationToggleModeration = element(by.css('#show-moderation + label'));
	private newCommentElement = element(by.id('new-comment-editor'));

	async get(release:Release, username:string = null) {
		if (username) {
			await this.appPage.get();
			await this.appPage.loginAs('member');
		}
		await this.navigate(release);
	}

	async navigate(release:Release) {
		await browser.get(browser.baseUrl + '/games/' + release.game.id + '/releases/' + release.id);
	}

	async getDescription() {
		return await this.description.getText();
	}

	async getTitle() {
		return await this.title.getText();
	}

	async toggleFilenames() {
		await this.showFilenames.click();
	}

	async toggleModerationZone() {
		await this.moderationToggleModeration.click();
	}

	async editRelease() {
		await this.editReleaseButton.click();
	}

	async hasAdminZone() {
		return await browser.isElementPresent(this.adminZone);
	}

	async addVersion() {
		await this.addVersionButton.click();
	}

	async hasModerationZone() {
		return await browser.isElementPresent(this.moderationZone);
	}

	async hasModerationZoneToggle() {
		return await this.moderationToggleModeration.isPresent();
	}

	async hasFilenamesToggled() {
		const els = await element(by.id('flavors'))
			.all(by.css('thead > tr > th'))
			.filter(el => el.getText().then(str => str === 'File Name'));
		return els.length === 1;
	}

	async hasNewCommentForm() {
		return await this.newCommentElement.isDisplayed();
	}

	async doesExist() {
		return !(await browser.isElementPresent(this.destructionPic));
	}
}
