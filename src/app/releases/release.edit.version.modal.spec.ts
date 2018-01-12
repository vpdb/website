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
import { ReleaseEditPage } from './release.edit.page';
import { ReleaseEditVersionModalPage } from './release.edit.version.modal.page';

describe('Edit an existing version of a release', () => {

	const appPage = new AppPage();
	const releaseEditPage = new ReleaseEditPage();
	const versionEditModal = new ReleaseEditVersionModalPage();
	const releases: Releases = new Releases(browser.params.vpdb);
	let release: Release;

	beforeAll(() => {
		return releases.createRelease('member', { versions: [ { version: '1.0.0' } ] })
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
		versionEditModal.clearCompatibility('blank.vpt');
		versionEditModal.rotatePlayfieldImage('blank.vpt');
		versionEditModal.submit();
		expect(versionEditModal.hasCompatibilityValidationError('blank.vpt')).toBeTruthy();
		expect(versionEditModal.hasPlayfieldImageValidationError('blank.vpt')).toBeTruthy();
		versionEditModal.close();
	});

	xit('should edit an existing version', () => {
		versionEditModal.setChangelog('- Edited data');
		versionEditModal.setReleaseDate('1978-05-07', 14, 20);
		versionEditModal.clearCompatibility('blank.vpt');
		versionEditModal.setCompatibility('blank.vpt', 0, 0);
	});
});
