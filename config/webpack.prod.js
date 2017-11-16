const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');

const MinifyPlugin = require("babel-minify-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const ENV = process.env.ENV = process.env.NODE_ENV = 'prod';

module.exports = function(options) {

	return webpackMerge(commonConfig({ env: ENV }), {

		plugins: [
			//new MinifyPlugin({}, { test: /src\/app\/.*?\.js($|\?)/, comments: false }),
			new UglifyJSPlugin({
				uglifyOptions: {
					mangle: true,
					compress: true,
					output: {
						beautify: false,
						comments: false
					}
				},
				//test: /^app\.bundle-[^.]+\.js$/i
			}),
			new BundleAnalyzerPlugin()
		],

		/**
		 * Developer tool to enhance debugging
		 *
		 * See: http://webpack.github.io/docs/configuration.html#devtool
		 * See: https://github.com/webpack/docs/wiki/build-performance#sourcemaps
		 */
		devtool: 'source-map',

		/**
		 * Webpack Development Server configuration
		 * Description: The webpack-dev-server is a little node.js Express server.
		 * The server emits information about the compilation state to the client,
		 * which reacts to those events.
		 *
		 * See: https://webpack.github.io/docs/webpack-dev-server.html
		 */
		devServer: {
			port: 3333,
		}
	});
};