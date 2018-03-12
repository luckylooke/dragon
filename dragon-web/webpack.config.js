/* global __dirname, require, module */
const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

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
          presets: ['env'],
          plugins: [
            'transform-decorators-legacy',
            'transform-class-properties'
          ],
          babelrc: false
        }
      },
      {
        test: /\.(scss|css)$/,
        use: [{
                loader: 'style-loader', // inject CSS to page
              }, {
                loader: 'css-loader', // translates CSS into CommonJS modules
              }, {
                loader: 'postcss-loader', // Run post css actions
                options: {
                  plugins: function () { // post css plugins, can be exported to postcss.config.js
                    return [
                      require('precss'),
                      require('autoprefixer')
                    ];
                  }
                }
              }, {
                loader: 'sass-loader' // compiles SASS to CSS
            }]
      },
    ]
  },
  plugins: [
    new CleanWebpackPlugin( path.join( __dirname, '/dist')),
    new CopyWebpackPlugin( [
      { from: 'src/index.html', to: 'index.html'},
      { from: 'assets', to: 'assets' },
      { context: 'src/pages', from: '**/*.html', to: path.join( __dirname, '/dist/pages') },
    ], {
      // debug: 'debug' // or info
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      Popper: ['popper.js', 'default']
    })
  ],
  devServer: {
    contentBase: './dist'
  },
}
