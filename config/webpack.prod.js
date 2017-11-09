const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeJsPlugin = require('optimize-js-plugin');

const ENV = process.env.ENV = process.env.NODE_ENV = 'prod';

module.exports = function(options) {

	return webpackMerge(commonConfig({ env: ENV }), {

		plugins: [
			new OptimizeJsPlugin({ sourceMap: false }),
			new UglifyJsPlugin({
				parallel: true,
				uglifyOptions: {
					ie8: false,
					ecma: 6,
					warnings: true,
					mangle: true, // debug false
					output: {
						comments: false,
						beautify: false,  // debug true
					}
				},
				sourceMap: false
			}),
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