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

import { promise } from 'selenium-webdriver';
import { browser, element, by } from 'protractor';
import { LoginModalPage } from '../auth/login.modal.page';

export class HomePage {

	searchInput = element(by.model('vm.q'));
	searchResult = element(by.id('search-result'));
	noResult = element(by.id('no-result'));
	panel = element(by.id('whats-this'));
	panelToggle = element(by.id('toggle'));
	panelTitle = this.panel.element(by.css('h3'));
	panelClose = this.panel.element(by.css('.clear > svg'));

	get() {
		browser.get(browser.baseUrl);
	}

	search(query: string) {
		this.searchInput.sendKeys(query);
	}

	clearSearch() {
		this.searchInput.clear();
	}

	togglePanel() {
		this.panelToggle.click();
	}

	closePanel() {
		this.panelClose.click();
	}

	getNoResult(): promise.Promise<string> {
		return this.noResult.getText();
	}
}