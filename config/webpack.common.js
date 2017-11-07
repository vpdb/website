const { resolve } = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');

module.exports  = function(options) {
	const isProd = options.env === 'production';
	return {
		entry: {
			app: './src/app/index.js'
		} ,
		module: {
			rules: [
				{ test: /src.*\.js$/, loader: 'ng-annotate-loader', options: { ngAnnotate: 'ng-annotate-patched', es6: true, explicitOnly: false } },
				{ test: /\.pug$/, use: [ { loader: 'pug-loader', options: { pretty: true } } ] },
				{ test: /\.html$/, loader: 'raw-loader' },
				{ test: /\.(eot|woff|woff2|ttf|png|svg|jpg)$/, exclude: [ resolve(__dirname, '../src/icons')  ], loader: 'url-loader?limit=300' },
				{ test: /\.css$/, use: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader' }) },
				{ test: /\.styl$/, use: ExtractTextPlugin.extract({ fallback: 'style-loader', use: ['css-loader?sourceMap', 'stylus-loader'] }) },
				{ test: /\.svg$/, include: resolve(__dirname, '../src/icons'), use: [
					{ loader: 'svg-sprite-loader', options: { extract: true } },
					{ loader: 'svgo-loader', options: { plugins: [ { removeDoctype: true }, { removeXMLProcInst: true }, { removeComments: true }, { removeMetadata: true }, { removeEditorsNSData: true }, { cleanupAttrs: true }, { convertStyleToAttrs: true }, { removeRasterImages: true }, { cleanupNumericValues: true }, { convertColors: true }, { removeUnknownsAndDefaults: true }, { removeNonInheritableGroupAttrs: true }, { removeUselessStrokeAndFill: true }, { removeViewBox: true }, { cleanupEnableBackground: true }, { removeHiddenElems: true }, { removeEmptyText: true }, { convertShapeToPath: true }, { moveElemsAttrsToGroup: true }, { moveGroupAttrsToElems: true }, { collapseGroups: true }, { convertPathData: true }, { convertTransform: true }, { removeEmptyAttrs: true }, { removeEmptyContainers: true }, { mergePaths: true }, { cleanupIDs: true }, { removeUnusedNS: true }, { transformsWithOnePath: false }, { sortAttrs: true }, { removeTitle: true } ] } }
				] }
			]
		},
		plugins: [

			new ExtractTextPlugin({
				filename: '[name].[contenthash].css',
				allChunks: true
			}),

			new HtmlWebpackPlugin({
				template: './src/index.pug'
			}),

			new SpriteLoaderPlugin({
				plainSprite: true
			}),

			new webpack.optimize.CommonsChunkPlugin({
				name: 'vendors',
				minChunks: isExternal
			}),

			new webpack.ProvidePlugin({
				'window.jQuery': 'jquery'
			}),

			new webpack.DefinePlugin({
				WEBSITE_CONFIG: JSON.stringify(require('./vpdb.' + process.env.CONFIG + '.json'))
			})
		],
		output: {
			path: resolve(__dirname, 'dist'),
			filename: '[name].[hash].bundle.js',
		}
	}
};

function isExternal(module) {
	const context = module.context;
	if (typeof context !== 'string') {
		return false;
	}
	return context.indexOf('node_modules') !== -1;
}