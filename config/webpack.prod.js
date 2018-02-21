/* eslint-disable */
const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const join = require('path').join;

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

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

			// see also: https://github.com/morris/typekit-cache
			new WorkboxPlugin({
				cacheId: 'vpdb',
				globDirectory: options.outputPath,
				globPatterns: ['**/*.{html,js,css,jpg,png,eot,svg,ttf,woff}'],
				globIgnores: [ 'sprite.svg', '**/glyphicons-*' ],
				swDest: join(options.outputPath, 'sw.js'),
				clientsClaim: true,
				skipWaiting: true,
				dontCacheBustUrlsMatching: /-([0-9a-f]{12}|[0-9A-Za-z]{8})\./,
				navigateFallback: options.websiteUrl + 'index.html',
				runtimeCaching: [{
					urlPattern: options.apiUrl,
					handler: 'networkFirst'
				}, {
					urlPattern: options.storageUrl,
					handler: 'cacheFirst'
				}]
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
