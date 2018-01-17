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
import { Game } from '../../test/models/Game';
import { Release } from '../../test/models/Release';
import { Games } from '../../test/backend/Games';
import { Releases } from '../../test/backend/Releases';
import { ReleaseDetailsPage } from './release.details.page';

describe('View details of a release', () => {

	const appPage = new AppPage();
	const releaseDetailsPage = new ReleaseDetailsPage();
	const games: Games = new Games(browser.params.vpdb);
	const releases: Releases = new Releases(browser.params.vpdb);
	let game: Game;

	beforeAll(() => {
		console.log('creating game...');
		return games.createGame().then(g => game = g);
	});

	afterEach(() => {
		browser.executeScript('window.scrollTo(0,0);');
	});

	describe('as an owner', () => {

		const user = 'member';
		let pendingRelease:Release;
		let approvedRelease:Release;

		beforeAll(() => {
			return releases.createRelease(user, null, game)
				.then((release:Release) => {
					pendingRelease = release;
					return releases.createRelease(user, null, game)
				}).then((release:Release) => {
					approvedRelease = release;
					return releases.approveRelease('moderator', approvedRelease);
				}).then(() => {
					appPage.get();
					appPage.loginAs(user);
				})
		});

		afterAll(() => {
			appPage.logout();
		});

		fit('should show the author zone but not the moderation zone', () => {
			releaseDetailsPage.get(approvedRelease);
			expect(releaseDetailsPage.hasAdminZone()).toBeTruthy();
			expect(releaseDetailsPage.hasModerationZone()).toBeFalsy();
		});

		//it('should show the moderation zone');
		//it('should toggle the moderation zone')
	});

});
