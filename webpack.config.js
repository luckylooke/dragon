const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

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
				use: [{
				    loader: 'babel-loader',
				    options: {
						presets: ['env'],
						plugins: [
							'transform-decorators-legacy',
							'transform-class-properties'
						],
						babelrc: false       
				    }
				  }]
			}
		]
	},
	plugins: [
		new CleanWebpackPlugin( path.join( __dirname, '/docs')),
		new CopyWebpackPlugin( [
			{ context: 'dragon-web', from: 'dist', to: path.join( __dirname, '/docs')}
		], { 
			// debug: 'info' 
		}),
	]
};