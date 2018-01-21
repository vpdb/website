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
import { Games } from '../../test/backend/Games';
import { Releases } from '../../test/backend/Releases';
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

	beforeAll(() => {
		return games.createGame().then(game => {
			return releases.createRelease(user, null, game, 'release-details');

		}).then((release:Release) => {
			pendingRelease = release;
			return releases.createRelease(user, null, release.game)

		}).then((release:Release) => {
			approvedRelease = release;
			return releases.approveRelease('moderator', approvedRelease);
		});
	});

	afterEach(() => {
		browser.executeScript('window.scrollTo(0,0);');
	});

	describe('as anonymous', () => {

		it('should show a 404 page for a pending release', () => {
			releaseDetailsPage.get(pendingRelease);
			expect(releaseDetailsPage.doesExist()).toBeFalsy();
		});

		it('should show an approved release', () => {
			releaseDetailsPage.get(approvedRelease);
			expect(releaseDetailsPage.doesExist()).toBeTruthy();
			expect(releaseDetailsPage.hasNewCommentForm()).toBeFalsy();
		});

		it('should toggle between file names and flavors', () => {
			releaseDetailsPage.get(approvedRelease);
			expect(releaseDetailsPage.hasFilenamesToggled()).toBeFalsy();
			releaseDetailsPage.toggleFilenames();
			expect(releaseDetailsPage.hasFilenamesToggled()).toBeTruthy();
			releaseDetailsPage.toggleFilenames();
		});

	});

	describe('as an author', () => {

		beforeAll(() => {
			appPage.get();
			appPage.loginAs(user);
		});

		afterAll(() => {
			appPage.logout();
		});

		describe('for an approved release', () => {

			beforeAll(() => {
				releaseDetailsPage.get(approvedRelease);
			});

			it('should show the new comment form', () => {
				expect(releaseDetailsPage.hasNewCommentForm()).toBeTruthy();
			});

			it('should show the author zone but not the moderation zone', () => {
				expect(releaseDetailsPage.hasAdminZone()).toBeTruthy();
				expect(releaseDetailsPage.hasModerationZone()).toBeFalsy();
			});

		});

		describe('for a pending release', () => {

			beforeAll(() => {
				releaseDetailsPage.get(pendingRelease);
			});

			it('should not show the new comment form', () => {
				expect(releaseDetailsPage.hasNewCommentForm()).toBeFalsy();
			});


			it('should show the moderation zone', () => {
				expect(releaseDetailsPage.hasAdminZone()).toBeTruthy();
				expect(releaseDetailsPage.hasModerationZone()).toBeTruthy();
				expect(releaseDetailsPage.hasModerationZoneToggle()).toBeFalsy();
			});

			it('should toggle the moderation zone', () => {
				expect(releaseDetailsPage.hasModerationZoneToggle()).toBeTruthy();
				releaseDetailsPage.toggleModerationZone();
				expect(releaseDetailsPage.hasModerationZone()).toBeTruthy();
				releaseDetailsPage.toggleModerationZone();
				expect(releaseDetailsPage.hasModerationZone()).toBeFalsy();
			});
		});

	});

});
