import { merge } from 'lodash';
import { browser, Config } from 'protractor';
import { FileDetector } from 'selenium-webdriver/remote';

import { config as commonConfig, setupReporter, setupUsers } from './protractor.common';

export let config: Config = merge(commonConfig, {
	seleniumAddress: 'http://hub-cloud.browserstack.com/wd/hub',
	capabilities: {
		'browserstack.local': true,
		'browserstack.user': process.env.BROWSERSTACK_USER,
		'browserstack.key': process.env.BROWSERSTACK_KEY
	},
	onPrepare: () => {
		setupReporter();
		console.log('Setting file detector to remote.'); // https://www.browserstack.com/automate/node
		browser.setFileDetector(new FileDetector());
		return setupUsers();
	}
});