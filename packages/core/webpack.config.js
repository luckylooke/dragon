module.exports = {
	entry: __dirname + '/dragon.js',
	output: {
		filename: 'dragon.es5.js'
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
			},
			{
		        test: /\.css$/,
		        use: [
		          { loader: "style-loader" },
		          { loader: "css-loader" }
		        ]
		    }
		]
	}
};