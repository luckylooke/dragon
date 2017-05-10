import Drag from './drag'
import { decorator as middle } from 'middle.js'

export default class Item {

	constructor( container, elm, config ) {

		if ( !config )
			config = {}

		this.config = config
		this.id = config.id || 'itemID_' + Date.now()
		this.container = container
		this.elm = elm
	}

	@middle
	grab( x, y ) {

		this.drag = new Drag( x, y, this )
		return this.drag
	}

	@middle
	getConfig( prop ) {

		prop = this.config.hasOwnProperty( prop ) ? this.config[ prop ] : this.container.getConfig( prop )
		return typeof prop == 'function' ? prop() : prop
	}
}