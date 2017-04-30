import Drag from './drag';

export default class Item {

	constructor( container, elm, config ) {

		console.log( 'Item instance created, container, elm, config:', container, elm, config, this );

		if ( !config )
			config = {};

		this.config = config;
		this.id = config.id || 'containerID_' + Date.now();
		this.container = container;
		this.elm = elm;
	}

	grab( e ) {

		console.log( 'container.grab called, e:', e, this );

		this.drag = new Drag( e,  this, this.container );
		return this.drag;
	}

	getConfig( prop ) {

		console.log( 'item.getConfig called, prop', prop, this );

		prop = typeof this.config[prop] != 'undefined' ? this.config[prop] : this.container.getConfig( prop );
		return typeof prop == 'function' ? prop() : prop;
	}
}