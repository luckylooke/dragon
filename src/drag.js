import touchy from './touchy' // cross event
import classes from './classes' // cross event
import {
	bind, nextEl, domIndexOf, getOffset, getCoord, getRectWidth, getRectHeight,
	getElementBehindPoint, getImmediateChild, getReference, getParent
} from './utils' // cross event
import { decorator as middle } from 'middle.js'

let docElm = document.documentElement

export default class Drag {

	constructor( item ) {

		// this.mirror // mirror image
		// this.source // source container element
		// this.source // source Container object
		// this.itemElm // item element being dragged
		// this.itemOffsetX // reference x offset event from itemElement corner
		// this.itemOffsetY // reference y
		// this.x // reference move x - by default clientX + mirrorContainer.scrollX of first event occurrence starting the drag
		// this.y // reference move y
		// this.initialSibling // reference sibling when grabbed
		// this.currentSibling // reference sibling now
		// this.state // holds Drag state (grabbed, dragging, dropped...)

		this.state = 'grabbed'
		this.item = item
		this.itemElm = item.elm
		this.sourceContainer = item.container
		this.source = item.container.elm
		this.dragon = this.sourceContainer.dragon
		this.findDropTarget = this.dragon.findDropTarget.bind( this.dragon )

		// use requestAnimationFrame while dragging if available
		if ( window.requestAnimationFrame ) {

			this._mousemove = this._mousemoveAF
			this.move_e = false
		}
		else
			this._mousemove = this.mousemove

		if ( this.getConfig( 'mouseEvents' ) )
			this.mouseEvents()
	}

	@middle
	destroy() {

		this.release( this.x, this.y )
	}

	@middle
	mouseEvents( remove ) {

		let op = remove ? 'remove' : 'add'
		touchy( docElm, op, 'mouseup', bind( this, 'mouseup' ) )
		touchy( docElm, op, 'mousemove', bind( this, '_mousemove' ) )
		touchy( docElm, op, 'selectstart', bind( this, 'protectGrab' ) ) // IE8
		touchy( docElm, op, 'click', bind( this, 'protectGrab' ) )
	}

	@middle
	protectGrab( e ) {

		if ( this.state == 'grabbed' ) {
			e.preventDefault()
		}
	}

	@middle
	mousemove( e ) {

		if ( !e.target ) {

			e = this.move_e
			this.move_e = false
		}

		if ( this.state == 'grabbed' ) {

			this.startByMouseMove( e )
			return
		}

		if ( this.state != 'dragging' ) {

			this.cancel()
			return
		}

		e.preventDefault()

		this.drag(
			getCoord( 'clientX', e ),
			getCoord( 'clientY', e )
		)
	}

	_mousemoveAF( e ) {

		if ( !this.move_e )
			this.actualFrame = window.requestAnimationFrame( this.mousemove )

		this.move_e = e
	}

	@middle
	startByMouseMove( e ) {

		// if (whichMouseButton(e) === 0) {
		//   release({})
		//   return // when text is selected on an input and then dragged, mouseup doesn't fire. this is our only hope
		// }

		if ( this.x == undefined ) {

			this.x = e.clientX
			this.y = e.clientY
			return
		}

		// truthy check fixes github.com/bevacqua/dragula/issues/239, equality fixes github.com/bevacqua/dragula/issues/207
		if ( e.clientX !== void 0 && e.clientX === this.x && e.clientY !== void 0 && e.clientY === this.y )
			return

		let offset = getOffset( this.itemElm )

		this.start(
			getCoord( 'pageX', e ) - offset.left,
			getCoord( 'pageY', e ) - offset.top
		)
	}

	@middle
	start( x, y ) {

		if ( this.state != 'grabbed' )
			return

		let itemPosition = this.getConfig( 'mirrorAbsolute' ) ? getOffset( this.itemElm ) : this.itemElm.getBoundingClientRect()

		if ( this.x == undefined )
			this.x = itemPosition.left

		if ( this.y == undefined )
			this.y = itemPosition.top

		// offset of mouse event from top left corner of the itemElm
		this.itemOffsetX = x || 0
		this.itemOffsetY = y || 0

		this.initialSibling = this.currentSibling = nextEl( this.itemElm )
		classes.add( this.itemElm, 'gu-transit' )
		this.mirror = this.renderMirrorImage( this.itemElm, this.getConfig( 'mirrorContainer' ) )

		this.state = 'dragging'
	}

