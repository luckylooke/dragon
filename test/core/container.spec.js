'use strict'

/* global describe, it, expect, it */

import Dragon from '../../packages/core/dragon.js'
import Container from '../../packages/core/container.js'

describe( 'Container Spec', function () {

	it( 'should have been initialised properly', function () {
		// Arrange
		let div = document.createElement( 'div' )
		let dragon = new Dragon()
		let container = new Container( dragon, div )

		// Assert
		expect( container.id ).toBeDefined()
		expect( container.config ).toBeDefined()
		expect( container.dragon ).toEqual( dragon )
		expect( container.elm ).toEqual( div )
	} )

	describe( 'container.addItem', function () {

		it( 'should add new item to the container', function () {

			// Arrange
			let div = document.createElement( 'div' )
			let itemElm = document.createElement( 'div' )
			let itemElm1 = document.createElement( 'div' )
			let itemElm2 = document.createElement( 'div' )
			let dragon = new Dragon()

			div.appendChild( itemElm )
			div.appendChild( itemElm1 )
			document.body.appendChild( div )
			let container = new Container( dragon, div )

			// Act
			container.addItem( itemElm1 )
			container.addItem( itemElm2 )

			// Assert
			expect( container.items[ 0 ].elm ).toEqual( itemElm )
			expect( container.items[ 1 ].elm ).toEqual( itemElm1 )
			expect( container.items[ 2 ].elm ).toEqual( itemElm2 )
		} )
	} )

	describe( 'container.removeItem', function () {

		it( 'should remove item to the container', function () {

			// Arrange
			let div = document.createElement( 'div' )
			let itemElm = document.createElement( 'div' )
			let itemElm1 = document.createElement( 'div' )
			let itemElm2 = document.createElement( 'div' )
			let dragon = new Dragon()

			div.appendChild( itemElm )
			div.appendChild( itemElm1 )
			document.body.appendChild( div )
			let container = new Container( dragon, div )
			container.addItem( itemElm1 )
			container.addItem( itemElm2 )

			// Act
			container.removeItem( itemElm1 )

			// Assert
			expect( container.items[ 0 ].elm ).toEqual( itemElm )
			expect( container.items[ 1 ].elm ).toEqual( itemElm2 )

			// Act
			container.removeItem( container.items[ 0 ] )

			// Assert
			expect( container.items[ 0 ].elm ).toEqual( itemElm2 )
		} )
	} )

	describe( 'container.grab', function () {

		it( 'should grab the itemElm if it is valid itemElm of the container', function () {
			// Arrange
			// Arrange
			let div = document.createElement( 'div' )
			let itemElm = document.createElement( 'div' )
			let itemElm1 = document.createElement( 'div' )
			let itemElm2 = document.createElement( 'div' )
			let dragon = new Dragon()

			div.appendChild( itemElm )
			div.appendChild( itemElm1 )
			document.body.appendChild( div )
			let container = new Container( dragon, div )
			container.addItem( itemElm1 )
			container.addItem( itemElm2 )

			// Act
			let drag = container.grab( itemElm )
			let drag1 = container.grab( itemElm1 )
			let drag2 = container.grab( itemElm2 )

			// Assert
			expect( drag.item.elm ).toEqual( itemElm )
			expect( drag1.item.elm ).toEqual( itemElm1 )
			expect( drag2.item.elm ).toEqual( itemElm2 )
		} )
	} )

	describe( 'container.getConfig', function () {

		it( 'should return config value or dragon.config.value or dragon.default.value if not set by input config ', function () {
			// Arrange
			let div = document.createElement( 'div' )
			let div2 = document.createElement( 'div' )
			let div3 = document.createElement( 'div' )
			let div4 = document.createElement( 'div' )
			let dragon = new Dragon( { containers: [ div ] } )
			let dragon2 = new Dragon( { containers: [ div2 ], mouseEvents: false } )
			let dragon3 = new Dragon()
			let dragon4 = new Dragon()

			let cont = dragon3.addContainers( div3 )[0]
			let cont2 = dragon4.addContainers( div4, { mouseEvents: false } )[0]

			// Act
			let configVal = dragon.containers[ 0 ].getConfig( 'mouseEvents' )
			let configVal2 = dragon2.containers[ 0 ].getConfig( 'mouseEvents' )
			let configVal3 = cont.getConfig( 'mouseEvents' )
			let configVal4 = cont2.getConfig( 'mouseEvents' )

			// // Assert
			expect( configVal ).toEqual( true )
			expect( configVal2 ).toEqual( false )
			expect( configVal3 ).toEqual( true )
			expect( configVal4 ).toEqual( false )
		} )

		it( 'should return config value and get value from function if provided instead of value', function () {
			// Arrange
			let div = document.createElement( 'div' )
			let dragon = new Dragon()

			let cont = dragon.addContainers( div, { mouseEvents: () => false } )[0]

			// Act
			let configVal = cont.getConfig( 'mouseEvents' )

			// // Assert
			expect( configVal ).toEqual( false )
		} )
	} )


} )