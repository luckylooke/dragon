import Item from './item'
import { toArray, lookUpByElm } from './utils'
import { decorator as middle } from 'middle.js'

export default class Container {

	constructor( dragon, elm, config ) {

		if ( !config )
			config = {}

		this.config = config
		this.id = config.id || 'containerID_' + Date.now()
		this.dragon = dragon
		this.items = []
		this.elm = elm

		this.initItems()
	}

	@middle
	grab( x, y, itemElm ) {

		return this.items[ lookUpByElm( this.items, itemElm ) ].grab( x, y )
	}

	@middle
	addItem( itemOrElm, index, config ) {

		index = index || 0

		let item

		if ( itemOrElm instanceof Item ) {

			itemOrElm.container = this
			item = itemOrElm
		} else {

			item = new Item( this, itemOrElm, config )
		}

		this.items.splice( index, 0, item )
		return this
	}

	@middle
	removeItem( itemOrElm ) {

		let index

		if ( itemOrElm instanceof Item ) {

			itemOrElm.container = null
			index = this.items.indexOf( itemOrElm )
		} else {

			index = lookUpByElm( this.items, itemOrElm )
		}

		this.items.splice( index, 1 )
		return this
	}

	@middle
	initItems() {

		let arr = toArray( this.elm.children )
		let len = arr.length

		for ( let i = 0; i < len; i++ ) {
			this.addItem( arr[ i ] )
		}
	}

	@middle
	getConfig( prop ) {

		prop = this.config.hasOwnProperty( prop ) ? this.config[ prop ] : this.dragon.getConfig( prop )
		return typeof prop == 'function' ? prop() : prop
	}
}