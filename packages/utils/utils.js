/* global global */
let doc = document
let docElm = doc.documentElement

export default {

	// getConfig: getConfig,
	// getImmediateChild: getImmediateChild,
	// getReference: getReference,
	// getCoord: getCoord,
	// getEventHost: getEventHost,
	// getOffset: getOffset,
	// getScroll: getScroll,
	// getElementBehindPoint: getElementBehindPoint,
	// getRectWidth: getRectWidth,
	// getRectHeight: getRectHeight,
	// getParent: getParent,
	// nextEl: nextEl,
	// toArray: toArray,
	// bind: bind,
	// domIndexOf: domIndexOf,
	// isInput: isInput,
	// isEditable: isEditable,
	// getIndexByElm: getIndexByElm,
	// ensureArray: ensureArray,
}

export function setConfig( parent, config ) {

	this.config = Object.assign( Object.create( parent.config ), config )
}

export function getConfig( prop ) {

	prop = this.config[ prop ]
	return typeof prop == 'function' ? prop( this ) : prop
}

export function getImmediateChild( dropTarget, target ) {

	let immediate = target

	while ( immediate !== dropTarget && getParent( immediate ) !== dropTarget ) {
		immediate = getParent( immediate )
	}

	if ( immediate === docElm ) {
		return null
	}

	return immediate
}

export function getReference( dropTarget, target, x, y, direction, abs ) {

	let horizontal = direction === 'horizontal'

	if ( abs ) {
		x = x - getScroll( 'scrollLeft', 'pageXOffset' )
		y = y - getScroll( 'scrollTop', 'pageYOffset' )
	}
	return target !== dropTarget ? inside() : outside() // reference

	function outside() { // slower, but able to figure out any position
		let len = dropTarget.children.length,
			i,
			el,
			rect

		for ( i = 0; i < len; i++ ) {

			el = dropTarget.children[ i ]
			rect = el.getBoundingClientRect()

			if ( horizontal && (rect.left + rect.width / 2) > x ) {
				return el
			}

			if ( !horizontal && (rect.top + rect.height / 2) > y ) {
				return el
			}
		}

		return null
	}

	function inside() { // faster, but only available if dropped inside a child element

		let rect = target.getBoundingClientRect()

		if ( horizontal ) {
			return resolve( x > rect.left + getRectWidth( rect ) / 2 )
		}

		return resolve( y > rect.top + getRectHeight( rect ) / 2 )
	}

	function resolve( after ) {

		return after ? nextEl( target ) : target
	}
}

export function getCoord( coord, e ) {

	let host = getEventHost( e )
	let missMap = {
		pageX: 'clientX', // IE8
		pageY: 'clientY' // IE8
	}

	if ( coord in missMap && !(coord in host) && missMap[ coord ] in host ) {
		coord = missMap[ coord ]
	}

	return host[ coord ]
}

export function getEventHost( e ) {

	// on touchend event, we have to use `e.changedTouches`
	// see http://stackoverflow.com/questions/7192563/touchend-event-properties
	// see github.com/bevacqua/dragula/issues/34
	if ( e.targetTouches && e.targetTouches.length ) {
		return e.targetTouches[ 0 ]
	}

	if ( e.changedTouches && e.changedTouches.length ) {
		return e.changedTouches[ 0 ]
	}

	return e
}

export function whichMouseButton (e) {

  // if (e.touches !== void 0) { return e.touches.length }
  if (e.touches !== void 0) { return 1 } // accept all touches
  if (e.which !== void 0 && e.which !== 0) { return e.which } // see github.com/bevacqua/dragula/issues/261
  if (e.buttons !== void 0) { return e.buttons }
  let button = e.button
  if (button !== void 0) { // see github.com/jquery/jquery/blob/99e8ff1baa7ae341e94bb89c3e84570c7c3ad9ea/src/event.js#L573-L575
    return button & 1 ? 1 : button & 2 ? 3 : (button & 4 ? 2 : 0)
  }
}

// get offset of element from top left corner of document
export function getOffset( el, size ) {

	let rect = el.getBoundingClientRect()
	let result = {
		left: rect.left + getScroll( 'scrollLeft', 'pageXOffset' ),
		top: rect.top + getScroll( 'scrollTop', 'pageYOffset' )
	}

	if ( size ) {

		result.width = getRectWidth( rect )
		result.height = getRectHeight( rect )
	}

	return result
}

export function getScroll( scrollProp, offsetProp ) {

	if ( typeof global[ offsetProp ] !== 'undefined' ) {
		return global[ offsetProp ]
	}

	if ( docElm.clientHeight ) {
		return docElm[ scrollProp ]
	}

	return doc.body[ scrollProp ]
}

export function getElementBehindPoint( elmToHide, x, y, abs ) {

	let state = elmToHide.className
	let el

	// hide elmToHide
	elmToHide.className += ' dragon-hide'
	// look at the position
	el = doc.elementFromPoint(
		abs ? x - getScroll( 'scrollLeft', 'pageXOffset' ) : x,
		abs ? y - getScroll( 'scrollTop', 'pageYOffset' ) : y
	)
	// show elmToHide back
	elmToHide.className = state

	return el
}

export function getRectWidth( rect ) {

	return rect.width || (rect.right - rect.left)
}

export function getRectHeight( rect ) {

	return rect.height || (rect.bottom - rect.top)
}

export function getParent( el ) {

	return el.parentNode === doc ? null : el.parentNode
}

export function nextEl( el ) {

	return el.nextElementSibling || manually()

	function manually() {
		let sibling = el
		do {
			sibling = sibling.nextSibling
		} while ( sibling && sibling.nodeType !== 1 )
		return sibling
	}
}

export function toArray( obj ) {

	return [].slice.call( obj )
}

export function ensureArray( it ) {

	if ( Array.isArray( it ) )

		return it

	else if ( it.length && it.length != 0 )

		return toArray( it )

	else

		return [ it ]
}

export function bind( obj, methodName ) {

	let bindedName = '_binded_' + methodName

	if ( !obj[ bindedName ] )
		obj[ bindedName ] = function () {
			return obj[ methodName ].apply( obj, arguments )
		}

	return obj[ bindedName ]
}

export function domIndexOf( parent, child ) {
	// Possible problems with IE8- ? https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/children#Browser_compatibility
	return Array.prototype.indexOf.call( parent.children, child )
}

export function isInput( el ) {
	return el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || isEditable( el )
}

export function isEditable( el ) {

	if ( !el ) {
		return false
	}
	// no parents were editable
	if ( el.contentEditable === 'false' ) {
		return false
	}
	// stop the lookup
	if ( el.contentEditable === 'true' ) {
		return true
	}
	// found a contentEditable element in the chain
	return isEditable( getParent( el ) ) // contentEditable is set to 'inherit'
}

export function getIndexByElm( sourceArray, elm ) {

	let len = sourceArray.length

	for ( let i = 0; i < len; i++ ) {

		if ( sourceArray[ i ].elm == elm )
			return i
	}

	return -1
}

export function hierarchySafe( fn, success, fail ) {

	try {
		// dom edit fn to protect
		fn()
		if ( success ) success()

	} catch( e ){
		// console.dir(e)
		if ( e.name !== 'HierarchyRequestError') // fixing: Uncaught DOMException: Failed to execute 'insertBefore' on 'Node': The new child element contains the parent.
			console.error( e ) // eslint-disable-line no-console

		if ( fail ) fail()
	}
}

