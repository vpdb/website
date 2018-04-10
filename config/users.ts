import { User } from '../src/test/models/User';

// these are the test users.
export const root: User = {
	username: 'root',
	password: 'cVVQr53f5TCZtHcR',
	email: 'root@vpdb.io'
};

export const users: User[] = [
	{
		username: 'admin',
		password: 'vaDwjPf2pP7RwWx6',
		roles: [ 'member', 'admin' ],
		email: 'admin@vpdb.io'
	}, {
		username: 'moderator',
		password: 'dHt5sI9YqVBF32AM',
		roles: [ 'member', 'moderator' ],
		email: 'moderator@vpdb.io'
	}, {
		username: 'contributor',
		password: 'qm5LKQjZEQMrjhmp',
		roles: [ 'member', 'contributor' ],
		email: 'contributor@vpdb.io'
	}, {
		username: 'member',
		password: 'x8gWyTrUhcCq9JHV',
		email: 'member@vpdb.io'
	}
];
