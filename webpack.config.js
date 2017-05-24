var CopyWebpackPlugin = require( 'copy-webpack-plugin' );

module.exports = {
	entry: __dirname + "/src/webpack.entry.js",
	output: {
		library: 'Dragon',
		libraryTarget: 'umd',
		path: __dirname + "/dist",
		filename: "dragon.js"
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel-loader',
				query: {
					presets: [ 'env' ],
					plugins: [
						"transform-decorators-legacy",
						"transform-class-properties"
					],
					babelrc: false
				}
			}
		]
	},
	plugins: [
		new CopyWebpackPlugin( [
			{ from: './dragon-web/dist', to: './../docs' }
		] )
	]
};