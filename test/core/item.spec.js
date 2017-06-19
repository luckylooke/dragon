'use strict'

/* global describe, it, expect, it */

import Dragon from '../../packages/core/dragon.js'
import Container from '../../packages/core/container.js'
import Item from '../../packages/core/item.js'

describe( 'Item Spec', function () {

	it( 'should have been initialised properly', function () {
		// Arrange
		let div = document.createElement( 'div' )
		let itemElm = document.createElement( 'div' )

		div.appendChild( itemElm )
		document.body.appendChild( div )

		let dragon = new Dragon()
		let container = new Container( dragon, div )
		let item = new Item( container, itemElm )

		// Assert
		expect( item.id ).toBeDefined()
		expect( item.config ).toBeDefined()
		expect( item.container ).toEqual( container )
		expect( item.elm ).toEqual( itemElm )
	} )

	describe( 'item.grab', function () {

		it( 'should grab the item and return drag object', function () {

			// Arrange
			let div = document.createElement( 'div' )
			let itemElm = document.createElement( 'div' )

			div.appendChild( itemElm )
			document.body.appendChild( div )

			let dragon = new Dragon()
			let container = new Container( dragon, div )
			let item = new Item( container, itemElm )

			// Act
			let drag = item.grab()

			// Assert
			expect( drag.item ).toEqual( item )
			expect( drag.itemElm ).toEqual( itemElm )
			expect( drag.sourceContainer ).toEqual( container )
			expect( drag.source ).toEqual( div )
		} )
	} )

	describe( 'item.getConfig', function () {

		it( 'should return config value or container.config.value or dragon.config.value or dragon.default.value if not set by input config ', function () {
			// Arrange
			let div = document.createElement( 'div' )
			let itemElm = document.createElement( 'div' )

			div.appendChild( itemElm )
			document.body.appendChild( div )

			let dragon = new Dragon( { test: 'testVal' } )
			let container = new Container( dragon, div, { test2: 'testVal2' } )
			let item = new Item( container, itemElm, { test3: 'testVal3' } )

			// Act
			let configVal = item.getConfig( 'test' )
			let configVal2 = item.getConfig( 'test2' )
			let configVal3 = item.getConfig( 'test3' )

			// // Assert
			expect( configVal ).toEqual( 'testVal' )
			expect( configVal2 ).toEqual( 'testVal2' )
			expect( configVal3 ).toEqual( 'testVal3' )
		} )

		it( 'should return config value and get value from function if provided instead of value', function () {
			// Arrange
			let div = document.createElement( 'div' )
			let itemElm = document.createElement( 'div' )

			div.appendChild( itemElm )
			document.body.appendChild( div )

			let dragon = new Dragon()
			let container = new Container( dragon, div )
			let item = new Item( container, itemElm, { test: () => 'testVal' } )

			// Act
			let configVal = item.getConfig( 'test' )

			// // Assert
			expect( configVal ).toEqual( 'testVal' )
		} )
	} )


} )