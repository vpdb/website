/* eslint-disable */
const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');

module.exports = function(options) {

	return webpackMerge(commonConfig(options), {

		plugins: [

			// see also: https://github.com/morris/typekit-cache
			new SWPrecacheWebpackPlugin({
				cacheId: 'vpdb',
				dontCacheBustUrlsMatching: /-([0-9a-f]{12}|[0-9A-Za-z]{8})\./,
				filename: 'service-worker.js',
				minify: true,
				navigateFallback: options.websiteUrl + 'index.html',
				staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
				runtimeCaching: [{
					urlPattern: /^http:\/\/localhost:3000\/api/,
					handler: 'networkFirst'
				}, {
					urlPattern: /^http:\/\/localhost:3000\/public/,
					handler: 'cacheFirst'
				}]
			}),

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
