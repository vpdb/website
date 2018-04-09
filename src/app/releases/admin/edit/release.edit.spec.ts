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
import { AppPage } from '../../../app.page';
import { Releases } from '../../../../test/backend/Releases';
import { Users } from '../../../../test/backend/Users';
import { Release } from '../../../../test/models/Release';
import { ReleaseEditPage } from './release.edit.page';
import { ReleaseDetailsPage } from '../../details/release.details.page';

describe('Edit a release', () => {

	const appPage = new AppPage();
	const releaseEditPage = new ReleaseEditPage();
	const users:Users = new Users(browser.params.vpdb);
	const releases:Releases = new Releases(browser.params.vpdb);
	let release:Release;

	beforeAll(async () => {
		await users.authenticateOrCreateUser('SecondMate');
		release = await releases.createRelease('member');
		await releaseEditPage.get(release);
	});

	afterEach(async () => {
		await browser.executeScript('window.scrollTo(0,0);');
	});

	afterAll(async () => {
		await appPage.logout();
	});

	it('should display validation errors', async () => {
		await releaseEditPage.setReleaseName('');
		await releaseEditPage.clearAuthors();
		await releaseEditPage.submit();

		await expect(releaseEditPage.hasNameValidationError()).toBeTruthy();
		await expect(releaseEditPage.hasAuthorValidationError()).toBeTruthy();
		await releaseEditPage.reset();
	});

	it('should correctly update the release', async () => {
		await releaseEditPage.setReleaseName('Updated Release Edition');
		await releaseEditPage.setDescription('Sup, release description is updated!');
		await releaseEditPage.addAuthor('SecondMate', 'Pet');
		await releaseEditPage.createTag('Edited', 'Release has been edited.');
		await releaseEditPage.selectTag('Edited');
		await releaseEditPage.addLink('VPDB', 'https://vpdb.io');
		await releaseEditPage.setAcknowledgements('- My friends\n- My family\n- My fools');

		await releaseEditPage.submit();

		await expect(browser.getCurrentUrl()).toContain(browser.baseUrl + '/games/' + release.game.id + '/releases/' + release.id);
		const releaseDetailsPage = new ReleaseDetailsPage();

		await expect(releaseDetailsPage.getTitle()).toContain('Updated Release Edition'.toUpperCase());
		await expect(releaseDetailsPage.getDescription()).toContain('release description is updated');

		await releaseEditPage.navigate(release);
	});
});
