import Item from './item'
import { decorator as middle } from 'middle.js'

export default class Container {

	constructor( dragon, elm, config ) {

		if ( !config )
			config = {}

		this.config = config
		this.id = config.id || 'containerID_' + Date.now()
		this.dragon = dragon
		this.utils = dragon.utils
		this.items = []
		this.elm = elm

		this._initItems()
	}

	@middle
	grab( itemElm ) {

		let item = this.items[ this.utils.getIndexByElm( this.items, itemElm ) ]
		return item ? item.grab() : null
	}

	_initItem( itemOrElm ) {

		this.addItem( itemOrElm, this.items.length, null, true )
	}

	@middle
	addItem( itemOrElm, index, config, init ) {

		index = index || 0

		let item

		if ( itemOrElm instanceof Item ) {

			itemOrElm.container = this
			item = itemOrElm
		} else {

			item = new Item( this, itemOrElm, config )
		}

		this.items.splice( index, 0, item )

		if ( !init && !this.elm.contains( item.elm ) ) {
			// sync DOM
			let reference = this.elm.children[ index ]

			if ( reference )
				this.elm.insertBefore( item.elm, reference )
			else
				this.elm.appendChild( item.elm )
		}

		return item
	}

	@middle
	removeItem( itemOrElm ) {

		let index
		let item

		if ( itemOrElm instanceof Item ) {

			itemOrElm.container = null
			index = this.items.indexOf( itemOrElm )
		} else {

			index = this.utils.getIndexByElm( this.items, itemOrElm )
		}

		item = this.items.splice( index, 1 )[0]

		if ( this.elm.contains( item.elm ) ) {
			// sync DOM
			this.elm.removeChild( item.elm )
		}

		return item
	}

	_initItems() {

		let arr = this.utils.toArray( this.elm.children )
		let len = arr.length

		for ( let i = 0; i < len; i++ ) {
			this._initItem( arr[ i ] )
		}
	}

	@middle
	getConfig( prop ) {

		prop = this.config.hasOwnProperty( prop ) ? this.config[ prop ] : this.dragon.getConfig( prop )
		return typeof prop == 'function' ? prop() : prop
	}
}