import { merge } from 'lodash';
import { Config } from 'protractor';

import { config as commonConfig } from './protractor.common';

export let config:Config = merge(commonConfig, {
	seleniumAddress: commonConfig.capabilities.browserName !== 'Edge' ? 'http://localhost:4444/wd/hub' : 'http://localhost:17556'
});

