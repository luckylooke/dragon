'use strict';

import { getParent } from './utils';
import Container from './container';

let classes = require( './classes' );


// ==============================================================================================================================================================
// Dragon =====================================================================================================================================================
// =============================================================================================================================================================
/** is group of containers with same settings */
export default class Dragon {

	constructor( dragons, options ) {

		console.log( 'Dragon instance created, options: ', options )

		this.options = options instanceof Array ? { containers: options } : options || {};
		this.isContainer = this.options.isContainer || dragons.isContainer.bind( dragons );
		this.dragons = dragons;
		this.containers = [];
		this.id = options.id;

		if ( this.options.containers )
			this.addContainers();

	}

	addContainers( containers ) {
		console.log( 'Adding containers: ', containers );

		if ( !containers )
			containers = this.options.containers;

		let self = this;
		containers.forEach( function ( containerElm ) {
			if ( self.dragons.containersLookup.indexOf( containerElm ) > -1 ) {
				console.warn( 'container already registered', containerElm );
				return;
			}

			let container = new Container( self, containerElm );

			self.containers.push( container );
			self.dragons.containers.push( container );
			self.dragons.containersLookup.push( containerElm );
		} );
	}

	findDropTarget( elementBehindCursor ) {
		let target = elementBehindCursor;
		while ( target && !this.isContainer( target ) ) {
			target = getParent( target );
		}
		return target;
	}

}
