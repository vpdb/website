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

	private submitButton = element(by.id('version-submit-btn'));
	private closeButton = element(by.id('version-close-btn'));

	clearCompatibility(fileName: string) {
		this.getCompatibilityPanel(fileName).all(by.css('input[checked="checked"]')).each(el => el.click());
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
