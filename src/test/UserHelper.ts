import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

export class UserHelper {

	createUsers(baseUrl: string) : Promise<User[]> {
		const rootUser:User = { username: 'root', password: 'cVVQr53f5TCZtHcR', email: 'root@vpdb.io' };
		const users:User[] = [
			{ username: 'admin', password: 'vaDwjPf2pP7RwWx6', roles: [ 'member', 'admin' ], email: 'admin@vpdb.io' },
			{ username: 'contributor', password: 'qm5LKQjZEQMrjhmp', roles: [ 'member', 'contributor' ], email: 'contributor@vpdb.io' },
			{ username: 'member', password: 'x8gWyTrUhcCq9JHV', email: 'member@vpdb.io' },
		];
		return this.authenticateOrCreateUser(baseUrl, rootUser).then(rootUser => {
			return Promise.all(users.map(user => this.authenticateOrCreateUser(baseUrl, user, rootUser))).then(users => {
				return [ rootUser, ...users];
			});
		});
	}

	authenticateOrCreateUser(baseUrl: string, user:User, creator:User = null) : Promise<User> {
		return this.authenticateUser(baseUrl, user).then(authenticatedUser => {
			if (authenticatedUser === null) {
				return this.createUser(baseUrl, user, creator).then(createdUser => this.authenticateUser(baseUrl, createdUser));
			}
			return authenticatedUser;
		});
	}

	authenticateUser(baseUrl: string, user:User): Promise<User> {
		return axios.post(baseUrl + '/v1/authenticate', {
			username: user.username,
			password: user.password

		}, UserHelper.getConfig()).then(response => {
			if (response.status !== 200) {
				throw new Error('Error authenticating user (' + response.status + '): ' + JSON.stringify(response.data));
			}
			return UserHelper.getUser(response, user);
		}, err => {
			if (err.response.status === 401) {
				return null;
			}
			throw new Error('Error authenticating user: ' + JSON.stringify(err.response.data));
		});
	}

	createUser(baseUrl: string, user:User, creator:User = null): Promise<User> {

		let config = UserHelper.getConfig();
		if (creator) {
			config.headers.Authorization = 'Bearer ' + creator.token;
		}
		return axios.post(baseUrl + '/v1/users', user, config).then(response => {
			if (response.status !== 201) {
				throw new Error('Error creating user (' + response.status + '): ' + JSON.stringify(response.data));
			}
			const createdUser:User = UserHelper.getUser(response, user);
			if (user.roles) {
				user.id = createdUser.id;
				user.name = createdUser.name;
				user._plan = createdUser._plan;
				return this.updateUser(baseUrl, user, creator);
			}
			return createdUser;

		}, err => {
			throw new Error('Error creating user: ' + JSON.stringify(err.response.data));
		});
	}

	updateUser(baseUrl:string, user:User, creator:User): Promise<User> {
		let config = UserHelper.getConfig();
		config.headers.Authorization = 'Bearer ' + creator.token;
		const userToUpdate:User = JSON.parse(JSON.stringify(user));
		delete userToUpdate.password;
		userToUpdate.is_active = true;
		return axios.put(baseUrl + '/v1/users/' + user.id, userToUpdate, config).then(response => {
			if (response.status !== 200) {
				throw new Error('Error updating user (' + response.status + '): ' + JSON.stringify(response.data));
			}
			return UserHelper.getUser(response, user);

		}, err => {
			throw new Error('Error updating user: ' + JSON.stringify(err.response.data));
		});
	}

	static getConfig(): AxiosRequestConfig {
		return {
			headers: { 'Content-Type': 'application/json' }
		}
	}

	static getUser(response:AxiosResponse, user:User) : User {
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

interface User {
	id?: string,
	username: string,
	password: string,
	name?:string,
	roles?:string[],
	email?: string,
	token?: string,
	_plan?: string
	is_active?: boolean
}