const CopyWebpackPlugin = require( 'copy-webpack-plugin' );
const CleanWebpackPlugin = require( 'clean-webpack-plugin' )

module.exports = {
	entry: __dirname + '/src/webpack.entry.js',
	output: {
		library: 'dragon',
		libraryTarget: 'umd',
		path: __dirname + '/dist',
		filename: 'dragon.js'
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				query: {
					presets: [ 'env' ],
					plugins: [
						'transform-decorators-legacy',
						'transform-class-properties'
					],
					babelrc: false
				}
			}
		]
	},
	plugins: [
		new CopyWebpackPlugin( [
			{ from: './dragon-web/dist', to: './../docs' },
			{ from: './dragon-web/index.html', to: './../docs/index.html' }
		] ),
		new CleanWebpackPlugin( __dirname + '/docs' ),
	]
};