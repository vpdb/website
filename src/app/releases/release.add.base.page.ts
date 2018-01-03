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
import { AppPage } from "../app.page";
import { promise } from "selenium-webdriver";
import { by, element } from "protractor";
import { resolve } from "path";

export class ReleaseAddBasePage extends BasePage {

	protected appPage = new AppPage();

	protected filesUpload = element(by.id('ngf-files-upload'));
	protected filesUploadPanel = element(by.id('files-upload'));

	uploadFile(fileName:string) {
		const path = resolve(__dirname, '../../../../src/test/assets/', fileName);
		this.filesUploadPanel.click();
		this.filesUpload.sendKeys(path);
	}

	uploadPlayfield(tableFileName:string, imageFileName:string) {
		const path = resolve(__dirname, '../../../../src/test/assets/', imageFileName);
		const panel = this.parentWithText('media', tableFileName, 'span', 'ng-scope');
		const uploadPanel = panel.element(by.className('playfield--image'));
		return uploadPanel.getAttribute('id').then(id => {
			panel.click();
			element(by.id('ngf-' + id)).sendKeys(path);
		});
	}

	setFlavor(fileName:string, type:number, value:number) {
		const panel = this.parentWithText('flavors', fileName);
		panel.all(by.tagName('tr')).get(type)
			.all(by.tagName('td')).get(value)
			.element(by.tagName('label'))
			.click();
	}

	setCompatibility(fileName:string, type:number, value:number) {
		const panel = this.parentWithText('compatibility', fileName);
		panel.all(by.css('.col--list-files-right > .col-md-4')).get(type)
			.all(by.css('.simple-list')).get(value)
			.element(by.tagName('label'))
			.click();
	}

	hasFileUploadValidationError(): promise.Promise<boolean> {
		return this.hasClass(this.filesUploadPanel, 'error');
	}

	hasFlavorValidationError(filename:string): promise.Promise<boolean> {
		return this.hasClass(this.parentWithText('flavors', filename), 'error');
	}

	hasCompatibilityValidationError(filename:string): promise.Promise<boolean> {
		return this.hasClass(this.parentWithText('compatibility', filename), 'error');
	}

	hasPlayfieldImageValidationError(filename:string): promise.Promise<boolean> {
		return this.parentWithText('media', filename, 'span', 'ng-scope').element(by.className('alert')).isDisplayed();
	}
}
