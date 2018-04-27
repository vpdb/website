/* eslint-disable */
const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const RollbarSourceMapPlugin = require('rollbar-sourcemap-webpack-plugin');

module.exports = function(options) {

	const plugins = [

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
			importWorkboxFrom: 'local',
			exclude: [ /^sprite\.svg/, /\.map$/, /ipdb-index\.json/, /robots\.txt/, /^favicon\// ],
			navigateFallback: options.websiteUrl + 'index.html',
			ignoreUrlParametersMatching: [/^utm_/, /^_$/],
			cacheId: 'vpdb',
			clientsClaim: true, // first install: take control of *uncontrolled* immediately
			skipWaiting: false, // update: wait for browser to close all tabs before activating
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
				handler: 'staleWhileRevalidate',
				options: {
					cacheName: 'storage-cache',
					expiration: {
						maxAgeSeconds: 3600 * 24 * 7 // cache storage one week
					}
				}
			}, {
				// need to ignore the "_" url parameter in order for this to be of any use
				// 	urlPattern: /^https?:\/\/p\.typekit\.net/,
				// 	handler: 'staleWhileRevalidate',
				// 	options: {
				// 		cacheName: 'p-typekit-cache',
				// 		expiration: {
				// 			maxAgeSeconds: 3600 * 24 * 7 // one week
				// 		}
				// 	}
				// }, {
				urlPattern: /^https?:\/\/use\.typekit\.net/,
				handler: 'staleWhileRevalidate',
				options: {
					cacheName: 'use-typekit-cache',
					expiration: {
						maxAgeSeconds: 3600 * 24 * 7 // one week
					},
					cacheableResponse: {
						statuses: [200, 307],
					},
				}
			}, {
				urlPattern: new RegExp('^(' + [ 'https://www.google-analytics.com/analytics.js', 'https://cdn.raygun.io/raygun4js/raygun.min.js', 'https://cdn.uptimia.com/rum.min.js' ].map(regexEscape).join('|') + ')$'),
				handler: 'staleWhileRevalidate',
				options: {
					cacheName: 'analytics-cache',
					expiration: {
						maxAgeSeconds: 3600 * 24 * 7 // one week
					}
				}
			}]
		})
	];

	if (options.websiteConfig.rollbar.enabled) {
		plugins.push(new RollbarSourceMapPlugin({
			accessToken: options.websiteConfig.rollbar.accessToken,
			version: options.revision.hash,
			publicPath: options.websiteUrl
		}));
	}

	return webpackMerge(commonConfig(options), {

		plugins: plugins,

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
