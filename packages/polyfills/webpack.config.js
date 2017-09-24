module.exports = {
	entry: __dirname + '/polyfills.js',
	output: {
		filename: 'polyfills.es5.js'
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