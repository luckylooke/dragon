'use strict';
/* global dragon */

let animationRunning = false;

setTimeout( () => {
	
	console.log('dingdong', dragon);

	let testDragon = dragon( {
		containers: document.getElementsByClassName( 'container' ),
		mouseEvents: () => !animationRunning,
		mirrorAbsolute: () => animationRunning,
	} )

	let test1item = document.getElementById( 'test1' )
	let test2item = document.getElementById( 'test2' )
	let rightContainer = document.getElementById( 'right-defaults' )

	//
	// let getOffset = testDragon.space.utils.getOffset
	//
	// let test1offset = getOffset( test1item )

	animate( testDragon, test1item, rightContainer )

	console.log( 'testDragon', testDragon )

}, 10 )

// duration in seconds!
function animate( dragon, itemElm, destElm, duration ) {

	duration = duration || 2;

	let getOffset = dragon.space.utils.getOffset
	let itemOffset = getOffset( itemElm, true )
	let destOffset = getOffset( destElm, true )
	let startX = itemOffset.left + ( itemOffset.width / 2 )
	let startY = itemOffset.top + ( itemOffset.height / 2 )
	let destX = destOffset.left + ( destOffset.width / 2 )
	let destY = destOffset.top + ( destOffset.height / 2 )
	let distanceX = destX - startX
	let distanceY = destY - startY
	let steps = duration * 60
	let i = 0

	animationRunning = true;

	let drag = dragon.grab( itemElm )
	drag.start( itemOffset.width / 2, itemOffset.height / 2 )

	let cb = () => {

		drag.release();
		animationRunning = false;
	}

	step( 16 )

	function step( time ) {

		// console.log( 'step', drag.x, drag.y );

		if ( i < steps ) {

			setTimeout( () => {

				let ease = easeInOutQuadDiff( i++ / steps, i-- / steps )
				let ease2 = easeInOutQuartDiff( i++ / steps, i / steps )
				// console.log( 'step', distanceX * ease, distanceY * ease2 )
				drag.drag( drag.x + distanceX * ease, drag.y + distanceY * ease2 )
				step( time )
			}, time )

			return
		}
		else
			drag.drag( destX, destY )

		if ( cb )
			setTimeout( cb, 500 )

	}
}

// https://gist.github.com/gre/1650294
function easeInOutQuad( t ) {
	return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

function easeInOutQuadDiff( t0, t1 ) {
	return easeInOutQuad( t1 ) - easeInOutQuad( t0 )
}

function easeInOutQuart( t ) {
	return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t
}

function easeInOutQuartDiff( t0, t1 ) {
	return easeInOutQuart( t1 ) - easeInOutQuart( t0 )
}