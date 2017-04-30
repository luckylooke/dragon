'use strict';

import { getParent } from './utils';
import Container from './container';

let classes = require( './classes' );

let doc = document;


// ==============================================================================================================================================================
// Dragon =====================================================================================================================================================
// =============================================================================================================================================================
/** is group of containers with same settings */
export default class Dragon {

	constructor( options ) {

		console.log( 'Dragon instance created, options: ', options )

		if ( !options )
			options = {};

		this.id = options.id || 'dragonID_' + Date.now();

		this.defaults = {
			mirrorContainer: doc.body
		};
		this.options = Object.assign( {}, this.defaults, options );

		this.containersLookup = [];

		this.containers = [];

		if ( this.options.containers )
			this.addContainers();

	}

	addContainers( containers ) {
		console.log( 'Adding containers: ', containers );

		if ( !containers )
			containers = this.options.containers;

		let self = this;
		containers.forEach( function ( containerElm ) {
			if ( self.containersLookup.indexOf( containerElm ) > -1 ) {
				console.warn( 'container already registered', containerElm );
				return;
			}

			let container = new Container( self, containerElm );

			self.containers.push( container );
			self.containersLookup.push( containerElm );
		} );
	}

	isContainer( el ) {
		console.log( 'dragon.isContainer called, el:', el, this.containersLookup );
		return this.containersLookup.indexOf( el ) != -1;
	}

	getContainer( el ) {
		return this.containers[ this.containersLookup.indexOf( el ) ];
	}

	grab( e ) {
		console.log( 'grab called, e:', e );

		let item = e.target;
		let source;
		let container;
		let index;

		// if (isInput(item)) { // see also: github.com/bevacqua/dragula/issues/208
		//   e.target.focus(); // fixes github.com/bevacqua/dragula/issues/176
		//   return;
		// }

		while ( getParent( item ) && !this.isContainer( getParent( item ), item, e ) ) {
			item = getParent( item ); // drag target should be a top element
		}
		source = getParent( item );
		if ( !source ) {
			return;
		}

		index = this.containersLookup.indexOf( source );
		container = this.containers[ index ];
		container.grab( e, item, source );
	}

	findDropTarget( elementBehindCursor ) {
		let target = elementBehindCursor;
		while ( target && !this.isContainer( target ) ) {
			target = getParent( target );
		}
		return target;
	}

}
