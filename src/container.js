import Drag from './drag';

export default class Container {

	constructor( dragon, elm ) {

		console.log( 'Container instance created, elm:', elm );

		//noinspection JSUnresolvedVariable
		this.id = elm.id || 'containerID_' + this.getID();
		//noinspection JSUnresolvedVariable
		this.dragon = dragon;
		this.drags = [];
		/** @property this.elm
		 * @interface */
		this.elm = elm;
	}

	grab( e, item ) {
		console.log( 'container.grab called' );
		this.drags.push( new Drag( e, item, this ) );
	}
}