/* global __dirname, require, module, process */
const path = require('path')
// const CopyWebpackPlugin = require('copy-webpack-plugin')
// const CleanWebpackPlugin = require('clean-webpack-plugin')
const dragonWebConfig = require( path.join(__dirname, 'dragon-web', 'webpack.config.js'))
const ENV = process.env.NODE_ENV || 'DEV'
console.log('Loading webpack, env: ', ENV );

module.exports = [
  dragonWebConfig,
  {
    name: 'dragonLib',
    mode: ENV === 'PROD' ? 'production' : 'development',
    entry: path.resolve(__dirname, 'src/webpack.entry.js'),
    output: {
      library: 'dragon',
      libraryTarget: 'umd',
      path: path.resolve(__dirname, 'dist'),
      filename: 'dragon.js'
    },
    module: {
      rules: [
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
        },
        {
          test: /\.css$/,
          use: [
            { loader: 'style-loader' },
            { loader: 'css-loader' }
          ]
        }
      ]
    },
    // plugins: [
    //   new CleanWebpackPlugin( path.join( __dirname, '/docs')),
    //   new CopyWebpackPlugin( [
    //     { context: 'dragon-web', from: 'dist', to: path.join( __dirname, '/docs')},
    //     { context: 'packages/core', from: 'dragon.css', to: path.join( __dirname, '/dist')},
    //   ], {
    //     // debug: 'info'
    //   }),
    // ],
    resolve: {
      alias: {
        'env$': ENV === 'DEV' ? path.resolve( __dirname, 'env.dev.js') : path.resolve( __dirname, 'env.prod.js')
      }
    }
  }
]

