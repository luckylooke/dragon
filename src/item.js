import Drag from './drag';
import { decorator as middle } from 'middle.js';

export default class Item {

	constructor( container, elm, config ) {

		if ( !config )
			config = {};

		this.config = config;
		this.id = config.id || 'containerID_' + Date.now();
		this.container = container;
		this.elm = elm;
	}

	@middle
	grab( e ) {

		this.drag = new Drag( e,  this, this.container );
		return this.drag;
	}

	@middle
	getConfig( prop ) {

		prop = typeof this.config[prop] != 'undefined' ? this.config[prop] : this.container.getConfig( prop );
		return typeof prop == 'function' ? prop() : prop;
	}
}