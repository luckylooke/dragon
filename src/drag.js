import touchy from './touchy'; // cross event
import classes from './classes'; // cross event
import {
	bind, nextEl, domIndexOf, getOffset, getCoord, getRectWidth, getRectHeight,
	getElementBehindPoint, getImmediateChild, getReference, getParent
} from './utils'; // cross event

let docElm = document.documentElement;

export default class Drag {

	constructor( e, item, container ) {

		console.log( 'Drag instance created, params:', e, item, container );

		// this.mirror; // mirror image
		// this.source; // source container element
		// this.source; // source Container object
		// this.itemElm; // item element being dragged
		// this.offsetX; // reference x
		// this.offsetY; // reference y
		// this.moveX; // reference move x
		// this.moveY; // reference move y
		// this.initialSibling; // reference sibling when grabbed
		// this.currentSibling; // reference sibling now
		// this.state; // holds Drag state (grabbed, dragging, dropped...)

		e.preventDefault(); // fixes github.com/bevacqua/dragula/issues/155
		this.moveX = e.clientX;
		this.moveY = e.clientY;

		console.log( '*** Changing state: ', this.state, ' -> grabbed' );
		this.state = 'grabbed';

		this.item = item;
		this.itemElm = item.elm;
		this.sourceContainer = container;
		this.source = container.elm;
		this.config = this.sourceContainer.config || {};
		this.config.mirrorContainer = this.config.mirrorContainer || document.body; // TODO: default config obj, initOptions from dragular
		//noinspection JSUnresolvedVariable
		this.dragon = this.sourceContainer.dragon;
		this.findDropTarget = this.dragon.findDropTarget.bind( this.dragon );

		this.events();
	}

	destroy() {

		console.log( 'Drag.destroy called' );

		this.release( {} );
	}

	events( remove ) {

		console.log( 'Drag.events called, "remove" param:', remove );

		let op = remove ? 'remove' : 'add';
		touchy( docElm, op, 'mouseup', bind( this, 'release' ) );
		touchy( docElm, op, 'mousemove', bind( this, 'drag' ) );
		touchy( docElm, op, 'selectstart', bind( this, 'protectGrab' ) ); // IE8
		touchy( docElm, op, 'click', bind( this, 'protectGrab' ) );
	}

	protectGrab( e ) {

		console.log( 'Drag.protectGrab called, e:', e );

		if ( this.state == 'grabbed' ) {
			e.preventDefault();
		}
	}

	drag( e ) {

		console.log( 'Drag.drag called, e:', e );

		if ( this.state == 'grabbed' ) {
			this.startByMovement( e );
			return;
		}
		if ( this.state !== 'moved' && this.state !== 'dragging' ) {
			this.cancel();
			return;
		}

		console.log( '*** Changing state: ', this.state, ' -> dragging' );
		this.state = 'dragging';

		e.preventDefault();

		let clientX = getCoord( 'clientX', e ),
			clientY = getCoord( 'clientY', e ),
			x = clientX - this.offsetX,
			y = clientY - this.offsetY,
			mirror = this.mirror;

		mirror.style.left = x + 'px';
		mirror.style.top = y + 'px';

		let elementBehindCursor = getElementBehindPoint( mirror, clientX, clientY ),
			dropTarget = this.findDropTarget( elementBehindCursor, clientX, clientY ),
			reference,
			immediate = getImmediateChild( dropTarget, elementBehindCursor );

		if ( immediate !== null ) {
			reference = getReference( dropTarget, immediate, clientX, clientY );
		} else {
			return;
		}
		if (
			reference === null ||
			reference !== this.itemElm &&
			reference !== nextEl( this.itemElm )
		) {
			this.currentSibling = reference;
			dropTarget.insertBefore( this.itemElm, reference );
		}
	}

