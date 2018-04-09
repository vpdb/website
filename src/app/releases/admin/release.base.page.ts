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

import { browser, by, element, ElementArrayFinder } from 'protractor';
import { promise } from 'selenium-webdriver';
import { BasePage } from '../../../test/BasePage';
import { AppPage } from '../../app.page';
import { TagAddModalPage } from './tag/tag.add.modal.page';
import { AuthorSelectModalPage } from '../../shared/author-select/author.select.modal.page';

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

	async uploadFile(fileName:string) {
		return await this.upload(this.filesUploadPanel, fileName);
	}

	async uploadPlayfield(tableFileName:string, imageFileName:string) {
		const panel = this.parentWithText('media', tableFileName, 'span', 'ng-scope');
		const uploadPanel = panel
			.all(by.className('playfield--image'))
			.filter(el => el.getAttribute('id').then(id => id.startsWith('playfield-image')))
			.first();
		return await this.upload(uploadPanel, imageFileName);
	}

	async setDescription(description:string) {
		await this.description.clear();
		await this.description.sendKeys(description);
	}

	async setFlavor(fileName:string, type:number, value:number) {
		const panel = this.parentWithText('flavors', fileName);
		await panel.all(by.tagName('tr')).get(type)
			.all(by.tagName('td')).get(value)
			.element(by.tagName('label'))
			.click();
	}

	async setCompatibility(fileName:string, type:number, value:number) {
		const panel = this.parentWithText('compatibility', fileName);
		await panel.all(by.css('.col--list-files-right > .col-md-4')).get(type)
			.all(by.css('.simple-list')).get(value)
			.element(by.tagName('label'))
			.click();
	}

	async addAuthor(name:string = '', role:string = '') {
		await this.addAuthorButton.click();
		const authorModal = new AuthorSelectModalPage();
		if (name) {
			await authorModal.search(name);
			await authorModal.selectSearchResult(0);
		}
		if (role) {
			await authorModal.addRole(role);
		}

		if (name && role) {
			await authorModal.submit();
		}
	}

	async editAuthor(name:string) {
		const author = this.authors.filter(el => el.element(by.css('.media-body h6')).getText().then(text => text === name)).first();
		await browser.actions().mouseMove(author).perform();
		const editButton = author.element(by.css('[ng-click="vm.addAuthor(author)"]'));
		await editButton.click();
	}

	async hasAuthor(name:string, role:string) {
		const author = this.authors.filter(el => el.element(by.css('.media-body h6')).getText().then(text => text === name)).first();
		return await author.element(by.css('.media-body > span')).getText().then(text => text === role);

	}

	async clearAuthors() {
		this.authors.each(async author => {
			await browser.actions().mouseMove(author).perform();
			const delButton = author.element(by.css('[ng-click="vm.removeAuthor(author)"]'));
			await delButton.click();
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
	async createTag(name: string = null, description: string = null) {
		if (name !== null && description !== null) {
			const hasTag = await this.hasAvailableTag(name);
			if (hasTag) {
				console.log('Tag "%s" already exists, not creating.', name);
				return;
			}
			await this.addTagButton.click();
			const tagModal = new TagAddModalPage();
			await tagModal.setName(name);
			await tagModal.setDescription(description);
			await tagModal.submit();
		} else {
			await this.addTagButton.click();
		}
	}

	async selectTag(name:string) {
		const tag = this.tagsAvailable.filter(el => el.getText().then(text => text === name)).first();
		await browser.actions().dragAndDrop(tag, this.selectedTags).mouseUp().perform();
		await browser.wait(() => this.hasSelectedTag(name), 5000);
	}

	async removeTagByClick(name:string) {
		return await this.findSelectedTag(name).first().element(by.tagName('svg')).click();
	}

	async removeTagByDrag(name:string) {
		const tag = this.findSelectedTag(name).first().element(by.className('badge'));
		await browser.actions().dragAndDrop(tag, this.availableTags).mouseUp().perform();
		await browser.wait(() => this.hasAvailableTag(name), 5000);
	}

	async hasAvailableTag(name:string) {
		const els = await this.tagsAvailable.filter(el => el.getText().then(text => text === name));
		return els.length === 1;
	}

	async hasSelectedTag(name:string) {
		const els = await this.findSelectedTag(name);
		return els.length === 1;
	}

	private findSelectedTag(name:string): ElementArrayFinder {
		return this.tagsSelected.filter(el => el.element(by.className('badge')).getText().then(text => text === name));
	}

	async hasFileUploadValidationError(): Promise<boolean> {
		return await this.hasClass(this.filesUploadPanel, 'error');
	}

	async addLink(label: string, url: string) {
		await this.newLinkLabel.sendKeys(label);
		await this.newLinkUrl.sendKeys(url);
		await this.newLinkButton.click();
	}

	async setAcknowledgements(acknowledgements:string) {
		await this.acknowledgements.clear();
		await this.acknowledgements.sendKeys(acknowledgements);
	}

	async hasFlavorValidationError(fileName:string): Promise<boolean> {
		return await this.hasClass(this.parentWithText('flavors', fileName), 'error');
	}

	async hasCompatibilityValidationError(fileName:string): Promise<boolean> {
		return await this.hasClass(this.parentWithText('compatibility', fileName), 'error');
	}

	async hasPlayfieldImageValidationError(fileName:string): Promise<boolean> {
		return await this.parentWithText('media', fileName, 'span', 'ng-scope').element(by.className('alert')).isDisplayed();
	}

	async hasNameValidationError(): Promise<boolean> {
		return await this.hasClass(this.formGroup(this.name), 'error');
	}

	async hasAuthorValidationError(): Promise<boolean> {
		return await element(by.css('.alert[ng-show="vm.errors.authors"]')).isDisplayed();
	}
}
