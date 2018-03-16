/* eslint-disable */
const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const join = require('path').join;

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');

module.exports = function(options) {

	return webpackMerge({ plugins: [ new CleanPlugin([options.outputPath]) ] }, commonConfig(options), {

		plugins: [

			new UglifyJSPlugin({
				sourceMap: true,
				uglifyOptions: {
					mangle: true,
					compress: true,
					output: {
						beautify: false,
						comments: false
					}
				}
			}),
			new WorkboxPlugin.GenerateSW({
				swDest: 'sw.js',
				clientsClaim: true,
				skipWaiting: true,

			})
		],

		output: {
			publicPath: options.websiteUrl
		},

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

function regexEscape(s) {
	return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}
