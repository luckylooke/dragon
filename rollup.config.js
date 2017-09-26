
// Rollup plugins
import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify-es';

let pkg = require('./package.json');
let external = Object.keys(pkg.dependencies);

export default {
	entry: 'src/dragon.lib.js',
	plugins: [
		eslint(),
		resolve({
			jsnext: true,
			main: true,
			browser: true,
		}),
		commonjs(),
		babel({
			// exclude: 'node_modules/**',
		}),
		uglify()
	],
	external,
	targets: [
	    {
	      dest: 'dist/dragon.rollup.umd.js', // TODO: not containning library code.. how to fix it?
	      format: 'umd',
	      moduleName: 'dragon',
	      sourceMap: true
	    },
	    {
	      dest: pkg.module,
	      format: 'es',
	      sourceMap: true
	    }
	  ]
};