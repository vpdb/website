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

export default class UserMergeModalCtrl {

	/**
	 * @param $state
	 * @param $uibModalInstance
	 * @param $localStorage
	 * @param data
	 * @ngInject
	 */
	constructor($state, $uibModalInstance, $localStorage, $window, ConfigService, Config, data) {
		this.$state = $state;
		this.$uibModalInstance = $uibModalInstance;
		this.$localStorage = $localStorage;
		this.$window = $window;
		this.ConfigService = ConfigService;
		this.data = data;
		this.selectedUser = null;

		this.users = data.users.map(user => {
			user.providerData = user.providers.map(provider => {
				switch (provider) {
					case 'local':
						return { icon: 'vpdb-o', label: 'Local account' };
					case 'github':
						return { icon: 'github', label: 'GitHub' };
					case 'google':
						return { icon: 'google', label: 'Google' };
					default: {
						const ips = Config.authProviders.ipboard.filter(i => i.id === provider);
						return ips.length
							? { icon: ips[0].icon, label: ips[0].name }
							: { icon: 'question-circle', label: 'Unknown Provider' };
					}
				}
			});
			return user;
		});
	}

	selectUser(user) {
		if (this.selectedUser && this.selectedUser.id === user.id) {
			this.selectedUser = null;
		} else {
			this.selectedUser = user;
		}
	}

	abort() {
		this.$state.go('home');
		this.$uibModalInstance.dismiss();
	}

	merge() {
		this.$localStorage.mergeUserId = this.selectedUser.id;
		this.$window.location.href = this.ConfigService.apiUri('/v1/redirect/' + this.$state.params.strategy);
	}
}
