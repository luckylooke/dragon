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

		this.id = 'dragID_' + Date.now()
		this.state = 'grabbed'
		this.item = item
		this.itemElm = item.elm
		this.sourceContainer = item.container
		this.source = item.container.elm
		this.dragon = this.sourceContainer.dragon
		this.utils = this.dragon.utils
		this.domEventManager = this.dragon.domEventManager
		this.domClassManager = this.dragon.domClassManager
		this.findDropTarget = this.dragon.findDropTarget.bind( this.dragon )

		if ( this.getConfig( 'mouseEvents' ) )
			this.mouseEvents()
	}

	@middle
	destroy() {

		this.release( this.x, this.y )
	}

	@middle
	mouseEvents( remove ) {

		if ( !this._mousemove ) // if not initialised yet
		// use requestAnimationFrame while dragging if available
			if ( window.requestAnimationFrame ) {

				this.move_e = null
				this._mousemove = this._mousemoveAF
			}
			else
				this._mousemove = this.mousemove

		let op = remove ? 'remove' : 'add'
		this.domEventManager( docElm, op, 'mouseup', this.utils.bind( this, 'mouseup' ) )
		this.domEventManager( docElm, op, 'mousemove', this.utils.bind( this, '_mousemove' ) )
		this.domEventManager( docElm, op, 'selectstart', this.utils.bind( this, 'protectGrab' ) ) // IE8
		this.domEventManager( docElm, op, 'click', this.utils.bind( this, 'protectGrab' ) )
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
			this.utils.getCoord( 'clientX', e ),
			this.utils.getCoord( 'clientY', e )
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

		let offset = this.utils.getOffset( this.itemElm )

		this.start(
			this.utils.getCoord( 'pageX', e ) - offset.left,
			this.utils.getCoord( 'pageY', e ) - offset.top
		)
	}

	@middle
	start( x, y ) {

		if ( this.state != 'grabbed' )
			return

		x = x || 0
		y = y || 0

		this._cachedAbs = this.getConfig( 'mirrorAbsolute' )
		this._cachedDir = this.getConfig( 'direction' )

		let itemPosition = this._cachedAbs ? this.utils.getOffset( this.itemElm ) : this.itemElm.getBoundingClientRect()

		if ( this.x == undefined )
			this.x = itemPosition.left + x

		if ( this.y == undefined )
			this.y = itemPosition.top + y

		// offset of mouse event from top left corner of the itemElm
		this.itemOffsetX = x
		this.itemOffsetY = y

		this.initialSibling = this.currentSibling = this.utils.nextEl( this.itemElm )
		this.domClassManager.add( this.itemElm, 'gu-transit' )
		this.renderMirrorImage( this.itemElm, this.getConfig( 'mirrorContainer' ) )

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

		let elementBehindPoint = this.utils.getElementBehindPoint( mirror, x, y, this._cachedAbs )
		let dropTarget = this.findDropTarget( elementBehindPoint )
		let reference
		let immediate = dropTarget && this.utils.getImmediateChild( dropTarget, elementBehindPoint )

		if ( immediate ) {

			reference = this.utils.getReference( dropTarget, immediate, x, y, this._cachedDir, this._cachedAbs )
		}
		else {

			return
		}

		if (

			reference === null ||
			reference !== this.itemElm &&
			reference !== this.utils.nextEl( this.itemElm )
		) {

			this.currentSibling = reference
			dropTarget.insertBefore( this.itemElm, reference )
		}
	}

	@middle
	renderMirrorImage( itemElm, mirrorContainer ) {

		let rect = itemElm.getBoundingClientRect()
		let mirror = itemElm.cloneNode( true )

		mirror.style.width = this.utils.getRectWidth( rect ) + 'px'
		mirror.style.height = this.utils.getRectHeight( rect ) + 'px'
		this.domClassManager.rm( mirror, 'gu-transit' )

		if ( this.getConfig( 'mirrorAbsolute' ) )

			this.domClassManager.add( mirror, 'gu-mirror-abs' )
		else
			this.domClassManager.add( mirror, 'gu-mirror' )

		mirrorContainer.appendChild( mirror )
		this.domClassManager.add( mirrorContainer, 'gu-unselectable' )

		this.mirror = mirror
	}

	@middle
	removeMirrorImage() {

		let mirrorContainer = this.utils.getParent( this.mirror )
		this.domClassManager.rm( mirrorContainer, 'gu-unselectable' )
		mirrorContainer.removeChild( this.mirror )
		this.mirror = null
	}

	@middle
	mouseup( e ) {

		this.release(
			this.utils.getCoord( 'clientX', e ),
			this.utils.getCoord( 'clientY', e )
		)
	}

	@middle
	release( x, y ) {

		if ( x == undefined )
			x = this.x

		if ( y == undefined )
			y = this.y

		if ( this.state != 'dragging' )
			return this.cancel()

		// if requestAnimationFrame mode is used, cancel latest request
		if ( this.actualFrame ) {
			window.cancelAnimationFrame( this.actualFrame )
			this.actualFrame = false
		}

		let elementBehindPoint = this.utils.getElementBehindPoint( this.mirror, x, y, this._cachedAbs )
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
		container.addItem( this.item, this.utils.domIndexOf( dropTarget, this.itemElm ) )
		this.state = 'dropped'

		this.cleanup()
	}

	@middle
	remove() {

		if ( this.state != 'dragging' )
			return

		let parent = this.utils.getParent( this.itemElm )
		if ( parent ) {
			parent.removeChild( this.itemElm )
		}

		this.state = 'removed'

		this.cleanup()
	}

	@middle
	cancel( reverts ) {

		if ( this.state == 'dragging' ) {

			let parent = this.utils.getParent( this.itemElm )
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
			this.removeMirrorImage()

		if ( this.itemElm ) {
			this.domClassManager.rm( this.itemElm, 'gu-transit' )
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

			sibling = this.utils.nextEl( this.itemElm )
		}

		return target === this.source && sibling === this.initialSibling
	}

	@middle
	getConfig( prop ) {

		return this.item.getConfig( prop )
	}
}
