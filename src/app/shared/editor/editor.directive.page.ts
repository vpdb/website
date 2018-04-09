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
import { by, ElementFinder } from 'protractor';
import { promise } from 'selenium-webdriver';

export class EditorDirectivePage extends BasePage {

	textarea = this.el.element(by.tagName('textarea'));
	previewContent = this.el.element(by.css('div.markdown'));
	editTab = this.el.element(by.css('.uib-tab uib-tab-heading[title="Write"]'));
	previewTab = this.el.element(by.css('.uib-tab uib-tab-heading[title="Preview"]'));

	constructor(private el:ElementFinder) {
		super();
	}

	async setText(text:string) {
		await this.textarea.clear();
		await this.textarea.sendKeys(text);
	}

	async clear() {
		await this.textarea.clear();
	}

	async getPreview(): Promise<string> {
		return await this.previewContent.getAttribute('innerHTML');
	}

	async toggleEdit(): Promise<void> {
		const mustToggle = await this.isPreviewToggled();
		if (mustToggle) {
			await this.editTab.click();
		}
	}

	async togglePreview(): Promise<void> {
		const mustToggle = this.isEditToggled();
		if (mustToggle) {
			this.previewTab.click();
		}
	}

	async isEditToggled(): Promise<boolean> {
		return await this.hasClass(this.editTab, 'active');
	}

	async isPreviewToggled(): Promise<boolean> {
		return await this.hasClass(this.previewTab, 'active');
	}
}

