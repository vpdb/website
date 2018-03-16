/* eslint-disable */
const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');

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
				cacheId: 'vpdb',
				clientsClaim: true,
				skipWaiting: true,
				exclude: [ /^sprite\.svg/, /\.map$/ ],
				dontCacheBustUrlsMatching: /-([0-9a-f]{12}|[0-9A-Za-z]{8})\./,
				navigateFallback: options.websiteUrl + 'index.html',
				ignoreUrlParametersMatching: [/^utm_/, /^_$/],
				runtimeCaching: [{
					urlPattern: new RegExp('^' + regexEscape(options.apiUrl)),
					handler: 'networkFirst',
					options: {
						cacheName: 'api-cache',
						networkTimeoutSeconds: 10,
						expiration: {
							maxAgeSeconds: 3600,
						},
					}
				}, {
					urlPattern: new RegExp('^' + regexEscape(options.storageUrl)),
					handler: 'cacheFirst',
					options: {
						cacheName: 'storage-cache',
						expiration: {
							maxAgeSeconds: 3600 * 24 * 7 // cache storage one week
						}
					}
				}, {
					urlPattern: /https?:\/\/p\.typekit\.net/,
					handler: 'cacheFirst',
					options: {
						cacheName: 'p-typekit-cache',
						expiration: {
							maxAgeSeconds: 3600 * 24 * 7 // one week
						}
					}
				}, {
					urlPattern: /https?:\/\/use\.typekit\.net/,
					handler: 'cacheFirst',
					options: {
						cacheName: 'use-typekit-cache',
						expiration: {
							maxAgeSeconds: 3600 * 24 * 7 // one week
						},
						cacheableResponse: {
							statuses: [200, 307],
						},
					}
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

function regexEscape(s) {
	return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}
