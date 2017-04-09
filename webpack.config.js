module.exports = {
	entry: __dirname + "/src/dragon.lib.js",
	output: {
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
					presets: [ 'es2015' ]
				}
			}
		]
	}
};