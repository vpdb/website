import { merge } from 'lodash';
import { Config } from 'protractor';

import { config as commonConfig } from './protractor.common';


export let config:Config = merge(commonConfig, {
	seleniumAddress: 'http://hub-cloud.browserstack.com/wd/hub',
	capabilities: {
		'browserstack.local': true,
		'browserstack.user': process.env.BROWSERSTACK_USER,
		'browserstack.key': process.env.BROWSERSTACK_KEY
	},
});

