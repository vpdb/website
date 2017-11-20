import { browser, Config } from 'protractor';
import { SpecReporter } from 'jasmine-spec-reporter';
import { User, UserHelper } from '../src/test/UserHelper';


export let config: Config = {
	framework: 'jasmine',
	capabilities: {
		browserName: 'chrome'
	},
	specs: [ '../**/*.spec.js' ],
	seleniumAddress: 'http://localhost:4444/wd/hub',
	params: {
		url: 'http://localhost:3333'
	},
	onPrepare: () => {

		// setup reporter
		jasmine.getEnv().addReporter(new SpecReporter());

		// setup chrome throttling
		// browser.driver.setNetworkConditions({
		// 	offline: false,
		// 	latency: 5, // Additional latency (ms).
		// 	download_throughput: 500 * 1024, // Maximal aggregated download throughput.
		// 	upload_throughput: 500 * 1024 // Maximal aggregated upload throughput.
		// });


		// register users
		console.log('Creating users...');
		const rootUser:User = { username: 'root', password: 'cVVQr53f5TCZtHcR', email: 'root@vpdb.io' };
		const users:User[] = [
			{ username: 'admin', password: 'vaDwjPf2pP7RwWx6', roles: [ 'member', 'admin' ], email: 'admin@vpdb.io' },
			{ username: 'contributor', password: 'qm5LKQjZEQMrjhmp', roles: [ 'member', 'contributor' ], email: 'contributor@vpdb.io' },
			{ username: 'member', password: 'x8gWyTrUhcCq9JHV', email: 'member@vpdb.io' },
		];
		const userHelper = new UserHelper();
		return userHelper.createUsers('http://localhost:7357/api', rootUser, users).then(users => {
			browser.users = {};
			users.forEach((user:User) => {
				browser.users[user.username] = user;
			});
			console.log('Global users are:', browser.users);
		});
	}
};

