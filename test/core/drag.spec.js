'use strict'

/* global describe, it, expect, it, spyOn */

import Dragon from '../../packages/core/dragon.js'
import Container from '../../packages/core/container.js'
import Item from '../../packages/core/item.js'
import Drag from '../../packages/core/drag.js'
import crossvent from 'crossvent'
import * as utils from '../../packages/utils/utils'
import touchy from '../../packages/touchy/touchy'
import classes from '../../packages/dom-classes/classes'

describe( 'Drag Spec', function () {

	// Arrange
	let div = document.createElement( 'div' )
	let itemElm = document.createElement( 'div' )

	div.appendChild( itemElm )
	document.body.appendChild( div )

	let dragon = new Dragon( {}, utils, touchy, classes )
	let container = new Container( dragon, div )
	let item = new Item( container, itemElm )
	let drag = new Drag( item )

	it( 'should have been initialised properly', function () {

		// Assert
		expect( drag.id ).toBeDefined()
		expect( drag.state ).toEqual( 'grabbed' )
		expect( drag.item ).toEqual( item )
		expect( drag.itemElm ).toEqual( itemElm )
		expect( drag.sourceContainer ).toEqual( container )
		expect( drag.source ).toEqual( div )
		expect( drag.dragon ).toEqual( dragon )
		expect( drag.findDropTarget ).toBeDefined()
	} )

	describe( 'item.mouseEvents', function () {

		it( 'should add/remove drag mouse event listeners on document element', function () {

			// Arrange
			let spy = spyOn( drag, 'mouseup' )
			// let spy2 = spyOn( drag, 'mousemove' )
			let spy3 = spyOn( drag, 'protectGrab' )

			let el = document.createElement( 'div' )
			el.setAttribute( 'onselectstart', 'return;' )
			let isSelectSupported = typeof el.onclick == 'function'

			// Act
			crossvent.fabricate( document.body, 'mouseup' )
			// crossvent.fabricate( document.body, 'mousemove' )
			crossvent.fabricate( document.body, 'click' )

			if ( isSelectSupported )
				crossvent.fabricate( document.body, 'selectstart' )

			// Assert
			expect( spy ).toHaveBeenCalled()
			// expect( spy2 ).toHaveBeenCalled()
			expect( spy3 ).toHaveBeenCalledTimes( isSelectSupported ? 2 : 1 )

			// Act
			drag.mouseEvents( 'remove' )

			// Act
			crossvent.fabricate( document.body, 'mouseup' )
			// crossvent.fabricate( document.body, 'mousemove' )
			crossvent.fabricate( document.body, 'click' )

			// Assert
			expect( spy ).toHaveBeenCalledTimes( 1 )
			// expect( spy2 ).toHaveBeenCalledTimes( 1 )
			expect( spy3 ).toHaveBeenCalledTimes( isSelectSupported ? 2 : 1 )
			// Act
			drag.mouseEvents() // add

			// Act
			crossvent.fabricate( document.body, 'mouseup' )
			// crossvent.fabricate( document.body, 'mousemove' )
			crossvent.fabricate( document.body, 'click' )

			// Assert
			expect( spy ).toHaveBeenCalledTimes( 2 )
			// expect( spy2 ).toHaveBeenCalledTimes( 2 )
			expect( spy3 ).toHaveBeenCalledTimes( isSelectSupported ? 4 : 2 )
		} )
	} )

	describe( 'item.protectGrab', function () {

		it( 'it should preventDefault on provided event if state of the drag is "grabbed" ', function () {

			// Arrange
			let mockEvent = {
				preventDefault: () => ''
			}
			let spy = spyOn( mockEvent, 'preventDefault' )

			// Act
			drag.protectGrab( mockEvent )

			// Assert
			expect( spy ).toHaveBeenCalled()
		} )
	} )

	describe( 'item.renderMirrorImage', function () {

		it( 'it should render mirror image', function () {

			// Arrange
			let itemElm = document.createElement( 'div' )
			let containerElm = document.createElement( 'div' )

			containerElm.appendChild( itemElm )
			containerElm.className = 'test'

			// Act
			drag.renderMirrorImage( itemElm, document.body )
			let testElm = document.getElementsByClassName( 'test' )[0] // containerElm is not appended into document

			// Assert
			expect( drag.mirror ).toBeDefined()
			expect( testElm ).not.toEqual( containerElm )
			expect( testElm.className ).toEqual( 'test gu-mirror' )
			expect( document.body.className ).toEqual( 'gu-unselectable' )
		} )
	} )

	describe( 'item.removeMirrorImage', function () {

		it( 'it should remove mirror image', function () {

			// Arrange
			let itemElm = document.createElement( 'div' )
			let containerElm = document.createElement( 'div' )

			containerElm.appendChild( itemElm )
			containerElm.className = 'test'

			drag.renderMirrorImage( itemElm, document.body )

			// Act
			drag.removeMirrorImage()

			// Assert
			expect( drag.mirror ).toBeNull()
			expect( document.body.className ).toEqual( '' )
		} )
	} )

	describe( 'drag.getConfig', function () {

		it( 'should return item config value', function () {
			// Arrange
			let div = document.createElement( 'div' )
			let itemElm = document.createElement( 'div' )

			div.appendChild( itemElm )
			document.body.appendChild( div )

			let dragon = new Dragon( { test: 'testVal' }, utils, touchy, classes )
			let container = new Container( dragon, div, { test2: 'testVal2' } )
			let item = new Item( container, itemElm, { test3: 'testVal3' } )
			let drag = item.grab()

			// Act
			let configVal = drag.getConfig( 'test' )
			let configVal2 = drag.getConfig( 'test2' )
			let configVal3 = drag.getConfig( 'test3' )

			// // Assert
			expect( configVal ).toEqual( 'testVal' )
			expect( configVal2 ).toEqual( 'testVal2' )
			expect( configVal3 ).toEqual( 'testVal3' )
		} )
	} )


} )