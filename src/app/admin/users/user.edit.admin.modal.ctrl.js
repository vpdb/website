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

import { cloneDeep, pick } from 'lodash';

export default class UserEditAdminModalCtrl {

	/**
	 * @param $uibModalInstance
	 * @param {App} App
	 * @param {AuthService} AuthService
	 * @param {ApiHelper} ApiHelper
	 * @param UserResource
	 * @param UserConfirmationResource
	 * @param PlanResource
	 * @param user
	 * @param roles
	 * @ngInject
	 */
	constructor($uibModalInstance, App, AuthService, ApiHelper,
				UserResource, UserConfirmationResource, PlanResource, user, roles) {

		this.$uibModalInstance = $uibModalInstance;
		this.App = App;
		this.AuthService = AuthService;
		this.ApiHelper = ApiHelper;
		this.UserResource = UserResource;
		this.UserConfirmationResource = UserConfirmationResource;
		this.roles = roles;

		this.fields = [ 'id', 'name', 'email', 'username', 'is_active', 'roles', '_plan' ];

		this.originalUser = user;
		this.originalName = user.name;
		this.roles = roles;

		this.reset();

		this.plans = PlanResource.query();
	}

	toggleSelection(roleName) {
		const idx = this.user.roles.indexOf(roleName);
		// is currently selected
		if (idx > -1) {
			this.user.roles.splice(idx, 1);
		}
		// is newly selected
		else {
			this.user.roles.push(roleName);
		}
	}

	save() {
		const updatedUser = this.UserResource.update({ userid: this.user.id }, this.user, () => {
			this.user = cloneDeep(updatedUser);
			if (this.AuthService.user.id === this.user.id) {
				this.AuthService.user = updatedUser;
			}
			this.$uibModalInstance.close();
		}, this.ApiHelper.handleErrors(this));
	}

	sendConfirmation() {
		this.UserConfirmationResource.send({ userId: this.user.id }, {}, () => {
			this.App.showNotification('Notification mail sent.');

		}, this.ApiHelper.handleErrors(this));
	}

	reset() {
		const user = cloneDeep(this.originalUser);
		this.user = pick(user, this.fields);
		this.user._plan = user.plan.id;
	}
}
