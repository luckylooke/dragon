import Item from './item';
import { toArray } from './utils';
import { decorator as middle } from 'middle.js';

export default class Container {

	constructor( dragon, elm, config ) {

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

	@middle
	grab( e, itemElm ) {

		return this.items[ this.itemsLookUp.indexOf( itemElm ) ].grab( e );
	}

	@middle
	addItem( itemOrElm, index, config ) {

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

	@middle
	removeItem( itemOrElm ) {

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

	@middle
	initItems() {

		let self = this;

		toArray( this.elm.children ).forEach( function ( itemElm ) {
			self.addItem( itemElm );
		} );
	}

	@middle
	getConfig( prop ) {

		if ( !prop )
			return this.config;

		prop = this.config.hasOwnProperty( prop ) ? this.config[ prop ] : this.dragon.getConfig( prop );
		return typeof prop == 'function' ? prop() : prop;
	}
}