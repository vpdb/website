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

import { by, element, ElementFinder } from 'protractor';
import { ReleaseAddBasePage } from './release.add.base.page';
import { promise } from 'selenium-webdriver';

export class ReleaseEditVersionModalPage extends ReleaseAddBasePage {

	private changelog = element(by.id('changelog'));
	private releaseDate = element(by.id('version-release-date'));
	private releaseTime = element(by.id('version-release-time'));
	private submitButton = element(by.id('version-submit-btn'));
	private closeButton = element(by.id('version-close-btn'));

	setChangelog(text: string) {
		this.changelog.clear();
		this.changelog.sendKeys(text);
	}

	setReleaseDate(date: string, hours: number, minutes: number) {
		this.releaseDate.clear();
		this.releaseDate.sendKeys(date);
		const hoursFinder = this.releaseTime.element(by.model('hours'));
		const minutesFinder = this.releaseTime.element(by.model('minutes'));

		hoursFinder.clear();
		hoursFinder.sendKeys(hours);

		minutesFinder.clear();
		minutesFinder.sendKeys(minutes);
	}

	clearCompatibility(fileName: string) {
		this.getCompatibilityPanel(fileName).all(by.css('input[checked="checked"]')).each(el => el.click());
	}

	setCompatibility(fileName:string, type:number, value:number) {
		// todo
	}

	rotatePlayfieldImage(fileName: string, clockwise = true) {
		const index = clockwise ? 1 : 0;
		this.getFilePanel(fileName).all(by.css('.playfield-image h4 a')).get(index).click();
	}

	hasCompatibilityValidationError(fileName:string): promise.Promise<boolean> {
		return this.getFilePanel(fileName).element(by.css('.alert.compatibility')).isDisplayed();
	}

	hasPlayfieldImageValidationError(fileName:string): promise.Promise<boolean> {
		return this.getFilePanel(fileName).element(by.css('.alert.media')).isDisplayed();
	}

	submit() {
		this.submitButton.click();
	}

	close() {
		this.closeButton.click();
	}

	private getCompatibilityPanel(fileName:string) {
		return this.getFilePanel(fileName).element(by.className('compatibility'));
	}

	private getFilePanel(fileName:string): ElementFinder {
		return element.all(by.id('files'))
			.filter(el => el.element(by.css('h2')).getText().then(text => text.includes(fileName)))
			.first();
	}

}
