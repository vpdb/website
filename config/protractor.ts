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

		// register root user
		console.log('Creating users...');
		const userHelper = new UserHelper();
		return userHelper.createUsers('http://localhost:7357/api').then(users => {
			browser.users = {};
			users.forEach((user:User) => {
				browser.users[user.username] = user;
			});
			console.log('Global users are:', browser.users);
		});
	}
};

