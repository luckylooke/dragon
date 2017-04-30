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

		this.items[ this.itemsLookUp.indexOf( itemElm ) ].grab( e );
	}

	addItem( item, index ) {

		console.log( 'dragon.addItem called config: ', config, this );

		this.items.splice( index, 0, item );
	}

	addItemElm( elm, config ) {

		console.log( 'container.item called, elm, config', elm, config, this );

		let item = new Item( this, elm, config );
		this.items.push( item );
		this.itemsLookUp.push( elm );
	}

	initItems() {

		var self = this;

		toArray( this.elm.children ).forEach( function ( itemElm ) {
			self.addItemElm( itemElm );
		});
	}

	getConfig( prop ) {

		console.log( 'container.getConfig called, prop', prop, this );

		prop = typeof this.config[ prop ] != 'undefined' ? this.config[ prop ] : this.dragon.getConfig( prop );
		return typeof prop == 'function' ? prop() : prop;
	}
}