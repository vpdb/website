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
import { AppPage } from '../../app.page';
import { Release } from '../../../test/models/Release';
import { Games } from '../../../test/backend/Games';
import { Releases } from '../../../test/backend/Releases';
import { ReleaseDetailsPage } from './release.details.page';

describe('View details of a release', () => {

	// todo: starring, rating, commenting, downloading. fix empty version history.

	const user = 'member';
	let pendingRelease:Release;
	let approvedRelease:Release;

	const appPage = new AppPage();
	const releaseDetailsPage = new ReleaseDetailsPage();
	const games: Games = new Games(browser.params.vpdb);
	const releases: Releases = new Releases(browser.params.vpdb);

	beforeAll(async () => {

		const game = await games.createGame();
		pendingRelease = await releases.createRelease(user, null, game, 'release-details');
		approvedRelease = await releases.createRelease(user, null, game);
		await releases.approveRelease('moderator', approvedRelease);
	});

	afterEach(async () => {
		await browser.executeScript('window.scrollTo(0,0);');
	});

	describe('as anonymous', () => {

		it('should show a 404 page for a pending release', async () => {
			await releaseDetailsPage.get(pendingRelease);
			expect(await releaseDetailsPage.doesExist()).toBeFalsy();
		});

		it('should show an approved release', async () => {
			await releaseDetailsPage.get(approvedRelease);
			expect(await releaseDetailsPage.doesExist()).toBeTruthy();
			expect(await releaseDetailsPage.hasNewCommentForm()).toBeFalsy();
		});

		it('should toggle between file names and flavors', async () => {
			await releaseDetailsPage.get(approvedRelease);
			expect(await releaseDetailsPage.hasFilenamesToggled()).toBeFalsy();
			await releaseDetailsPage.toggleFilenames();
			expect(await releaseDetailsPage.hasFilenamesToggled()).toBeTruthy();
			await releaseDetailsPage.toggleFilenames();
		});

	});

	describe('as an author', () => {

		beforeAll(async () => {
			await appPage.get();
			await appPage.loginAs(user);
		});

		afterAll(async () => {
			await appPage.logout();
		});

		describe('for an approved release', () => {

			beforeAll(async () => {
				await releaseDetailsPage.get(approvedRelease);
			});

			it('should show the new comment form', async () => {
				expect(await releaseDetailsPage.hasNewCommentForm()).toBeTruthy();
			});

			it('should show the author zone but not the moderation zone', async () => {
				expect(await releaseDetailsPage.hasAdminZone()).toBeTruthy();
				expect(await releaseDetailsPage.hasModerationZone()).toBeFalsy();
			});

			it('should toggle the moderation zone', async () => {
				expect(await releaseDetailsPage.hasModerationZoneToggle()).toBeTruthy();
				await releaseDetailsPage.toggleModerationZone();
				expect(await releaseDetailsPage.hasModerationZone()).toBeTruthy();
				await releaseDetailsPage.toggleModerationZone();
				expect(await releaseDetailsPage.hasModerationZone()).toBeFalsy();
			});

		});

		describe('for a pending release', () => {

			beforeAll(async () => {
				await releaseDetailsPage.get(pendingRelease);
			});

			it('should not show the new comment form', async () => {
				expect(await releaseDetailsPage.hasNewCommentForm()).toBeFalsy();
			});


			it('should show the moderation zone', async () => {
				expect(await releaseDetailsPage.hasAdminZone()).toBeTruthy();
				expect(await releaseDetailsPage.hasModerationZone()).toBeTruthy();
				expect(await releaseDetailsPage.hasModerationZoneToggle()).toBeFalsy();
			});
		});
	});
});
