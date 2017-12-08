import { browser, Config } from 'protractor';
import { UserHelper } from '../src/test/UserHelper';
import { root, users } from './testusers';
import { User } from "../src/test/models/user";

const JasmineConsoleReporter = require('jasmine-console-reporter');
const HtmlReporter = require('protractor-beautiful-reporter');

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
		setupReporter();
		return setupUsers();
	}
};

export function setupReporter() {
	// setup reporter
	jasmine.getEnv().clearReporters();
	jasmine.getEnv().addReporter(new JasmineConsoleReporter({
		colors: 1,           // (0|false)|(1|true)|2
		cleanStack: 1,       // (0|false)|(1|true)|2|3
		verbosity: 4,        // (0|false)|1|2|(3|true)|4
		listStyle: 'indent', // "flat"|"indent"
		activity: false
	}));
	jasmine.getEnv().addReporter(new HtmlReporter({
		baseDirectory: 'report',
		docTitle: 'VPDB website test results',
		gatherBrowserLogs: true
	}).getJasmine2Reporter());
}

export function setupUsers() {
	console.log('Creating users before tests.');
	console.log('API URL for setup: %s', apiBaseUrl);
	console.log('Base URL for testing: %s', webBaseUrl);

	// register users
	const userHelper = new UserHelper();
	return userHelper.createUsers(apiBaseUrl, root, users).then(users => {
		browser.users = {};
		users.forEach((user:User) => {
			browser.users[user.username] = user;
		});
		console.log('Global users are:', browser.users);
	});
}

export function throttleBrowser() {
	// setup chrome throttling
	// browser.driver.setNetworkConditions({
	// 	offline: false,
	// 	latency: 5, // Additional latency (ms).
	// 	download_throughput: 500 * 1024, // Maximal aggregated download throughput.
	// 	upload_throughput: 500 * 1024 // Maximal aggregated upload throughput.
	// });
}