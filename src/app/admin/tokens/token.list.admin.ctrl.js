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

import TokenCreateAdminModalTpl from './token.create.admin.modal.pug';

export default class TokenListAdminCtrl {

	/**
	 * @param $scope
	 * @param $uibModal
	 * @param {App} App
	 * @param {AuthService} AuthService
	 * @param {ApiHelper} ApiHelper
	 * @param {ModalService} ModalService
	 * @param {TrackerService} TrackerService
	 * @param TokenResource
	 * @ngInject
	 */
	constructor($scope, $uibModal, TrackerService, App, AuthService, ApiHelper, ModalService, TokenResource) {

		App.theme('light');
		App.setTitle('Tokens');
		App.setMenu('admin');

		this.$scope = $scope;
		this.$uibModal = $uibModal;
		this.App = App;
		this.ApiHelper = ApiHelper;
		this.ModalService = ModalService;
		this.TokenResource = TokenResource;
		TrackerService.trackPage();

		this.providers = AuthService.getProviders();
		this.TokenResource.query({ type: 'application' }, tokens => {
			this.tokens = tokens.map(token => this.addDisplayData(token));
		});
	}

	createToken() {
		this.$uibModal.open({
			templateUrl: TokenCreateAdminModalTpl,
			controller: 'TokenCreateAdminModalCtrl',
			controllerAs: 'vm',
			resolve: { token: () => null }

		}).result.then(token => {
			this.tokens.unshift(this.addDisplayData(token));
			this.hasAppTokens = true;
			this.showTokenAlert = true;
		});
	}

	editToken(token) {
		this.$uibModal.open({
			templateUrl: TokenCreateAdminModalTpl,
			controller: 'TokenCreateAdminModalCtrl',
			controllerAs: 'vm',
			resolve: { token: () => token }

		}).result.then(updatedToken => {
			token = Object.assign(token, this.addDisplayData(updatedToken));
		});
	}

	toggleToken(token) {
		this.TokenResource.update({ id: token.id }, { is_active: !token.is_active }, () => {
			token.is_active = !token.is_active;
		}, this.ApiHelper.handleErrorsInDialog('Error toggling token.'));
	}

	deleteToken(token) {
		return this.ModalService.question({
			title: 'Delete application token',
			message: 'The application using this token will no longer be able to access the VPDB API. You cannot undo this action.',
			question: 'Are you sure you want to delete this token?'
		}).result.then(() => {
			this.TokenResource.delete({ id: token.id }, () => {
				this.tokens.splice(this.tokens.indexOf(token), 1);
				this.hasAppTokens = this.tokens.filter(token => token.scopes.includes('all')).length > 0;
				this.App.showNotification('Token successfully deleted.');

			}, this.ApiHelper.handleErrorsInDialog('Error deleting token.'));
		}, console.error);
	}

	addDisplayData(token) {
		const provider = this.providers.filter(p => p.id === token.provider)[0];
		token.icon = provider.icon;
		token.providerName = provider.name;
		token.scopeNames = token.scopes.join(', ');
		return token;
	}
}