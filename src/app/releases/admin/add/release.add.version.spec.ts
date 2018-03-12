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
import { Releases } from '../../../../test/backend/Releases';
import { Release } from '../../../../test/models/Release';
import { AppPage } from '../../../app.page';
import { ReleaseAddVersionPage } from './release.add.version.page';

describe('Add new version to release', () => {

	const appPage = new AppPage();
	const versionAddPage = new ReleaseAddVersionPage();
	const releases:Releases = new Releases(browser.params.vpdb);
	let release:Release;

	beforeAll(() => {
		return releases.createRelease('member', { versions: [ { version: '1.0.0' } ] }).then((createdRelease:Release) => {
			release = createdRelease;
			versionAddPage.get(release);
		});
	});

	afterEach(() => {
		browser.executeScript('window.scrollTo(0,0);');
	});

	afterAll(() => {
		appPage.logout();
	});

	it('should display validation errors when no file uploaded', () => {
		versionAddPage.submit();
		expect(versionAddPage.hasFileUploadValidationError()).toBe(true);
		versionAddPage.reset();
	});

	it('should display validation errors when a file is uploaded.', () => {
		const fileName = 'blank.vpt';
		versionAddPage.uploadFile(fileName);
		versionAddPage.submit();
		expect(versionAddPage.hasFlavorValidationError(fileName)).toBe(true);
		expect(versionAddPage.hasCompatibilityValidationError(fileName)).toBe(true);
		expect(versionAddPage.hasPlayfieldImageValidationError(fileName)).toBe(true);
		versionAddPage.reset();
	});

	it('should add a new file to an existing version', () => {
		const fileName = 'blank.vpt';
		versionAddPage.uploadFile(fileName);
		versionAddPage.setExistingVersion('1.0.0');
		versionAddPage.setFlavor(fileName, 0, 0); // orientation: desktop
		versionAddPage.setFlavor(fileName, 1, 1); // lighting: day
		versionAddPage.setCompatibility(fileName, 0, 0);
		versionAddPage.uploadPlayfield(fileName,'playfield-1920x1080.png');
		versionAddPage.submit();

		const modal = appPage.getErrorInfoModal();
		expect(modal.title.getText()).toEqual('SUCCESS!');
		expect(modal.subtitle.getText()).toContain(release.game.title.toUpperCase());
		expect(modal.subtitle.getText()).toContain(release.name.toUpperCase());
		expect(modal.message.getText()).toContain('Successfully uploaded new files to version');
		expect(browser.getCurrentUrl()).toContain(browser.baseUrl + '/games/' + release.game.id + '/releases/' + release.id);
		modal.close();
		versionAddPage.navigate(release);
	});

	it('should add a new version to an existing release', () => {
		const fileName = 'blank.vpt';
		versionAddPage.uploadFile(fileName);
		versionAddPage.setNewVersion('2.0.0');
		versionAddPage.setFlavor(fileName, 0, 1); // orientation: fullscreen
		versionAddPage.setFlavor(fileName, 1, 1); // lighting: day
		versionAddPage.setCompatibility(fileName, 0, 0);
		versionAddPage.uploadPlayfield(fileName,'playfield-1080x1920.png');
		versionAddPage.submit();

		const modal = appPage.getErrorInfoModal();
		expect(modal.title.getText()).toEqual('SUCCESS!');
		expect(modal.subtitle.getText()).toContain(release.game.title.toUpperCase());
		expect(modal.subtitle.getText()).toContain(release.name.toUpperCase());
		expect(modal.message.getText()).toContain('Successfully uploaded new release version');
		expect(browser.getCurrentUrl()).toContain(browser.baseUrl + '/games/' + release.game.id + '/releases/' + release.id);
		modal.close();
		versionAddPage.navigate(release);
	});



});
