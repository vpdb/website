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

import { browser } from 'protractor';
import { AppPage } from '../app.page';
import { Releases } from '../../test/backend/Releases';
import { Users } from '../../test/backend/Users';
import { Release } from '../../test/models/Release';
import { ReleaseEditFilePage } from './release.edit.file.page';
import { ReleaseDetailsPage } from "./release.details.page";

describe('Edit a release', () => {

	const appPage = new AppPage();
	const releaseEditPage = new ReleaseEditFilePage();
	const users:Users = new Users(browser.params.vpdb);
	const releases:Releases = new Releases(browser.params.vpdb);
	let release:Release;

	beforeAll(() => {
		return users.authenticateOrCreateUser('SecondMate')
			.then(() => releases.createRelease('member'))
			.then((createdRelease:Release) => {
				release = createdRelease;
				releaseEditPage.get(release);
			});
	});

	afterEach(() => {
		browser.executeScript('window.scrollTo(0,0);');
	});

	afterAll(() => {
		appPage.logout();
	});

	it('should display validation errors', () => {
		releaseEditPage.setReleaseName('');
		releaseEditPage.clearAuthors();
		releaseEditPage.submit();

		expect(releaseEditPage.hasNameValidationError()).toBeTruthy();
		expect(releaseEditPage.hasAuthorValidationError()).toBeTruthy();
		releaseEditPage.reset();
	});

	it('should correctly update the release', () => {
		releaseEditPage.setReleaseName('Updated Release Edition');
		releaseEditPage.setDescription('Sup, release description is updated!');
		releaseEditPage.addAuthor('SecondMate', 'Pet');
		releaseEditPage.createTag('Edited', 'Release has been edited.');
		releaseEditPage.selectTag('Edited');
		releaseEditPage.addLink('VPDB', 'https://vpdb.io');
		releaseEditPage.setAcknowledgements('- My friends\n- My family\n- My fools');

		releaseEditPage.submit();

		expect(browser.getCurrentUrl()).toContain(browser.baseUrl + '/games/' + release.game.id + '/releases/' + release.id);
		const releaseDetailsPage = new ReleaseDetailsPage();

		expect(releaseDetailsPage.getTitle()).toContain('Updated Release Edition'.toUpperCase());
		expect(releaseDetailsPage.getDescription()).toContain('release description is updated');

		releaseEditPage.navigate(release);
	});
});
