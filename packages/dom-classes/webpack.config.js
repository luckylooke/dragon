module.exports = {
	entry: __dirname + '/classes.js',
	output: {
		filename: 'classes.es5.js'
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
	}
};