
// Rollup plugins
import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify-es';


export default {
	entry: 'src/dragon.js',
	dest: 'dist/dragon.es.js',
	format: 'es',
	sourceMap: true,
	plugins: [
		resolve({
			jsnext: true,
			main: true,
			browser: true,
		}),
		commonjs(),
		eslint(),
		babel({
			exclude: 'node_modules/**',
		}),
		uglify()
	],
};