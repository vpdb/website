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

	setText(text:string) {
		this.textarea.clear();
		this.textarea.sendKeys(text);
	}

	clear() {
		this.textarea.clear();
	}

	getPreview(): promise.Promise<string> {
		return this.previewContent.getAttribute('innerHTML');
	}

	toggleEdit(): promise.Promise<void> {
		return this.isPreviewToggled().then(mustToggle => {
			if (mustToggle) {
				return this.editTab.click();
			}
		});
	}

	togglePreview(): promise.Promise<void> {
		return this.isEditToggled().then(mustToggle => {
			if (mustToggle) {
				return this.previewTab.click();
			}
		});
	}

	isEditToggled(): promise.Promise<boolean> {
		return this.hasClass(this.editTab, 'active');
	}

	isPreviewToggled(): promise.Promise<boolean> {
		return this.hasClass(this.previewTab, 'active');
	}
}

