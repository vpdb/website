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

export default class ReleaseCommentCtrl {

	/**
	 * Class constructor
	 * @param {AuthService} AuthService
	 * @param {ApiHelper} ApiHelper
	 * @param {CommentResource} CommentResource
	 * @ngInject
	 */
	constructor(AuthService, ApiHelper, CommentResource) {
		this.AuthService = AuthService;
		this.ApiHelper = ApiHelper;
		this.CommentResource = CommentResource;

		// set in the dom via component
		this.comment = null;
		this.release = null;
		this.menuMoveTo = '';
		this.onMoved = () => {};
	}

	moveComment(commentId, refName, refId) {
		this.CommentResource.update({ id: commentId }, { _ref: { [refName]: refId }}, () => {
			this.onMoved();
		}, this.ApiHelper.handleErrors(this));
	}
}
