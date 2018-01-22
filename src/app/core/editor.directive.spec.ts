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

import { browser, by, element } from 'protractor';
import { Releases } from '../../test/backend/Releases';
import { Release } from '../../test/models/Release';
import { AppPage } from '../app.page';
import { ReleaseDetailsPage } from '../releases/release.details.page';
import { EditorDirectivePage } from './editor.directive.page';

describe('Editor', () => {

	const appPage = new AppPage();
	const releaseDetailsPage = new ReleaseDetailsPage();
	const releases: Releases = new Releases(browser.params.vpdb);

	const editor = new EditorDirectivePage(element(by.id('new-comment-editor')));

	beforeAll(() => {
		let release:Release;
		return releases.createRelease('EditorReleaseAuthor')
			.then(r =>  {
				release = r;
				return releases.approveRelease('moderator', release);
			}).then(() => releaseDetailsPage.get(release, 'member'));
	});

	afterEach(() => {
		editor.toggleEdit();
		editor.clear();
	});

	afterAll(() => {
		appPage.logout();
	});

	it('should render text in the preview pane', () => {
		const content = 'This is a sentence.';
		editor.setText(content);
		editor.togglePreview();
		expect(editor.getPreview()).toContain(content);
	});

});
