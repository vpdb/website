import { merge } from 'lodash';
import { Config } from 'protractor';

import { config as commonConfig } from './protractor.common';


export let config:Config = merge(commonConfig, {
	capabilities: {
		'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
		'build': process.env.TRAVIS_BUILD_NUMBER
	},
	sauceUser: process.env.SAUCE_USERNAME,
	sauceKey: process.env.SAUCE_ACCESS_KEY
});

