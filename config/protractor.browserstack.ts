import { merge } from 'lodash';
import { browser, Config } from 'protractor';
import { FileDetector } from 'selenium-webdriver/remote';

import { config as commonConfig, setupReporter, setupUsers } from './protractor.common';

function capability(browser:string) {
	return {
		'browserName': browser,
		'browserstack.local': true,
		'browserstack.user': process.env.BROWSERSTACK_USER,
		'browserstack.key': process.env.BROWSERSTACK_KEY,
		'build': 'Codeship build ' + process.env.CI_BUILD_NUMBER,
		'project': 'vpdb/website'
	}
}

export let config: Config = merge(commonConfig, {
	seleniumAddress: 'http://hub-cloud.browserstack.com/wd/hub',
	capabilities: null,
	multiCapabilities: [ 'Chrome', 'Safari', 'Firefox', 'IE' ].map(capability),
	onPrepare: () => {
		setupReporter();
		console.log('Setting file detector to remote.'); // https://www.browserstack.com/automate/node
		browser.setFileDetector(new FileDetector());
		return setupUsers();
	}
});