	startByMovement( e ) {

		console.log( 'Drag.startByMovement called, e:', e );

		// if (whichMouseButton(e) === 0) {
		//   release({});
		//   return; // when text is selected on an input and then dragged, mouseup doesn't fire. this is our only hope
		// }

		// truthy check fixes github.com/bevacqua/dragula/issues/239, equality fixes github.com/bevacqua/dragula/issues/207
		if ( e.clientX !== void 0 && e.clientX === this.moveX && e.clientY !== void 0 && e.clientY === this.moveY ) {
			return;
		}

		this.initialSibling = this.currentSibling = nextEl( this.itemElm );

		let offset = getOffset( this.itemElm );
		this.offsetX = getCoord( 'pageX', e ) - offset.left;
		this.offsetY = getCoord( 'pageY', e ) - offset.top;

		classes.add( this.itemElm, 'gu-transit' );
		this.renderMirrorImage( this.config.mirrorContainer );

		console.log( '*** Changing state: ', this.state, ' -> moved' );
		this.state = 'moved';
	}

	renderMirrorImage( mirrorContainer ) {

		console.log( 'Drag.renderMirrorImage called, e:', mirrorContainer );

		let rect = this.itemElm.getBoundingClientRect();
		let mirror = this.mirror = this.itemElm.cloneNode( true );

		mirror.style.width = getRectWidth( rect ) + 'px';
		mirror.style.height = getRectHeight( rect ) + 'px';
		classes.rm( mirror, 'gu-transit' );
		classes.add( mirror, 'gu-mirror' );
		mirrorContainer.appendChild( mirror );
		classes.add( mirrorContainer, 'gu-unselectable' );
	}

	removeMirrorImage() {

		let mirrorContainer = getParent( this.mirror );
		classes.rm( mirrorContainer, 'gu-unselectable' );
		mirrorContainer.removeChild( this.mirror );
	}

	release( e ) {

		console.log( 'Drag.release called, e:', e );

		touchy( docElm, 'remove', 'mouseup', this.release );

		let clientX = getCoord( 'clientX', e );
		let clientY = getCoord( 'clientY', e );

		let elementBehindCursor = getElementBehindPoint( this.mirror, clientX, clientY );
		let dropTarget = this.findDropTarget( elementBehindCursor, clientX, clientY );
		if ( dropTarget && dropTarget !== this.source ) {
			this.drop( dropTarget );
		} else {
			this.cancel();
		}
	}

	drop( dropTarget ) {

		console.log( 'Drag.drop called' );
		if ( this.state != 'dragging' )
			return;

		let container = this.dragon.getContainer( dropTarget );
		container.addItem( this.item, domIndexOf( dropTarget, this.itemElm ) );

		console.log( '*** Changing state: ', this.state, ' -> dropped' );
		this.state = 'dropped';

		this.cleanup();
	}

	remove() {

		console.log( 'Drag.remove called' );

		if ( this.state !== 'dragging' )
			return;

		console.log( '*** Changing state: ', this.state, ' -> dragging' );
		this.state = 'removed';

		let parent = getParent( this.itemElm );
		if ( parent ) {
			parent.removeChild( this.itemElm );
		}
		this.cleanup();
	}

	cancel( reverts ) {

		console.log( 'Drag.cancel called, reverts:', reverts );

		if ( this.state == 'dragging' ) {
			let parent = getParent( this.itemElm );
			let initial = this.isInitialPlacement( parent );
			if ( initial === false && reverts ) {
				this.source.insertBefore( this.itemElm, this.initialSibling );
			}
		}

		console.log( '*** Changing state: ', this.state, ' -> cancelled' );
		this.state = 'cancelled';

		this.cleanup();
	}

	cleanup() {

		console.log( 'Drag.cleanup called' );

		this.events( 'remove' );

		if ( this.mirror )
			this.removeMirrorImage();

		if ( this.itemElm ) {
			classes.rm( this.itemElm, 'gu-transit' );
		}

		console.log( '*** Changing state: ', this.state, ' -> cleaned' );
		this.state = 'cleaned';
	}

	isInitialPlacement( target, s ) {

		let sibling;
		if ( s !== void 0 ) {
			sibling = s;
		} else if ( this.mirror ) {
			sibling = this.currentSibling;
		} else {
			sibling = nextEl( this.itemElm );
		}
		return target === this.source && sibling === this.initialSibling;
	}
}
