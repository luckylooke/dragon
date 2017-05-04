import Item from './item';
import { toArray } from './utils';

export default class Container {

	constructor( dragon, elm, config ) {

		console.log( 'Container instance created, dragon, config:', dragon, config, this );

		if ( !config )
			config = {};

		this.config = config;
		this.id = config.id || 'containerID_' + Date.now();
		this.dragon = dragon;
		this.items = [];
		this.itemsLookUp = [];
		this.elm = elm;

		this.initItems();
	}

	grab( e, itemElm ) {

		console.log( 'container.grab called, e, itemElm:', e, itemElm, this );

		return this.items[ this.itemsLookUp.indexOf( itemElm ) ].grab( e );
	}

	addItem( itemOrElm, index, config ) {

		console.log( 'dragon.addItem called, itemOrElm, index, config: ', itemOrElm, index, config, this );

		index = index || 0;

		let item, elm;

		if ( itemOrElm instanceof Item ) {

			itemOrElm.container = this;
			item = itemOrElm;
			elm = itemOrElm.elm;
		} else {

			item = new Item( this, itemOrElm, config );
			elm = itemOrElm;
		}

		this.items.splice( index, 0, item );
		this.itemsLookUp.splice( index, 0, elm );
		return this;
	}

	removeItem( itemOrElm ) {

		console.log( 'dragon.removeItem called, itemOrElm: ', itemOrElm, this );

		let index;

		if ( itemOrElm instanceof Item ) {

			itemOrElm.container = null;
			index = this.itemsLookUp.indexOf( itemOrElm.elm );
		} else {

			index = this.itemsLookUp.indexOf( itemOrElm );
		}

		this.items.splice( index, 1 );
		this.itemsLookUp.splice( index, 1 );
		return this;
	}

	initItems() {

		let self = this;

		toArray( this.elm.children ).forEach( function ( itemElm ) {
			self.addItem( itemElm );
		} );
	}

	getConfig( prop ) {

		console.log( 'container.getConfig called, prop', prop, this );

		prop = typeof this.config[ prop ] != 'undefined' ? this.config[ prop ] : this.dragon.getConfig( prop );
		return typeof prop == 'function' ? prop() : prop;
	}
}