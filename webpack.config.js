/* eslint-disable */
const fs = require('fs');
const config = './config/webpack.' + process.env.ENV + '.js';
if (!fs.existsSync(config)) {
	throw Error('The ENV variable points to your webpack config. ' + config + ' does not exist.');
}

const websiteConfig = require(process.env.WEBSITE_CONFIG && fs.existsSync(process.env.WEBSITE_CONFIG)
	? process.env.WEBSITE_CONFIG
	: './config/vpdb.' + process.env.CONFIG + '.json');
const websiteUrl =
	websiteConfig.webUri.protocol + '://' +
	websiteConfig.webUri.hostname +
	([80, 443].includes(websiteConfig.webUri.port) ? '' : ':' + websiteConfig.webUri.port) +
	'/';

module.exports = require(config)({ env: process.env.ENV, websiteUrl: websiteUrl, websiteConfig: websiteConfig });
