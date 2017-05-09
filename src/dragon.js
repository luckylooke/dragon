'use strict';

import './polyfills.js'; // Element.classList polyfill
import touchy from './touchy.js'; // cross event
import { getParent, toArray, isInput } from './utils';
import Container from './container';
import { decorator as middle } from 'middle.js';

let doc = document;

if ( !window.dragonSpace )
	window.dragonSpace = {};
let space = window.dragonSpace;

// ==============================================================================================================================================================
// Dragon =====================================================================================================================================================
// =============================================================================================================================================================
/** is group of containers with same settings */
export default class Dragon {

	constructor( config ) {

		config = config || {};

		if ( typeof config.length !== 'undefined' ) // is array-like
			config = { containers: toArray( config ) };

		this.initSpace( config.space );
		this.space = space;
		space.dragons.push( this );

		this.config = config;
		this.defaults = {
			mirrorContainer: doc.body
		};
		this.id = config.id || 'dragonID_' + Date.now();
		this.containers = [];
		this.containersLookUp = [];

		// init
		this.addContainers();
	}

	@middle
	initSpace( newSpace ) {

		if ( newSpace )
			space = newSpace;

		if ( !space.dragons ) { // initialisation
			space.dragons = [];
			touchy( document.documentElement, 'add', 'mousedown', this.grab.bind( this ) );
		}

		if ( !space.Dragon )
			space.Dragon = Dragon;
	}

	@middle
	addContainers( containerElms, config ) {

		containerElms = containerElms || this.config.containers;

		if ( !containerElms ) return;

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

	@middle
	getContainer( el, own ) {

		if ( own )
			return this.containers[ this.containersLookUp.indexOf( el ) ];

		let container = null;
		space.dragons.forEach( function ( dragon ) {
			if ( dragon.containersLookUp.indexOf( el ) != -1 )
				container = dragon.containers[ dragon.containersLookUp.indexOf( el ) ];
		} );

		return container;
	}

	@middle
	grab( e ) {

		let item = e.target;
		let source;
		let container;
		let index;

		if ( isInput( item ) ) { // see also: github.com/bevacqua/dragula/issues/208
			e.target.focus(); // fixes github.com/bevacqua/dragula/issues/176
			return;
		}

		while ( getParent( item ) && !this.getContainer( getParent( item ), item, e ) ) {
			item = getParent( item ); // drag target should be a top element
		}
		source = getParent( item );
		if ( !source ) {
			return;
		}

		index = this.containersLookUp.indexOf( source );
		container = this.containers[ index ];
		return container.grab( e, item, source );
	}

	@middle
	findDropTarget( elementBehindCursor ) {

		let target = elementBehindCursor;
		while ( target && !this.getContainer( target ) ) {
			target = getParent( target );
		}
		return target;
	}

	@middle
	getConfig( prop ) {

		if ( !prop )
			return this.config;

		prop = this.config.hasOwnProperty( prop ) ? this.config[ prop ] : this.defaults[ prop ];
		return typeof prop == 'function' ? prop() : prop;
	}

}
