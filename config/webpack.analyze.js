const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const prodConfig = require('./webpack.prod.js');

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const ENV = process.env.ENV = process.env.NODE_ENV = 'prod';

module.exports = function(options) {
	return webpackMerge(prodConfig({ env: ENV }), {
		plugins: [
			new BundleAnalyzerPlugin()
		]
	});
};