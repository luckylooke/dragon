'use strict';
/* global dragon */

var testDragon = dragon( { containers: [ $( 'left-defaults' ), $( 'right-defaults' ) ] } );
// dragon([$('left-copy'), $('right-copy')], { copy: true });

console.log( 'testDragon', testDragon );


function $( id ) {
	return document.getElementById( id );
}
