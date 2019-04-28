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

export default class ProfileContentCtrl {

	/**
	 * @param $state
	 * @param {GameResource} GameResource
	 * @param {ReleaseResource} ReleaseResource
	 * @ngInject
	 */
	constructor($state, GameResource, ReleaseResource) {
		this.$state = $state;
		this.games = GameResource.query({ show_mine_only: 1, sort: 'created_at', per_page: 100 });
		this.releases = ReleaseResource.query({ show_mine_only: 1, sort: 'released_at', per_page: 100, fields: 'moderation' });
	}

	gotoGame(game) {
		this.$state.go('gameDetails', { id: game.id });
	}

	gotoRelease(release) {
		this.$state.go('releaseDetails', { id: release.game.id, releaseId: release.id });
	}

	getModerationStatus(moderation) {
		if (moderation.auto_approved) {
			return 'auto-approved';
		}
		if (moderation.is_approved) {
			return 'approved';
		}
		if (moderation.is_refused) {
			return 'refused';
		}
		return 'pending';
	}
}

