import { merge, isObject, assign } from 'lodash';
import { browser, Config } from 'protractor';
import { FileDetector } from 'selenium-webdriver/remote';

import { config as commonConfig, setupReporter, setupUsers } from './protractor.common';

function capability(browser:any) {
	const base = {
		'browserstack.local': true,
		'browserstack.user': process.env.BROWSERSTACK_USER,
		'browserstack.key': process.env.BROWSERSTACK_KEY,
		'build': 'Codeship build ' + process.env.CI_BUILD_NUMBER,
		'project': 'vpdb/website'
	};
	return Object.assign(base, isObject(browser) ? browser : { browserName: browser });
}

export let config: Config = merge(commonConfig, {
	seleniumAddress: 'http://hub-cloud.browserstack.com/wd/hub',
	capabilities: null,
	multiCapabilities: [
			{ browserName: 'Chrome', os: 'Windows', browser_version: '66' },
			{ browserName: 'Firefox', os: 'Windows', browser_version: '59' },
			{ browserName: 'Chrome', os: 'OS X', browser_version: '66' },
			//{ browserName: 'Firefox', os: 'OS X' },
			//{ browserName: 'Edge', browser_version: '16.0' },
			//{ browserName: 'IE', browser_version: '11.0' },
			//{ browserName: 'Safari', browser_version: '11.0', os: 'OS X', os_version: 'High Sierra' }
		].map(capability),
	onPrepare: async () => {
		setupReporter();
		console.log('Setting file detector to remote.'); // https://www.browserstack.com/automate/node
		browser.setFileDetector(new FileDetector());
		await setupUsers();
	}
});
