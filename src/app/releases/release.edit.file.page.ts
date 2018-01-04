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
import { ReleaseAddBasePage } from './release.add.base.page';
import { Release } from '../../test/models/Release';

export class ReleaseEditFilePage extends ReleaseAddBasePage {

	private versions = element(by.id('#versions'));
	private resetButton = element(by.id('release-reset-btn'));
	private submitButton = element(by.id('release-submit-btn'));

	constructor() {
		super();
		this.authors = element.all(by.repeater('author in vm.updatedRelease.authors'))
	}

	get(release: Release) {
		this.appPage.get();
		this.appPage.loginAs('member');
		this.navigate(release);
	}

	navigate(release: Release) {
		browser.get(browser.baseUrl + '/games/' + release.game.id + '/releases/' + release.id + '/edit');
	}

	setReleaseName(name:string) {
		this.name.clear();
		this.name.sendKeys(name);
	}

	reset() {
		this.resetButton.click();
	}

	submit() {
		this.submitButton.click();
	}

	editVersion(version: string) {
		this.versions
			.all(by.tagName('td'))
			.filter(el => el.getText().then(text => text === version))
			.first()
			.click();
	}
}
