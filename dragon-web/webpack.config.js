/* global __dirname, require, module, process */
const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
// const CleanWebpackPlugin = require('clean-webpack-plugin')
const ENV = process.env.NODE_ENV

module.exports = {
  name: 'dragonWeb',
  mode: ENV === 'PROD' ? 'production' : 'development',
  entry: path.resolve(__dirname, 'src/index.js'),
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module : {
    rules : [
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
                    ]
                  }
                }
              }, {
                loader: 'sass-loader' // compiles SASS to CSS
            }]
      },
    ]
  },
  plugins: [
    // new CleanWebpackPlugin( path.join( __dirname, 'dist')),
    new CopyWebpackPlugin( [
      { from: path.join( __dirname, 'src/index.html'), to: path.join( __dirname, 'dist/index.html'), force: true},
      { from: path.join( __dirname, 'assets'), to: path.join( __dirname, 'dist/assets'), force: true },
      { context: path.join( __dirname, 'src/pages'), from: '**/*.html', to: path.join( __dirname, 'dist/pages'), force: true },
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
  resolve: {
    alias: {
      'middle.js$': ENV === 'DEV' ? path.resolve( __dirname, '../packages/middle_dev/src/middle.src.js') : path.resolve( __dirname, '../node_modules/middle.js/')
    }
  },
  devServer: {
    // https://webpack.js.org/configuration/dev-server/
    contentBase: path.join(__dirname, 'dist'),
    publicPath: 'http://localhost:9000/',
    // compress: true,
    port: 9000,
    open: true
  }
}
