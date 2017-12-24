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
	return assign(base, isObject(browser) ? browser : { browserName: browser });
}

export let config: Config = merge(commonConfig, {
	seleniumAddress: 'http://hub-cloud.browserstack.com/wd/hub',
	capabilities: null,
	multiCapabilities: [
			'Chrome',
			'Firefox',
			// 'IE',
			'Edge',
			{ os: 'OS X', os_version: 'High Sierra', browserName: 'Safari', browser_version: '11.0' },
			{ device: 'iPad 5th', realMobile: true, os_version: '11.0' },
			{ device: 'Google Nexus 9', realMobile: true, os_version: '5.1' }
		].map(capability),
	onPrepare: () => {
		setupReporter();
		console.log('Setting file detector to remote.'); // https://www.browserstack.com/automate/node
		browser.setFileDetector(new FileDetector());
		return setupUsers();
	}
});