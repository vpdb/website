/*
 * VPDB - Virtual Pinball Database
 * Copyright (C) 2019 freezy <freezy@vpdb.io>
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
import { Releases } from '../../../../test/backend/Releases';
import { Release } from '../../../../test/models/Release';
import { AppPage } from '../../../app.page';
import { ReleaseAddVersionPage } from './release.add.version.page';

describe('Add new version to release', () => {

	const appPage = new AppPage();
	const versionAddPage = new ReleaseAddVersionPage();
	const releases:Releases = new Releases(browser.params.vpdb);
	let release:Release;

	beforeAll(async () => {
		release = await releases.createRelease('member', { versions: [ { version: '1.0.0' } ] });
		await versionAddPage.get(release);
	});

	afterEach(async () => {
		await browser.executeScript('window.scrollTo(0,0);');
	});

	afterAll(async () => {
		await appPage.logout();
	});

	it('should display validation errors when no file uploaded', async () => {
		await versionAddPage.submit();
		expect(await versionAddPage.hasFileUploadValidationError()).toBe(true);
		await versionAddPage.reset();
	});

	it('should display validation errors when a file is uploaded.', async () => {
		const fileName = 'blank.vpt';
		await versionAddPage.uploadFile(fileName);
		await versionAddPage.submit();
		expect(await versionAddPage.hasFlavorValidationError(fileName)).toBe(true);
		expect(await versionAddPage.hasCompatibilityValidationError(fileName)).toBe(true);
		expect(await versionAddPage.hasPlayfieldImageValidationError(fileName)).toBe(true);
		await versionAddPage.reset();
	});

	it('should add a new file to an existing version', async () => {
		const fileName = 'blank.vpt';
		await versionAddPage.uploadFile(fileName);
		await versionAddPage.setExistingVersion('1.0.0');
		await versionAddPage.setFlavor(fileName, 0, 0); // orientation: desktop
		await versionAddPage.setFlavor(fileName, 1, 1); // lighting: day
		await versionAddPage.setCompatibility(fileName, 0, 0);
		await versionAddPage.uploadPlayfield(fileName,'playfield-1920x1080.png');
		await versionAddPage.submit();

		const modal = await appPage.getErrorInfoModal();
		expect(await modal.title.getText()).toEqual('SUCCESS!');
		expect(await modal.subtitle.getText()).toContain(release.game.title.toUpperCase());
		expect(await modal.subtitle.getText()).toContain(release.name.toUpperCase());
		expect(await modal.message.getText()).toContain('Successfully uploaded new files to version');
		expect(await browser.getCurrentUrl()).toContain(browser.baseUrl + '/games/' + release.game.id + '/releases/' + release.id);
		await modal.close();
		await versionAddPage.navigate(release);
	});

	it('should add a new version to an existing release', async () => {
		const fileName = 'blank.vpt';
		await versionAddPage.uploadFile(fileName);
		await versionAddPage.setNewVersion('2.0.0');
		await versionAddPage.setFlavor(fileName, 0, 1); // orientation: fullscreen
		await versionAddPage.setFlavor(fileName, 1, 1); // lighting: day
		await versionAddPage.setCompatibility(fileName, 0, 0);
		await versionAddPage.uploadPlayfield(fileName,'playfield-1080x1920.png');
		await versionAddPage.submit();

		const modal = await appPage.getErrorInfoModal();
		expect(await modal.title.getText()).toEqual('SUCCESS!');
		expect(await modal.subtitle.getText()).toContain(release.game.title.toUpperCase());
		expect(await modal.subtitle.getText()).toContain(release.name.toUpperCase());
		expect(await modal.message.getText()).toContain('Successfully uploaded new release version');
		expect(await browser.getCurrentUrl()).toContain(browser.baseUrl + '/games/' + release.game.id + '/releases/' + release.id);
		await modal.close();
		await versionAddPage.navigate(release);
	});

});
