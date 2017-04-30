import './polyfills.js'; // Element.classList polyfill
import Dragon from './dragon.js'; // library core
import touchy from './touchy.js'; // cross event

function dragonLib( options ) {

	let dragonInstance = new Dragon( options );
	touchy( document.documentElement, 'add', 'mousedown', dragonInstance.grab.bind( dragonInstance ) );
	return dragonInstance;
}

export default dragonLib;
window.dragon = dragonLib;