'use strict';
/* global dragons */

var testDragon = dragons.dragon ( [ $ ( 'left-defaults' ), $ ( 'right-defaults' ) ] );
// dragon([$('left-copy'), $('right-copy')], { copy: true });

console.log ( 'testDragon', testDragon );


function $( id ) {
	return document.getElementById ( id );
}
