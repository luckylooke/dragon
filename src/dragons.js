import { getParent } from './utils';
import Dragon from './dragon';


let doc = document;
let id = 1;

export default class Dragons {

	constructor( options ) {
		if ( !options )
			options = {};

		if ( !options.id )
			options.id = 'dragonsID_' + id++;

		this.defaults = {
			mirrorContainer: doc.body
		};
		this.options = Object.assign( {}, this.defaults, options );

		this.containersLookup = [];
		this.containers = [];
		this.members = []; // dragons
	}

	dragon( options ) {
		if ( !options.id )
			options.id = 'dragonID_' + id++;
		let dragon = new Dragon( this, options );
		this.members.push( dragon );
		return dragon;
	}

	isContainer( el ) {
		console.log( 'dragons.isContainer called, el:', el, this.containersLookup );
		return this.containersLookup.indexOf( el ) != -1;
	}

	getContainer( el ) {
		return this.containers[ this.containersLookup.indexOf( el ) ];
	}

	grab( e ) {
		console.log( 'grab called, e:', e );

		let item = e.target;
		let source;
		let container;
		let index;

		// if (isInput(item)) { // see also: github.com/bevacqua/dragula/issues/208
		//   e.target.focus(); // fixes github.com/bevacqua/dragula/issues/176
		//   return;
		// }

		while ( getParent( item ) && !this.isContainer( getParent( item ), item, e ) ) {
			item = getParent( item ); // drag target should be a top element
		}
		source = getParent( item );
		if ( !source ) {
			return;
		}

		index = this.containersLookup.indexOf( source );
		container = this.containers[ index ];
		container.grab( e, item, source );
	}
}