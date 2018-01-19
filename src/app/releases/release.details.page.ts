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

import { BasePage } from '../../test/BasePage';
import { browser, by, element } from 'protractor';
import { Game } from '../../test/models/Game';
import { Release } from '../../test/models/Release';
import { AppPage } from '../app.page';

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

	get(release:Release, username:string = null) {
		if (username) {
			this.appPage.get();
			this.appPage.loginAs('member');
		}
		this.navigate(release);
	}

	navigate(release:Release) {
		browser.get(browser.baseUrl + '/games/' + release.game.id + '/releases/' + release.id);
	}

	getDescription() {
		return this.description.getText();
	}

	getTitle() {
		return this.title.getText();
	}

	toggleFilenames() {
		this.showFilenames.click();
	}

	toggleModerationZone() {
		this.moderationToggleModeration.click();
	}

	editRelease() {
		this.editReleaseButton.click();
	}

	addVersion() {
		this.addVersionButton.click();
	}

	hasAdminZone() {
		return browser.isElementPresent(this.adminZone);
	}

	hasModerationZone() {
		return browser.isElementPresent(this.moderationZone);
	}

	hasModerationZoneToggle() {
		return this.moderationToggleModeration.isDisplayed();
	}

	hasFilenamesToggled() {
		return element(by.id('flavors'))
			.all(by.css('thead > tr > th'))
			.filter(el => el.getText().then(str => str === 'File Name'))
			.then(els => els.length === 1);
	}

	doesExist() {
		return browser.isElementPresent(this.destructionPic).then(present => !present);
	}
}
