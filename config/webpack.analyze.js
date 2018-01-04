const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const prodConfig = require('./webpack.prod.js');

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = function(options) {
	return webpackMerge(prodConfig(options), {
		plugins: [
			new BundleAnalyzerPlugin()
		]
	});
};