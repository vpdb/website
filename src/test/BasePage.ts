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
import { promise } from 'selenium-webdriver';
import { resolve } from "path";

export class BasePage {

	/**
	 * Returns true if a node has a given class.
	 *
	 * @param {ElementFinder} input Element to match
	 * @param {string} className Class name to check
	 * @returns {promise.Promise<boolean>}
	 */
	protected hasClass(input: ElementFinder, className:string): promise.Promise<boolean> {
		return input.getAttribute('class').then(classes => {
			return classes.split(' ').indexOf(className) > -1;
		});
	}

	/**
	 * Returns the first parent of the given element with class `form-group`.
	 *
	 * @param {ElementFinder} input Node to start with
	 * @return {ElementFinder}
	 */
	protected formGroup(input: ElementFinder): ElementFinder {
		return input.element(by.xpath('./ancestor::div[contains(concat(" ", @class, " "), " form-group ")][1]'));
	}

	/**
	 * Returns a child of a parent with a given ID that has a child with
	 * the given text.
	 *
	 * - The parent can be any element
	 * - The text node can be any element
	 * - Per default, the returned node is a `li` with class `panel`
	 *
	 * @param {string} parentId ID of the parent
	 * @param {string} text Text to find
	 * @param {string} [nodeElement=li] Element of the returned node
	 * @param {string} [nodeClass=panel] Class of the returned node
	 * @return {ElementFinder}
	 */
	protected parentWithText(parentId:string, text:string, nodeElement:string='li', nodeClass:string='panel'): ElementFinder {
		return element(by.xpath(`//*[@id='${parentId}']//*[contains(text(),'${text}')]/ancestor::${nodeElement}[contains(concat(" ", @class, " "), " ${nodeClass} ")][1]`));
	}

	/**
	 * Uploads a file to a given file-upload component
	 *
	 * @param {ElementFinder} dropPanel File-upload panel
	 * @param {string} fileName File to upload
	 */
	protected upload(dropPanel:ElementFinder, fileName:string) {
		const path = resolve(__dirname, '../../../src/test/assets/', fileName);
		return dropPanel.getAttribute('id').then(id => {
			return dropPanel.click().then(() => element(by.id('ngf-' + id)).sendKeys(path));
		});
	}
}
