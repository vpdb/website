/* eslint-disable */
const { resolve } = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');

const appContext = resolve(__dirname, '../src/app');
const staticContext = resolve(__dirname, '../src/static');
const iconsContext = resolve(__dirname, '../src/icons');

module.exports  = function(options) {
	const isProd = options.env === 'prod';
	const cssLoader = { loader: 'css-loader', options: { sourceMap: true, minimize: isProd } };
	return {
		entry: {
			app: './src/app/index.js'
		},
		module: {
			rules: [
				{ test: /\.js$/, use: [
					{ loader: 'ng-annotate-loader', options: { ngAnnotate: 'ng-annotate-patched', es6: false, explicitOnly: false } },
					{ loader: 'babel-loader', options: { presets: ['@babel/preset-env'] } }
				], include: appContext  },
				{ test: /\.pug$/, oneOf: [
					{ test: /index\.pug$/, use: [ { loader: 'pug-loader', options: { pretty: !isProd } } ] },
					{ use: [
						{ loader: 'file-loader', options: { name: '[path][name]-[sha256:hash:base58:8].html', context: appContext } },
						{ loader: 'pug-html-loader', options: { pretty: !isProd } }
					] }
				] },
				{ test: /\.html$/, loader: 'raw-loader' },
				{ test: /\.(eot|woff|woff2|ttf|png|svg|jpg|swf)$/, loader: { loader: 'file-loader', options: { name: '[path][name]-[sha256:hash:base58:8].[ext]', context: staticContext } }, exclude: iconsContext },
				{ test: /\.css$/, use: ExtractTextPlugin.extract({ fallback: 'style-loader', use: cssLoader}) },
				{ test: /\.styl$/, use: ExtractTextPlugin.extract({ fallback: 'style-loader', use: [ cssLoader, 'stylus-loader?sourceMap=true'] }) },
				{ test: /\.svg$/, use: [
					{ loader: 'svg-sprite-loader', options: { extract: true } },
					{ loader: 'svgo-loader', options: { plugins: [ { removeDoctype: true }, { removeXMLProcInst: true }, { removeComments: true }, { removeMetadata: true }, { removeEditorsNSData: true }, { cleanupAttrs: true }, { convertStyleToAttrs: true }, { removeRasterImages: true }, { cleanupNumericValues: true }, { convertColors: true }, { removeUnknownsAndDefaults: true }, { removeNonInheritableGroupAttrs: true }, { removeUselessStrokeAndFill: true }, { removeViewBox: true }, { cleanupEnableBackground: true }, { removeHiddenElems: true }, { removeEmptyText: true }, { convertShapeToPath: true }, { moveElemsAttrsToGroup: true }, { moveGroupAttrsToElems: true }, { collapseGroups: true }, { convertPathData: true }, { convertTransform: true }, { removeEmptyAttrs: true }, { removeEmptyContainers: true }, { mergePaths: true }, { cleanupIDs: true }, { removeUnusedNS: true }, { transformsWithOnePath: false }, { sortAttrs: true }, { removeTitle: true } ] } }
				], include: iconsContext }
			]
		},
		plugins: [

			//new webpack.IgnorePlugin(/glyphicons/, /bootstrap/),

			new ExtractTextPlugin({
				filename: '[name]-[sha256:contenthash:base58:8].css',
				allChunks: true
			}),
			//
			// new webpack.SourceMapDevToolPlugin({
			// 	filename: "[file].map",
			// 	append: "//# sourceMappingURL=webpack://[url]",
			// 	moduleFilenameTemplate: '[resource-path]',
			// 	fallbackModuleFilenameTemplate: '[resource-path]'
			// }),

			new HtmlWebpackPlugin({
				template: './src/index.pug'
			}),

			new SpriteLoaderPlugin({
				plainSprite: true
			}),

			new webpack.optimize.CommonsChunkPlugin({
				name: 'vendors',
				minChunks: m => /node_modules/.test(m.context)
			}),

			new webpack.ProvidePlugin({
				'window.jQuery': 'jquery'
			}),

			new webpack.DefinePlugin({
				WEBSITE_CONFIG: JSON.stringify(require('./vpdb.' + process.env.CONFIG + '.json'))
			})
		],
		output: {
			path: resolve(__dirname, '../dist'),
			filename: '[name].bundle-[hash].js',
			hashFunction: 'sha256',
			hashDigest: 'hex',
			hashDigestLength: 12
		},
		devtool: 'source-map'
	}
};
