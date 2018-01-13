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
import { Release } from '../../test/models/Release';
import { Releases } from '../../test/backend/Releases';
import { ReleaseDetailsPage } from './release.details.page';
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

	beforeAll(() => {
		return releases.createRelease('member', { versions: [ { version: '1.0.0' } ] }, null, tableFilename)
			.then((createdRelease:Release) => {
				release = createdRelease;
				releaseEditPage.get(release);
			});
	});

	beforeEach(() => {
		releaseEditPage.editVersion('1.0.0');
	});

	afterEach(() => {
		browser.executeScript('window.scrollTo(0,0);');
	});

	afterAll(() => {
		appPage.logout();
	});

	it('should display validation errors', () => {
		versionEditModal.clearCompatibility(tableFilename);
		versionEditModal.rotatePlayfieldImage(tableFilename);
		versionEditModal.submit();
		expect(versionEditModal.hasCompatibilityValidationError(tableFilename)).toBeTruthy();
		expect(versionEditModal.hasPlayfieldImageValidationError(tableFilename)).toBeTruthy();
		versionEditModal.close();
	});

	it('should edit an existing version', () => {
		versionEditModal.setChangelog('- Edited data');
		versionEditModal.setReleaseDate('1978-05-07', 14, 20);
		versionEditModal.clearCompatibility(tableFilename);
		versionEditModal.setCompatibilityByName(tableFilename, 'physmod5');
		versionEditModal.uploadPlayfield(tableFilename, 'playfield-1080x1920.png');
		versionEditModal.submit();

		const modal = appPage.getErrorInfoModal();
		expect(modal.title.getText()).toEqual('VERSION UPDATED');
		expect(modal.subtitle.getText()).toContain(release.game.title.toUpperCase());
		expect(modal.message.getText()).toContain('You have successfully updated version');
		modal.close();

		releaseEditPage.cancel();
		releasePage.editRelease();
	});
});
