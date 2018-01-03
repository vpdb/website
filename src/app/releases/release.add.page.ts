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

import { resolve } from 'path';
import { browser, by, element } from 'protractor';
import { promise } from 'selenium-webdriver';
import { AuthorSelectModalPage } from '../users/author.select.modal.page';
import { TagAddModalPage } from '../tag/tag.add.modal.page';
import { Game } from '../../test/models/Game';
import { ReleaseAddBasePage } from './release.add.base.page';

export class ReleaseAddPage extends ReleaseAddBasePage {

	private name = element(by.id('name'));
	private authors = element.all(by.repeater('author in vm.release.authors'));
	private tagsSelected = element.all(by.repeater('tag in vm.meta.tags'));
	private tagsExisting = element.all(by.repeater('tag in vm.tags'));
	private version = element(by.id('version'));
	private modPermission = element(by.id('mod-permission'));
	private availableTags = element(by.id('available-tags'));
	private selectedTags = element(by.id('selected-tags'));
	private generateNameButton = element(by.id('generate-name-btn'));
	private addAuthorButton = element(by.id('add-author-btn'));
	private addTagButton = element(by.id('add-tag-btn'));
	private resetButton = element(by.id('release-reset-btn'));
	private submitButton = element(by.id('release-submit-btn'));

	get(game:Game) {
		this.appPage.get();
		this.appPage.loginAs('member');
		this.navigate(game);
	}

	navigate(game:Game) {
		browser.get(browser.baseUrl + '/games/' + game.id + '/add-release');
	}

	clearAuthors() {
		this.authors.each(author => {
			browser.actions().mouseMove(author).perform();
			const delButton = author.element(by.css('[ng-click="vm.removeAuthor(author)"]'));
			delButton.click();
		});
	}

	generateReleaseName() {
		this.generateNameButton.click();
		browser.wait(() => this.name.getAttribute('value').then(text => !!text), 5000);
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

	createTag(name:string = null, description:string = null) {
		this.addTagButton.click();
		const tagModal = new TagAddModalPage();
		if (name !== null && description !== null) {
			tagModal.setName(name);
			tagModal.setDescription(description);
			tagModal.submit();
		}
	}

	selectTag(name:string) {
		const tag = this.tagsExisting.filter(el => el.getText().then(text => text === name)).first();
		browser.actions().dragAndDrop(tag, this.selectedTags).mouseUp().perform();
		browser.wait(() => this.hasSelectedTag(name), 5000);
	}

	removeTagByClick(name:string) {
		return this.findSelectedTag(name).first().element(by.tagName('svg')).click();
	}

	removeTagByDrag(name:string) {
		const tag = this.findSelectedTag(name).first().element(by.className('badge'));
		browser.actions().dragAndDrop(tag, this.availableTags).mouseUp().perform();
		browser.wait(() => this.hasTag(name), 5000);
	}

	hasTag(name:string) {
		return this.tagsExisting
			.filter(el => el.getText().then(text => text === name))
			.then(els => els.length === 1);
	}

	hasSelectedTag(name:string) {
		return this.findSelectedTag(name).then(els => els.length === 1);
	}

	setVersion(version:string) {
		this.version.sendKeys(version);
	}

	setModPermission(pos:number) {
		this.modPermission.all(by.tagName('label')).get(pos).click();
	}

	reset() {
		this.resetButton.click();
	}

	submit() {
		this.submitButton.click();
	}

	hasNameValidationError(): promise.Promise<boolean> {
		return this.hasClass(this.formGroup(this.name), 'error');
	}

	hasVersionValidationError(): promise.Promise<boolean> {
		return this.hasClass(this.formGroup(this.version), 'error');
	}

	hasAuthorValidationError(): promise.Promise<boolean> {
		return element(by.css('.alert[ng-show="vm.errors.authors"]')).isDisplayed();
	}

	hasLicenseValidationError(): promise.Promise<boolean> {
		return element(by.css('.alert[ng-show="vm.errors.license"]')).isDisplayed();
	}

	private findSelectedTag(name:string) {
		return this.tagsSelected.filter(el => el.element(by.className('badge')).getText().then(text => text === name));
	}
}