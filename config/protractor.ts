import axios from 'axios';
import { Config } from 'protractor';
import { SpecReporter } from 'jasmine-spec-reporter';
import { LoginModalPage } from '../src/app/auth/login.modal.page';
import { UserHelper } from '../src/test/UserHelper';


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
			console.log('Got users: ', users);
		});
		// return axios.post('http://localhost:7357/api/v1/users', {
		// 	username: LoginModalPage.USERNAME,
		// 	password: LoginModalPage.PASSWORD,
		// 	email: LoginModalPage.EMAIL
		//
		// }).then(response => {
		// 	if (response.status !== 201) {
		// 		console.warn('Could not create root user (%s): ', response.status, response.data);
		// 	}
		// }, err => {
		// 	console.error('Error creating root user: %s', err.message);
		// 	console.error(err.response.data);
		// });
	}
};

