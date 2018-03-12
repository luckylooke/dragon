import crossvent from 'crossvent'

export default function touchy( el, op, type, fn ) {

	let touch = {
		mouseup: 'touchend',
		mousedown: 'touchstart',
		mousemove: 'touchmove'
	}

	let pointers = {
		mouseup: 'pointerup',
		mousedown: 'pointerdown',
		mousemove: 'pointermove'
	}

	let microsoft = {
		mouseup: 'MSPointerUp',
		mousedown: 'MSPointerDown',
		mousemove: 'MSPointerMove'
	}

	/** @namespace global.navigator.pointerEnabled -- resolving webstorm unresolved variables */
	/** @namespace global.navigator.msPointerEnabled -- resolving webstorm unresolved variables */
	if ( global.navigator.pointerEnabled ) {

		crossvent[op](el, pointers[type], fn, { passive: false });
	}
	else if (global.navigator.msPointerEnabled) {

		crossvent[op](el, microsoft[type], fn, { passive: false });
	}
	else {

		crossvent[op](el, touch[type], fn, { passive: false });
		crossvent[op](el, type, fn, { passive: false });
	}
}