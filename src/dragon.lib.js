import './polyfills.js'; // Element.classList polyfill
import Dragon from './dragon.js'; // library core
import touchy from './touchy.js'; // cross event

export default function dragonLib( config ) {

	let dragonInstance = new Dragon( config );
	touchy( document.documentElement, 'add', 'mousedown', dragonInstance.grab.bind( dragonInstance ) );
	return dragonInstance;
}

dragon = dragonLib;