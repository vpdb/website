import { browser, Config } from 'protractor';
import { SpecReporter } from 'jasmine-spec-reporter';
import { User, UserHelper } from '../src/test/UserHelper';
import { FileDetector } from 'selenium-webdriver/remote';

const vpdbConfig = require('../../config/vpdb.' + (process.env.CONFIG || 'test') + '.json');
const webBaseUrl = vpdbConfig.webUri.protocol + '://' + vpdbConfig.webUri.hostname + ':' + vpdbConfig.webUri.port;
const apiBaseUrl = vpdbConfig.apiUri.protocol + '://' + vpdbConfig.apiUri.hostname + ':' + vpdbConfig.apiUri.port + vpdbConfig.apiUri.pathname;

export let config: Config = {
	framework: 'jasmine',
	capabilities: {
		browserName: 'chrome'
	},
	specs: [ '../**/*.spec.js' ],
	baseUrl: webBaseUrl,
	onPrepare: () => {

		// setup reporter
		jasmine.getEnv().addReporter(new SpecReporter());

		console.log('Setting file detector to remote.'); // https://www.browserstack.com/automate/node
		browser.setFileDetector(new FileDetector());

		// setup chrome throttling
		// browser.driver.setNetworkConditions({
		// 	offline: false,
		// 	latency: 5, // Additional latency (ms).
		// 	download_throughput: 500 * 1024, // Maximal aggregated download throughput.
		// 	upload_throughput: 500 * 1024 // Maximal aggregated upload throughput.
		// });

		console.log('Creating users before tests.');
		console.log('API URL for setup: %s', apiBaseUrl);
		console.log('Base URL for testing: %s', webBaseUrl);

		// register users
		const rootUser:User = { username: 'root', password: 'cVVQr53f5TCZtHcR', email: 'root@vpdb.io' };
		const users:User[] = [
			{ username: 'admin', password: 'vaDwjPf2pP7RwWx6', roles: [ 'member', 'admin' ], email: 'admin@vpdb.io' },
			{ username: 'contributor', password: 'qm5LKQjZEQMrjhmp', roles: [ 'member', 'contributor' ], email: 'contributor@vpdb.io' },
			{ username: 'member', password: 'x8gWyTrUhcCq9JHV', email: 'member@vpdb.io' },
		];
		const userHelper = new UserHelper();
		return userHelper.createUsers(apiBaseUrl, rootUser, users).then(users => {
			browser.users = {};
			users.forEach((user:User) => {
				browser.users[user.username] = user;
			});
			console.log('Global users are:', browser.users);
		});
	}
};

