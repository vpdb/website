const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = function(options) {

	return webpackMerge(commonConfig(options), {

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
		],

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