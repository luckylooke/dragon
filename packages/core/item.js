import { decorator as middle } from 'middle.js'

export default class Item {

	constructor( container, elm, config ) {

		if ( !config )
			config = {}

		this.id = config.id || 'itemID_' + Date.now()
		this.container = container
		this.Drag = container.Drag
		this.utils = container.utils
    this.setConfig = this.utils.setConfig.bind( this, container )
    this.setConfig( config )
		this.getConfig = this.utils.getConfig.bind( this )
		this.elm = elm
	}

	@middle
	grab() {

		this.drag = this.createDrag( this, this.config.dragConf )
		return this.drag
	}

	@middle
	createDrag( item, config ) {
		return new this.Drag( item, config )
	}
}
