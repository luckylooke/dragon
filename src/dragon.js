'use strict';

import './polyfills.js'; // Element.classList polyfill
import touchy from './touchy.js'; // cross event
import { getParent, toArray } from './utils';
import Container from './container';

let doc = document;
let space = window;

// ==============================================================================================================================================================
// Dragon =====================================================================================================================================================
// =============================================================================================================================================================
/** is group of containers with same settings */
export default class Dragon {

	constructor( config ) {

		console.log( 'Dragon instance created, config: ', config, this );

		if ( typeof config.length !== 'undefined' ) // is array-like
			config = { containers: toArray( config ) };

		this.initSpace( config );
		this.space = space;

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

	initSpace( config ) {
		if ( config && config.space )
			space = config.space;

		if ( !space.dragons ) { // initialisation
			space.dragonSpace = {};
			space = space.dragonSpace;
			space.dragons = [];
			touchy( document.documentElement, 'add', 'mousedown', this.grab.bind( this ) );
		}

		if ( !space.Dragon )
			space.Dragon = Dragon;

		console.log( 'dingdong', space );

		space.dragons.push( this );
	}

	addContainers( containerElms, config ) {

		console.log( 'dragon.addContainers called config: ', config, this );

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

	isContainer( el ) {

		console.log( 'dragon.isContainer called, el:', el, this );

		var found = false;
		space.dragons.forEach( function ( dragon ) {
			if ( dragon.containersLookUp.indexOf( el ) != -1 )
				found = true;
		} );
		return found;
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

		prop = this.config[ prop ];
		return typeof prop == 'function' ? prop() : prop;
	}

}
