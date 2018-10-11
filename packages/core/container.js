import { decorator as middle } from 'middle.js'

export default class Container {

	constructor( dragon, elm, config ) {

		if ( !config )
			config = {}

		this.id = config.id || 'containerID_' + Date.now()
    this.utils = dragon.utils
		this.Item = dragon.Item
		this.Drag = dragon.Drag
    this.setConfig = this.utils.setConfig.bind( this, dragon )
    this.setConfig( config )
		this.getConfig = this.utils.getConfig.bind( this )

		this.dragon = dragon
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

		this.addItem( itemOrElm, this.items.length, this.config.itemConf, true )
	}

	@middle
	addItem( itemOrElm, index, config, init ) {

		index = index || 0

		let item

		if ( itemOrElm instanceof this.Item ) {

			itemOrElm.container = this
			item = itemOrElm
		} else {

			item = this.createItem( this, itemOrElm, config || this.config.itemConf )
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
	createItem( container, itemOrElm, config ) {
    return new this.Item( container, itemOrElm, config )
  }

	@middle
	removeItem( itemOrElm ) {

		let index
		let item

		if ( itemOrElm instanceof this.Item ) {

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
}
