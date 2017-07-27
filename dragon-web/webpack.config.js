var path = require('path');

module.exports = {
  entry: __dirname + '/src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module : {
    loaders : [
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