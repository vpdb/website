/* eslint-disable */
const { resolve } = require('path');
const { readFileSync } = require('fs');
const UglifyJS = require('uglify-js');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const PreloadWebpackPlugin = require('preload-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

const srcContext = resolve(__dirname, '../src');
const appContext = resolve(__dirname, '../src/app');
const staticContext = resolve(__dirname, '../src/static');
const iconsContext = resolve(__dirname, '../src/icons');
const pkg = require('../package');

module.exports  = function(options) {
	const isProd = options.env === 'prod';
	const cssLoader = { loader: 'css-loader', options: { sourceMap: true } };
	const preConnect = [];

	// pre-connect to api and preview on every page
	if (options.websiteConfig.webUri.hostname !== options.websiteConfig.apiUri.hostname || options.websiteConfig.webUri.port !== options.websiteConfig.apiUri.port) {
		preConnect.push(options.websiteConfig.apiUri.protocol + '://' + options.websiteConfig.apiUri.hostname + ([80, 443].includes(options.websiteConfig.apiUri.port) ? '' : ':' + options.websiteConfig.apiUri.port))
	}
	if ((options.websiteConfig.webUri.hostname !== options.websiteConfig.previewUri.hostname || options.websiteConfig.webUri.port !== options.websiteConfig.previewUri.port) &&
		(options.websiteConfig.apiUri.hostname !== options.websiteConfig.previewUri.hostname || options.websiteConfig.apiUri.port !== options.websiteConfig.previewUri.port)) {
		preConnect.push(options.websiteConfig.previewUri.protocol + '://' + options.websiteConfig.previewUri.hostname + ([80, 443].includes(options.websiteConfig.previewUri.port) ? '' : ':' + options.websiteConfig.previewUri.port))
	}
	preConnect.push('//www.gravatar.com');

	// pre-load fonts
	const preLoad = [
		{ href: 'https://use.typekit.net/af/8f4e31/0000000000000000000132e3/27/l?subset_id=2&fvd=n7&v=3', as: 'font' },
		{ href: 'https://use.typekit.net/af/383ab4/0000000000000000000132e4/27/l?subset_id=2&fvd=i7&v=3', as: 'font' },
		{ href: 'https://use.typekit.net/af/333a5f/0000000000000000000132db/27/l?subset_id=2&fvd=n1&v=3', as: 'font' },
		{ href: 'https://use.typekit.net/af/919252/0000000000000000000132dc/27/l?subset_id=2&fvd=i1&v=3', as: 'font' },
		{ href: 'https://use.typekit.net/af/2f8f3d/0000000000000000000132dd/27/l?subset_id=2&fvd=n3&v=3', as: 'font' },
		{ href: 'https://use.typekit.net/af/9f8c97/0000000000000000000132de/27/l?subset_id=2&fvd=i3&v=3', as: 'font' },
	];
	return {
		entry: {
			app: './src/index.js'
		},
		mode: isProd ? 'production' : 'development',
		module: {
			rules: [
				{ test: /\.js$/, use: [
					{ loader: 'ng-annotate-loader', options: { ngAnnotate: 'ng-annotate-patched', es6: false, explicitOnly: false } },
					{ loader: 'babel-loader', options: { presets: [ [ '@babel/preset-env', { modules: 'commonjs' } ] ], plugins: [ 'lodash' ] } } ], include: srcContext },
				{ test: /\.pug$/, oneOf: [
					{ test: /index\.pug$/, use: [ { loader: 'pug-loader', options: { pretty: false } } ] },
					{ use: [
						{ loader: 'file-loader', options: { name: '[path][name]-[sha256:hash:base58:8].html', context: appContext } },
						{ loader: 'pug-html-loader', options: { pretty: false } }
					] }
				] },
				{ test: /\.html$/, loader: 'raw-loader' },
				{ test: /\.(eot|woff|woff2|ttf|otf|png|svg|jpg|swf)$/, loader: { loader: 'file-loader', options: { name: '[path][name]-[sha256:hash:base58:8].[ext]', context: staticContext } }, exclude: iconsContext },
				{ test: /\.css$/, use: ExtractTextPlugin.extract({ fallback: 'style-loader', use: cssLoader}) },
				{ test: /\.styl$/, use: ExtractTextPlugin.extract({ fallback: 'style-loader', use: [ cssLoader, 'stylus-loader?sourceMap=true'] }) },
				{ test: /\.less$/, use: ExtractTextPlugin.extract({ fallback: 'style-loader', use: [ cssLoader, 'postcss-loader', 'less-loader'] }) },
				{ test: /\.svg$/, use: [
					{ loader: 'svg-sprite-loader', options: { runtimeGenerator: require.resolve('./webpack/extract-runtime-generator'), extract: true } },
					{ loader: 'svgo-loader', options: { plugins: [ { removeDoctype: true }, { removeXMLProcInst: true }, { removeComments: true }, { removeMetadata: true }, { removeEditorsNSData: true }, { cleanupAttrs: true }, { convertStyleToAttrs: true }, { removeRasterImages: true }, { cleanupNumericValues: true }, { convertColors: true }, { removeUnknownsAndDefaults: true }, { removeNonInheritableGroupAttrs: true }, { removeUselessStrokeAndFill: true }, { removeViewBox: true }, { cleanupEnableBackground: true }, { removeHiddenElems: true }, { removeEmptyText: true }, { convertShapeToPath: true }, { moveElemsAttrsToGroup: true }, { moveGroupAttrsToElems: true }, { collapseGroups: true }, { convertPathData: true }, { convertTransform: true }, { removeEmptyAttrs: true }, { removeEmptyContainers: true }, { mergePaths: true }, { cleanupIDs: true }, { removeUnusedNS: true }, { transformsWithOnePath: false }, { sortAttrs: true }, { removeTitle: true } ] } }
				], include: iconsContext },
				{ test: /\.(json|txt|ico|xml)$/, type: 'javascript/auto', exclude: /node_modules/, use: [ { loader: 'file-loader', options: { name: '[name].[ext]' } } ] }
			]
		},
		plugins: [

			new ExtractTextPlugin({
				filename: '[name]-[sha256:contenthash:base58:8].css',
				allChunks: true
			}),

			new HtmlWebpackPlugin({
				template: './src/index.pug',
				inject: false,
				// see https://github.com/filamentgroup/loadCSS
				loadCss: UglifyJS.minify(readFileSync('./node_modules/fg-loadcss/src/cssrelpreload.js').toString()).code,
				config: options.websiteConfig,
				revision: options.revision,
				preConnect: preConnect,
				preLoad: preLoad
			}),

			new PreloadWebpackPlugin({
				rel: 'preload',
				include: 'allAssets',
				fileWhitelist: [ /^(app|vendor)\.bundle-[a-f0-9]{12}\.js/, /langdon.*?\.woff$/ ],
				as(entry) {
					if (/\.woff$/.test(entry)) return 'font';
					if (/\.jpg/.test(entry)) return 'image';
					if (/\.html/.test(entry)) return 'fetch';
					return 'script';
				}
			}),

			new SpriteLoaderPlugin({
				plainSprite: true
			}),

			// https://github.com/lodash/lodash-webpack-plugin
			new LodashModuleReplacementPlugin({
				shorthands: true
			}),

			new webpack.DefinePlugin({
				WEBSITE_CONFIG: JSON.stringify(options.websiteConfig),
				BUILD_CONFIG: JSON.stringify({ revision: options.revision, production: isProd, version: pkg.version })
			}),
		],
		optimization: {
			splitChunks: {
				cacheGroups: {
					vendor: {
						test: /node_modules/, // you may add "vendor.js" here if you want to
						name: "vendor",
						chunks: "initial",
						enforce: true
					}
				}
			},
			minimize: false
		},
		output: {
			path: options.outputPath,
			filename: '[name].bundle-[chunkhash].js',
			hashFunction: 'sha256',
			hashDigest: 'hex',
			hashDigestLength: 12
		},
		devtool: 'source-map'
	}
};
