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
import { Release } from '../../../../test/models/Release';
import { Releases } from '../../../../test/backend/Releases';
import { ReleaseDetailsPage } from '../../details/release.details.page';
import { ReleaseEditPage } from './release.edit.page';
import { ReleaseEditVersionModalPage } from './release.edit.version.modal.page';

describe('Edit an existing version of a release', () => {

	const tableFilename = 'Wrongfully Uploaded Version';
	const appPage = new AppPage();
	const releasePage = new ReleaseDetailsPage();
	const releaseEditPage = new ReleaseEditPage();
	const versionEditModal = new ReleaseEditVersionModalPage();
	const releases: Releases = new Releases(browser.params.vpdb);
	let release: Release;

	beforeAll(async () => {
		release = await releases.createRelease('member', { versions: [ { version: '1.0.0' } ] }, null, tableFilename);
		await releaseEditPage.get(release);
	});

	beforeEach(async () => {
		await releaseEditPage.editVersion('1.0.0');
	});

	afterEach(async () => {
		await browser.executeScript('window.scrollTo(0,0);');
	});

	afterAll(async () => {
		await appPage.logout();
	});

	it('should display validation errors', async () => {
		await versionEditModal.clearCompatibility(tableFilename);
		await versionEditModal.rotatePlayfieldImage(tableFilename);
		await versionEditModal.submit();
		await browser.waitForAngular();
		await browser.sleep(1000); // FIXME
		expect(await versionEditModal.hasCompatibilityValidationError(tableFilename)).toBeTruthy();
		expect(await versionEditModal.hasPlayfieldImageValidationError(tableFilename)).toBeTruthy();
		await versionEditModal.close();
	});

	it('should edit an existing version', async () => {
		await versionEditModal.setChangelog('- Edited data');
		await versionEditModal.setReleaseDate('1978-05-07', 14, 20);
		await versionEditModal.clearCompatibility(tableFilename);
		await versionEditModal.setCompatibilityByName(tableFilename, 'physmod5');
		await versionEditModal.uploadPlayfield(tableFilename, 'playfield-1080x1920.png');
		await versionEditModal.submit();

		const modal = await appPage.getErrorInfoModal();
		expect(await modal.title.getText()).toEqual('VERSION UPDATED');
		expect(await modal.subtitle.getText()).toContain(release.game.title.toUpperCase());
		expect(await modal.message.getText()).toContain('You have successfully updated version');
		await modal.close();

		await releaseEditPage.cancel();
		await releasePage.editRelease();
	});
});
