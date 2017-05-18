// Karma configuration
// Generated on Wed May 17 2017 09:14:53 GMT+0200 (CEST)

let isDev = process.env.NODE_ENV == 'DEV'
let webpackConf = require( './webpack.config.js' );

module.exports = function ( config ) {
	config.set( {

		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: '',


		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: [ 'jasmine' ],


		// By default, Karma loads all sibling NPM modules which have a name starting with karma-*.
		// plugins: [],


		// list of files / patterns to load in the browser
		files: [
			'src/**',
			'test/**',
			'dist/dragon.css'
		],


		// list of files to exclude
		exclude: [
			'src/classes.js',
			'src/touchy.js',
			'src/polyfills.js',
			'src/webpack.entry.js'
		],


		// preprocess matching files before serving them to the browser
		// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
		preprocessors: {
			'src/**': [ 'webpack', 'coverage' ],
			'test/**': [ 'webpack', 'coverage', 'eslint' ]
		},

		eslint: {
			stopOnError: false,
		},

		// test results reporter to use
		// possible values: 'dots', 'progress'
		// available reporters: https://npmjs.org/browse/keyword/karma-reporter
		reporters: [ 'progress', 'coverage' ],


		// web server port
		port: 9876,


		// enable / disable colors in the output (reporters and logs)
		colors: true,


		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,


		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: isDev,


		// start these browsers
		// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		browsers: isDev ? [ 'PhantomJS' ] : [ 'PhantomJS', 'Chrome', 'Firefox', 'Safari' ],


		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
		singleRun: !isDev,

		// Concurrency level
		// how many browser should be started simultaneous
		concurrency: Infinity,


		coverageReporter: {
			includeAllSources: true,
			dir: 'coverage/',
			reporters: [
				{ type: 'html', subdir: 'html' },
				{ type: 'text-summary' }
			]
		},

		webpack: webpackConf,

		webpackMiddleware: {
			noInfo: true
		}
	} )
}
