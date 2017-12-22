import { User } from '../src/test/models/User';

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