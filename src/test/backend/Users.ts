import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { User } from './models/user';
import { VpdbConfig } from './models/VpdbConfig';
import { root, users } from '../../config/testusers';

export class Users {

	static users:User[] = [];
	private api: AxiosInstance;

	constructor(vpdb:VpdbConfig) {
		this.api = axios.create({
			baseURL: vpdb.apiUri.protocol + '://' + vpdb.apiUri.hostname + ':' + vpdb.apiUri.port + vpdb.apiUri.pathname
		});
	}

	createUsers(rootUser: User, otherUsers: User[]): Promise<User[]> {
		return this.authenticateOrCreateUser(rootUser).then(rootUser => {
			return Promise.all(otherUsers.map(user => this.authenticateOrCreateUser(user, rootUser))).then(users => {
				return [ rootUser, ...users ];
			});
		});
	}

	authenticateOrCreateUser(user: User, creator: User = null): Promise<User> {
		return this.authenticateUser(user).then(authenticatedUser => {
			if (authenticatedUser === null) {
				return this.createUser(user, creator).then(createdUser => this.authenticateUser(createdUser));
			}
			return authenticatedUser;
		});
	}

	authenticateUser(user: User): Promise<User> {
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

	createUser(user: User, creator: User = null): Promise<User> {

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
				return this.updateUser(user, creator);
			}
			return createdUser;

		}, err => {
			throw new Error('Error creating user: ' + JSON.stringify(err.response.data));
		});
	}

	updateUser(user: User, creator: User): Promise<User> {
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
	}

	static getConfig(): AxiosRequestConfig {
		return {
			headers: { 'Content-Type': 'application/json' }
		}
	}

	static readUser(response: AxiosResponse, user: User): User {
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

	getAuthenticatedUser(username:string):Promise<User> {
		const authenticated = Users.users.filter(u => u.username === username);
		if (authenticated.length == 1) {
			return Promise.resolve(authenticated[0]);
		}
		return this.authenticateUser(users.filter(u => u.username === username)[0]);
	}
}

