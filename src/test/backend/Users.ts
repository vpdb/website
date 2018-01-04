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

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { User } from '../models/User';
import { VpdbConfig } from '../models/VpdbConfig';
import { root, users } from '../../../config/users';

export class Users {

	static users:User[] = [];
	private api: AxiosInstance;

	constructor(vpdb:VpdbConfig) {
		this.api = axios.create({
			baseURL: vpdb.apiUri.protocol + '://' + vpdb.apiUri.hostname + ':' + vpdb.apiUri.port + vpdb.apiUri.pathname
		});
	}

	/**
	 * Creates all pre-defined users.
	 * @param {User} rootUser Root user, i.e. first created user
	 * @param {User[]} otherUsers Other users to create
	 * @returns {Promise<User[]>} Created users
	 */
	createUsers(rootUser: User, otherUsers: User[]): Promise<User[]> {
		return this.authenticateOrCreateUser(rootUser).then(rootUser => {
			return Promise.all(otherUsers.map(user => this.authenticateOrCreateUser(user, rootUser))).then(users => {
				return [ rootUser, ...users ];
			});
		});
	}

	/**
	 * Returns a pre-defined user with a valid token.
	 * @param {string} username Username
	 * @returns {Promise<User>} Authenticated user
	 */
	getAuthenticatedUser(username:string):Promise<User> {
		const authenticated = Users.users.filter(u => u.username === username);
		if (authenticated.length === 1) {
			return Promise.resolve(authenticated[0]);
		}
		return this.authenticateUser(users.filter(u => u.username === username)[0]);
	}

	/**
	 * Authenticates a user or creates and authenticates a user if it doesn't exist.
	 *
	 * @param {User | string} usernameOrUser If string provided, email and password are generated.
	 * @param {User} creator User with which the new user should be created.
	 * @returns {Promise<User>} Authenticated user
	 */
	authenticateOrCreateUser(usernameOrUser: User|string, creator: User = null): Promise<User> {
		const user:User = typeof usernameOrUser === 'string' ? Users.generateUser(usernameOrUser) : usernameOrUser;
		return this.authenticateUser(user).then(authenticatedUser => {
			if (authenticatedUser === null) {
				return this.createUser(user, creator).then(createdUser => this.authenticateUser(createdUser));
			}
			return authenticatedUser;
		});
	}

	/**
	 * Authenticates a user.
	 * @param {User} user User to authenticate
	 * @returns {Promise<User>} Authenticated user
	 */
	private authenticateUser(user: User): Promise<User> {
		return this.api.post('/v1/authenticate', {
			username: user.username,
			password: user.password

		}, Users.getConfig()).then(response => {
			if (response.status !== 200) {
				throw new Error('Error authenticating user (' + response.status + '): ' + JSON.stringify(response.data));
			}
			const authenticatedUser = Users.readUser(response, user);
			if (Users.users.filter(u => u.username === user.username).length === 0) {
				Users.users.push(authenticatedUser);
			}
			return authenticatedUser;
		}, err => {
			if (err.response && err.response.status === 401) {
				return null;
			}
			throw new Error('Error authenticating user: ' + JSON.stringify(err.response ? err.response.data : null));
		});
	}

	/**
	 * Creates a user.
	 * @param {User} user User to create
	 * @param {User} creator User with which the new user should be created.
	 * @returns {Promise<User>} Created user
	 */
	private createUser(user: User, creator: User = null): Promise<User> {

		let config = Users.getConfig();
		if (creator) {
			config.headers.Authorization = 'Bearer ' + creator.token;
		}
		return this.api.post('/v1/users', user, config).then(response => {
			if (response.status !== 201) {
				throw new Error('Error creating user (' + response.status + '): ' + JSON.stringify(response.data));
			}
			const createdUser: User = Users.readUser(response, user);
			if (user.roles) {
				user.id = createdUser.id;
				user.name = createdUser.name;
				user._plan = createdUser._plan;
				return this.updateUser(user);
			}
			return createdUser;

		}, err => {
			throw new Error('Error creating user: ' + JSON.stringify(err.response.data));
		});
	}

	/**
	 * Creates a user with the given username.
	 * @param {string} username
	 * @param roles User roles, default: 'member'.
	 */
	private static generateUser(username:string, roles:string[] = [ 'member' ]): User {

		// check if pre-defined
		const predefined = Users.users.filter(u => u.username === username);
		if (predefined.length === 1) {
			return predefined[0];
		}

		const crypto = require('crypto');
		const secret = 'username';
		const password = crypto.createHmac('sha256', secret).digest('base64').substring(0, 10);
		return {
			username: username,
			password: password,
			roles: roles,
			email: username + '@vpdb.io'
		}
	}

	/**
	 * Updates the user, typically to add roles.
	 * @param {User} user User to update
	 * @returns {Promise<User>} Updated user
	 */
	private updateUser(user: User): Promise<User> {
		return this.authenticateUser(root).then(creator => {
			let config = Users.getConfig();
			config.headers.Authorization = 'Bearer ' + creator.token;
			const userToUpdate: User = JSON.parse(JSON.stringify(user));
			delete userToUpdate.password;
			userToUpdate.is_active = true;
			return this.api.put('/v1/users/' + user.id, userToUpdate, config).then(response => {
				if (response.status !== 200) {
					throw new Error('Error updating user (' + response.status + '): ' + JSON.stringify(response.data));
				}
				return Users.readUser(response, user);

			}, err => {
				throw new Error('Error updating user: ' + JSON.stringify(err.response.data));
			});
		});
	}

	private static getConfig(): AxiosRequestConfig {
		return {
			headers: { 'Content-Type': 'application/json' }
		}
	}

	private static readUser(response: AxiosResponse, user: User): User {
		let u, token;
		if (response.data.token) {
			token = response.data.token;
			u = response.data.user;
		} else {
			token = user.token;
			u = response.data;
		}
		return {
			id: u.id,
			username: u.username,
			password: user.password,
			roles: u.roles,
			email: u.email,
			name: u.name,
			_plan: u.plan.id,
			token: token
		}
	}
}

