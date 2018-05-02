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

export default class TokenCreateAdminModalCtrl {

	/**
	 * @param $uibModalInstance
	 * @param {ApiHelper} ApiHelper
	 * @param {AuthService} AuthService
	 * @param TokenResource
	 * @param token If set, update instead of create
	 * @ngInject
	 */
	constructor($uibModalInstance, ApiHelper, AuthService, TokenResource, token) {

		this.$uibModalInstance = $uibModalInstance;
		this.ApiHelper = ApiHelper;
		this.TokenResource = TokenResource;

		this.token = token || { type: 'provider', scopes: [ 'service' ] };
		this.scopes = [
			{ id: 'community', name: 'Community', description: 'Rate, star, comment, basically anything visible on the site.' },
			{ id: 'create', name: 'Create', description: 'All kind of uploads.' },
			{ id: 'storage', name: 'Download', description: 'Download access.' },
			{ id: 'service', name: 'Service', description: 'Create users under given OAuth provider.' },
		];
		this.providers = AuthService.getProviders();
	}

	toggleScope(scopeName) {
		const idx = this.token.scopes.indexOf(scopeName);
		// is currently selected
		if (idx > -1) {
			this.token.scopes.splice(idx, 1);
		}
		// is newly selected
		else {
			this.token.scopes.push(scopeName);
		}
	}

	save() {
		this.TokenResource.update({ id: this.token.id }, this.token, token => {
			this.$uibModalInstance.close(token);
		}, this.ApiHelper.handleErrors(this, (scope, response) => {
			if (/password/i.test(response.data.error)) {
				scope.errors.password = response.data.error;
			}
		}));
	}


	create() {
		this.TokenResource.save(this.token, token => {
			this.$uibModalInstance.close(token);

		}, this.ApiHelper.handleErrors(this, (scope, response) => {
			if (/password/i.test(response.data.error)) {
				scope.errors.password = response.data.error;
			}
		}));
	}
}
