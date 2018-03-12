import Drag from './drag'
import { decorator as middle } from 'middle.js'

export default class Item {

	constructor( container, elm, config ) {

		if ( !config )
			config = {}

		this.Drag = Drag
		this.id = config.id || 'itemID_' + Date.now()
		this.container = container
		this.utils = container.utils
    this.setConfig = this.utils.setConfig.bind( this, container )
    this.setConfig( config )
		this.getConfig = this.utils.getConfig.bind( this )
		this.elm = elm
	}

	@middle
	grab() {

		this.drag = new this.Drag( this )
		return this.drag
	}
}