	@middle
	drag( x, y ) {

		if ( this.state != 'dragging' )
			return

		let mirrorX = x - this.itemOffsetX
		let mirrorY = y - this.itemOffsetY
		let mirror = this.mirror

		this.x = x
		this.y = y

		mirror.style.left = mirrorX + 'px'
		mirror.style.top = mirrorY + 'px'

		let elementBehindPoint = getElementBehindPoint( mirror, x, y )
		let dropTarget = this.findDropTarget( elementBehindPoint )
		let reference
		let immediate = dropTarget && getImmediateChild( dropTarget, elementBehindPoint )

		if ( immediate ) {

			reference = getReference( dropTarget, immediate, x, y )
		}
		else {

			return
		}

		if (

			reference === null ||
			reference !== this.itemElm &&
			reference !== nextEl( this.itemElm )
		) {

			this.currentSibling = reference
			dropTarget.insertBefore( this.itemElm, reference )
		}
	}

	@middle
	renderMirrorImage( itemElm, mirrorContainer ) {

		let rect = itemElm.getBoundingClientRect()
		let mirror = itemElm.cloneNode( true )

		mirror.style.width = getRectWidth( rect ) + 'px'
		mirror.style.height = getRectHeight( rect ) + 'px'
		classes.rm( mirror, 'gu-transit' )

		if ( this.getConfig( 'mirrorAbsolute' ) )

			classes.add( mirror, 'gu-mirror-abs' )
		else
			classes.add( mirror, 'gu-mirror' )

		mirrorContainer.appendChild( mirror )
		classes.add( mirrorContainer, 'gu-unselectable' )

		return mirror
	}

	@middle
	removeMirrorImage( mirror ) {

		let mirrorContainer = getParent( mirror )
		classes.rm( mirrorContainer, 'gu-unselectable' )
		mirrorContainer.removeChild( mirror )
	}

	@middle
	mouseup( e ) {

		this.release(
			getCoord( 'clientX', e ),
			getCoord( 'clientY', e )
		)
	}

	@middle
	release( x, y ) {

		if ( this.state != 'dragging' )
			return this.cancel()

		// if requestAnimationFrame mode is used, cancel latest request
		if ( this.actualFrame ) {
			window.cancelAnimationFrame( this.actualFrame )
			this.actualFrame = false
		}

		let elementBehindPoint = getElementBehindPoint( this.mirror, x, y )
		let dropTarget = this.findDropTarget( elementBehindPoint )

		if ( dropTarget && dropTarget !== this.source ) {

			this.drop( dropTarget )
		}
		else {

			this.cancel()
		}
	}

	@middle
	drop( dropTarget ) {

		if ( this.state != 'dragging' )
			return

		let container = this.dragon.getContainer( dropTarget )
		container.addItem( this.item, domIndexOf( dropTarget, this.itemElm ) )
		this.state = 'dropped'

		this.cleanup()
	}

	@middle
	remove() {

		if ( this.state != 'dragging' )
			return

		let parent = getParent( this.itemElm )
		if ( parent ) {
			parent.removeChild( this.itemElm )
		}

		this.state = 'removed'

		this.cleanup()
	}

	@middle
	cancel( reverts ) {

		if ( this.state == 'dragging' ) {

			let parent = getParent( this.itemElm )
			let initial = this.isInitialPlacement( parent )
			if ( initial === false && reverts ) {
				this.source.insertBefore( this.itemElm, this.initialSibling )
			}
		}

		this.state = 'cancelled'

		this.cleanup()
	}

	@middle
	cleanup() {

		this.mouseEvents( 'remove' )

		if ( this.mirror )
			this.removeMirrorImage( this.mirror )

		if ( this.itemElm ) {
			classes.rm( this.itemElm, 'gu-transit' )
		}
	}

	@middle
	isInitialPlacement( target, s ) {

		let sibling

		if ( s !== void 0 ) {

			sibling = s
		}
		else if ( this.mirror ) {

			sibling = this.currentSibling
		}
		else {

			sibling = nextEl( this.itemElm )
		}

		return target === this.source && sibling === this.initialSibling
	}

	@middle
	getConfig( prop ) {

		return this.item.getConfig( prop )
	}
}
