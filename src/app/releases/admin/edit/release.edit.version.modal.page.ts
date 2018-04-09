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
import { ReleaseBasePage } from '../release.base.page';

export class ReleaseEditVersionModalPage extends ReleaseBasePage {

	private changelog = element(by.id('changelog'));
	private releaseDate = element(by.id('version-release-date'));
	private releaseTime = element(by.id('version-release-time'));
	private submitButton = element(by.id('version-submit-btn'));
	private closeButton = element(by.id('version-close-btn'));

	async setChangelog(text: string) {
		await this.changelog.clear();
		await this.changelog.sendKeys(text);
	}

	async setReleaseDate(date: string, hours: number, minutes: number) {
		await this.releaseDate.clear();
		await this.releaseDate.sendKeys(date);
		const hoursFinder = this.releaseTime.element(by.model('hours'));
		const minutesFinder = this.releaseTime.element(by.model('minutes'));

		await hoursFinder.clear();
		await hoursFinder.sendKeys(hours);

		await minutesFinder.clear();
		await minutesFinder.sendKeys(minutes);
	}

	async clearCompatibility(fileName: string) {
		await this.getCompatibilityPanel(fileName).all(by.css('input[checked="checked"]')).each(async el => await el.click());
	}

	async setCompatibilityByName(fileName:string, buildName:string) {
		await this.getCompatibilityPanel(fileName)
			.all(by.css('label.ng-binding'))
			.filter(el => el.getText().then(text => text === buildName))
			.first()
			.click();
	}

	async uploadPlayfield(tableFileName:string, imageFileName:string) {
		const uploadPanel = this.getFilePanel(tableFileName)
			.all(by.className('playfield--image'))
			.filter(el => el.getAttribute('id').then(id => id.startsWith('playfield-image')))
			.first();
		return await this.upload(uploadPanel, imageFileName);
	}

	async rotatePlayfieldImage(fileName: string, clockwise = true) {
		const index = clockwise ? 1 : 0;
		await this.getFilePanel(fileName).all(by.css('.playfield-image h4 a')).get(index).click();
	}

	async hasCompatibilityValidationError(fileName:string): Promise<boolean> {
		return await this.getFilePanel(fileName).element(by.css('.alert.compatibility')).isDisplayed();
	}

	async hasPlayfieldImageValidationError(fileName:string): Promise<boolean> {
		return await this.getFilePanel(fileName).element(by.css('.alert.media')).isDisplayed();
	}

	async submit() {
		await this.submitButton.click();
	}

	async close() {
		await this.closeButton.click();
	}

	private getCompatibilityPanel(fileName:string) {
		return this.getFilePanel(fileName).element(by.css('.compatibility.row'));
	}

	private getFilePanel(fileName:string): ElementFinder {
		return element.all(by.id('files'))
			.filter(el => el.element(by.css('h2')).getText().then(text => text.includes(fileName)))
			.first();
	}

}
