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

	constructor( config ) {

		console.log( 'Dragon instance created, config: ', config, this )

		this.config = config || {};
		this.defaults = {
			mirrorContainer: doc.body
		};
		this.id = config.id || 'dragonID_' + Date.now();
		this.containers = [];
		this.containersLookUp = [];

		// init
		this.addContainers();
	}

	addContainers( containerElms, config ) {

		console.log( 'dragon.addContainers called config: ', config, this );

		if ( !containerElms )
			containerElms = this.config.containers;

		let self = this;
		containerElms.forEach( function ( elm ) {
			if ( self.containersLookUp.indexOf( elm ) > -1 ) {
				console.warn( 'container already registered', elm );
				return;
			}

			let container = new Container( self, elm, config );

			self.containers.push( container );
			self.containersLookUp.push( elm );
		} );
	}

	isContainer( el ) {

		console.log( 'dragon.isContainer called, el:', el, this );

		return this.containersLookUp.indexOf( el ) != -1;
	}

	getContainer( el ) {

		console.log( 'dragon.getContainer called, el:', el, this );

		return this.containers[ this.containersLookUp.indexOf( el ) ];
	}

	grab( e ) {

		console.log( 'dragon.grab called, e:', e, this );

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

		index = this.containersLookUp.indexOf( source );
		container = this.containers[ index ];
		container.grab( e, item, source );
	}

	findDropTarget( elementBehindCursor ) {

		console.log( 'dragon.findDropTarget called, prop', elementBehindCursor, this );

		let target = elementBehindCursor;
		while ( target && !this.isContainer( target ) ) {
			target = getParent( target );
		}
		return target;
	}

	getConfig( prop ) {

		console.log( 'dragon.getConfig called, prop', prop, this );

		prop = this.config[prop];
		return typeof prop == 'function' ? prop() : prop;
	}

}
