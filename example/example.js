'use strict';
/* global dragon */

setTimeout( () => {

	var testDragon = new Dragon( {
		containers: document.getElementsByClassName( 'container' ),
		mouseEvents: false,
		mirrorAbsolute: true,
	} )

	let test1item = document.getElementById( 'test1' )
	// let test2item = document.getElementById( 'test2' )
	//
	// let getOffset = testDragon.space.utils.getOffset
	//
	// let test1offset = getOffset( test1item )

	animate( testDragon, test1item )

	console.log( 'testDragon', testDragon )

}, 10 )

function animate( dragon, itemElm ) {
	let drag = dragon.grab( itemElm )
	drag.start()

	step( drag, 25, 10, 15, () => {
		drag.release();
	} )
}

function step( drag, stepX, stepY, steps, cb ) {

	// console.log('dingdong', drag, stepX, stepY, steps );
	console.log('dingdong', drag.x, drag.y );
	drag.drag( drag.x + stepX, drag.y + stepY )
	steps--

	if ( steps )
		setTimeout( step.bind( null, drag, stepX, stepY, steps, cb ), 50 );
	else
		cb()
}