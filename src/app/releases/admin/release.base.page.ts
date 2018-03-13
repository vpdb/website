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

import { browser, by, element, ElementArrayFinder, ElementFinder } from 'protractor';
import { promise } from 'selenium-webdriver';
import { resolve } from 'path';
import { BasePage } from '../../../test/BasePage';
import { AppPage } from '../../app.page';
import { TagAddModalPage } from './tag/tag.add.modal.page';
import { AuthorSelectModalPage } from "../../shared/author-select/author.select.modal.page";

export class ReleaseBasePage extends BasePage {

	protected appPage = new AppPage();

	protected name = element(by.id('name'));
	protected description = element(by.id('description'));
	private filesUploadPanel = element(by.id('files-upload'));
	private addAuthorButton = element(by.id('add-author-btn'));
	private availableTags = element(by.id('available-tags'));
	private selectedTags = element(by.id('selected-tags'));
	private tagsSelected = this.selectedTags.all(by.css('*[ng-repeat]'));
	private tagsAvailable = this.availableTags.all(by.css('*[ng-repeat]'));
	private addTagButton = element(by.id('add-tag-btn'));
	private newLinkLabel = element(by.id('link-label'));
	private newLinkUrl = element(by.id('link-url'));
	private newLinkButton = element(by.id('link-add-btn'));
	private acknowledgements = element(by.id('acknowledgements'));

	protected authors:ElementArrayFinder;

	uploadFile(fileName:string) {
		return this.upload(this.filesUploadPanel, fileName);
	}

	uploadPlayfield(tableFileName:string, imageFileName:string) {
		const panel = this.parentWithText('media', tableFileName, 'span', 'ng-scope');
		const uploadPanel = panel
			.all(by.className('playfield--image'))
			.filter(el => el.getAttribute('id').then(id => id.startsWith('playfield-image')))
			.first();
		return this.upload(uploadPanel, imageFileName);
	}

	setDescription(description:string) {
		this.description.clear();
		this.description.sendKeys(description);
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

	addAuthor(name:string = '', role:string = '') {
		this.addAuthorButton.click();
		const authorModal = new AuthorSelectModalPage();
		if (name) {
			authorModal.search(name);
			authorModal.selectSearchResult(0);
		}
		if (role) {
			authorModal.addRole(role);
		}

		if (name && role) {
			authorModal.submit();
		}
	}

	editAuthor(name:string) {
		const author = this.authors.filter(el => el.element(by.css('.media-body h6')).getText().then(text => text === name)).first();
		browser.actions().mouseMove(author).perform();
		const editButton = author.element(by.css('[ng-click="vm.addAuthor(author)"]'));
		editButton.click();
	}

	hasAuthor(name:string, role:string) {
		const author = this.authors.filter(el => el.element(by.css('.media-body h6')).getText().then(text => text === name)).first();
		return author.element(by.css('.media-body > span')).getText().then(text => text === role);

	}

	clearAuthors() {
		this.authors.each(author => {
			browser.actions().mouseMove(author).perform();
			const delButton = author.element(by.css('[ng-click="vm.removeAuthor(author)"]'));
			delButton.click();
		});
	}

	/**
	 * Creates a new tag or just opens the tag modal.
	 *
	 * Does nothing if name and description are provided and the tag already exists.
	 *
	 * @param {string} name
	 * @param {string} description
	 */
	createTag(name:string = null, description:string = null) {
		if (name !== null && description !== null) {
			this.hasAvailableTag(name).then(hasTag => {
				if (hasTag) {
					console.log('Tag "%s" already exists, not creating.', name);
					return;
				}
				this.addTagButton.click();
				const tagModal = new TagAddModalPage();
				tagModal.setName(name);
				tagModal.setDescription(description);
				tagModal.submit();
			});
		} else {
			this.addTagButton.click();
		}
	}

	selectTag(name:string) {
		const tag = this.tagsAvailable.filter(el => el.getText().then(text => text === name)).first();
		browser.actions().dragAndDrop(tag, this.selectedTags).mouseUp().perform();
		browser.wait(() => this.hasSelectedTag(name), 5000);
	}

	removeTagByClick(name:string) {
		return this.findSelectedTag(name).first().element(by.tagName('svg')).click();
	}

	removeTagByDrag(name:string) {
		const tag = this.findSelectedTag(name).first().element(by.className('badge'));
		browser.actions().dragAndDrop(tag, this.availableTags).mouseUp().perform();
		browser.wait(() => this.hasAvailableTag(name), 5000);
	}

	hasAvailableTag(name:string) {
		return this.tagsAvailable
			.filter(el => el.getText().then(text => text === name))
			.then(els => els.length === 1);
	}

	hasSelectedTag(name:string) {
		return this.findSelectedTag(name).then(els => els.length === 1);
	}

	private findSelectedTag(name:string) {
		return this.tagsSelected.filter(el => el.element(by.className('badge')).getText().then(text => text === name));
	}

	hasFileUploadValidationError(): promise.Promise<boolean> {
		return this.hasClass(this.filesUploadPanel, 'error');
	}

	addLink(label: string, url: string) {
		this.newLinkLabel.sendKeys(label);
		this.newLinkUrl.sendKeys(url);
		this.newLinkButton.click();
	}

	setAcknowledgements(acknowledgements:string) {
		this.acknowledgements.clear();
		this.acknowledgements.sendKeys(acknowledgements);
	}

	hasFlavorValidationError(fileName:string): promise.Promise<boolean> {
		return this.hasClass(this.parentWithText('flavors', fileName), 'error');
	}

	hasCompatibilityValidationError(fileName:string): promise.Promise<boolean> {
		return this.hasClass(this.parentWithText('compatibility', fileName), 'error');
	}

	hasPlayfieldImageValidationError(fileName:string): promise.Promise<boolean> {
		return this.parentWithText('media', fileName, 'span', 'ng-scope').element(by.className('alert')).isDisplayed();
	}

	hasNameValidationError(): promise.Promise<boolean> {
		return this.hasClass(this.formGroup(this.name), 'error');
	}

	hasAuthorValidationError(): promise.Promise<boolean> {
		return element(by.css('.alert[ng-show="vm.errors.authors"]')).isDisplayed();
	}
}
