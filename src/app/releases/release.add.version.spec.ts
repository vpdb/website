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
import { company } from 'faker';
import { Games } from '../../test/backend/Games';
import { Releases } from '../../test/backend/Releases';
import { Users } from '../../test/backend/Users';
import { Game } from '../../test/models/Game';
import { Release } from '../../test/models/Release';
import { AppPage } from '../app.page';
import { ReleaseAddVersionPage } from './release.add.version.page';
import { AuthorSelectModalPage } from '../users/author.select.modal.page';
import { Bootstrap } from "../../test/Bootstrap";

describe('Add new version to release', () => {

	const appPage = new AppPage();
	const versionAddPage = new ReleaseAddVersionPage();
	const games:Games = new Games(browser.params.vpdb);
	const users:Users = new Users(browser.params.vpdb);
	const releases:Releases = new Releases(browser.params.vpdb);
	let release:Release;

	beforeAll(() => {
		return releases.createRelease('member').then((createdRelease:Release) => {
			release = createdRelease;
			versionAddPage.get(release)
		});
	});

	afterEach(() => {
		browser.executeScript('window.scrollTo(0,0);');
	});

	afterAll(() => {
		//appPage.logout();
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

	// it('should be able to add a minimal release', () => {
	// 	const fileName = 'blank.vpt';
	// 	releaseAddPage.uploadFile(fileName);
	// 	releaseAddPage.generateReleaseName();
	// 	releaseAddPage.setFlavor(fileName, 0, 0); // orientation: desktop
	// 	releaseAddPage.setFlavor(fileName, 1, 1); // lighting: day
	// 	releaseAddPage.setVersion('v1.0.0');
	// 	releaseAddPage.setModPermission(1);
	// 	releaseAddPage.setCompatibility(fileName, 0, 0);
	// 	releaseAddPage.setCompatibility(fileName, 0, 1);
	// 	releaseAddPage.uploadPlayfield(fileName,'playfield-1920x1080.png');
	// 	releaseAddPage.submit();
	//
	// 	const modal = appPage.getErrorInfoModal();
	// 	expect(modal.title.getText()).toEqual('RELEASE CREATED!');
	// 	expect(modal.subtitle.getText()).toEqual(game.title.toUpperCase());
	// 	expect(modal.message.getText()).toContain('The release has been successfully created.');
	// 	expect(modal.message.getText()).toContain('You will be notified');
	// 	expect(browser.getCurrentUrl()).toContain(browser.baseUrl + '/games/' + game.id + '/releases/');
	// 	modal.close();
	// 	releaseAddPage.navigate(game);
	// });

});
