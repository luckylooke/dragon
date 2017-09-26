'use strict'

/* global describe, it, expect */

import Dragon from '../../packages/core/dragon.js'
import Container from '../../packages/core/container.js'
import * as utils from '../../packages/utils/utils'
import touchy from '../../packages/touchy/touchy'
import classes from '../../packages/dom-classes/classes'

describe( 'Dragon Spec', function () {

	it( 'should have been initialised properly', function () {
		// Arrange
		let dragon = new Dragon( {}, utils, touchy, classes )

		// Assert
		expect( dragon.id ).toBeDefined()
		expect( dragon.config ).toBeDefined()
		expect( dragon.containers ).toBeDefined()
		expect( dragon.defaults ).toBeDefined()
	} )

	it( 'should have default space property initialised properly', function () {
		// Arrange
		let dragon = new Dragon( {}, utils, touchy, classes )
		let space = dragon.space

		// Assert
		expect( space ).toBeDefined()
		expect( space.dragons ).toBeDefined()
		expect( space.drags ).toBeDefined()
		expect( space.utils ).toBeDefined()
		expect( space.Dragon ).toBeDefined()
		expect( space.dragons ).toContain( dragon )
	} )

	it( 'should have correctly defined space property', function () {
		// Arrange
		let mySpace = {}
		let dragon = new Dragon( { space: mySpace }, utils, touchy, classes )

		// Assert
		expect( dragon.space ).toEqual( mySpace )
		expect( mySpace.dragons ).toBeDefined()
	} )

	it( 'should have add containers provided to constructor', function () {
		// Arrange
		let containerElm = document.createElement('div')
		let containerElm2 = document.createElement('div')
		let dragon = new Dragon( [ containerElm, containerElm2 ], utils, touchy, classes )

		// Assert
		expect( dragon.containers.length ).toEqual( 2 )
	} )

	it( 'should have add containers provided via options to constructor', function () {
		// Arrange
		let containerElm = document.createElement('div')
		let containerElm2 = document.createElement('div')
		let dragon = new Dragon( { containers: [ containerElm, containerElm2 ] }, utils, touchy, classes )

		// Assert
		expect( dragon.containers.length ).toEqual( 2 )
	} )

	describe( 'dragon.addContainers', function () {

		it( 'should add containers to dragon', function () {
			// Arrange
			let containerElm = document.createElement('div')
			let containerElm2 = document.createElement('div')
			let containerElm3 = document.createElement('div')
			let dragon = new Dragon( {}, utils, touchy, classes )

			// Act
			let addedContainers = dragon.addContainers( containerElm )

			// Assert
			expect( dragon.containers.length ).toEqual( 1 )
			expect( addedContainers[ 0 ].elm ).toEqual( containerElm )

			// Act
			let addedContainers2 = dragon.addContainers( [ containerElm2, containerElm3 ] )

			// Assert
			expect( dragon.containers.length ).toEqual( 3 )
			expect( addedContainers2[ 0 ].elm ).toEqual( containerElm2 )
			expect( addedContainers2[ 1 ].elm ).toEqual( containerElm3 )
		} )
	} )

	describe( 'dragon.getContainer', function () {

		it( 'should get containerElm instance from dragon', function () {
			// Arrange
			let containerElm = document.createElement('div')
			let containerElm2 = document.createElement('div')
			let dragon = new Dragon( [ containerElm ], utils, touchy, classes )

			// Act
			let containerInstance = dragon.getContainer( containerElm )
			let containerInstance2 = dragon.getContainer( containerElm2 )

			// Assert
			expect( containerInstance instanceof Container ).toEqual( true )
			expect( containerInstance.elm ).toEqual( containerElm )
			expect( containerInstance2 ).toBeNull()
		} )
	} )

	describe( 'dragon.grab', function () {

		it( 'should grab element provided', function () {
			// Arrange
			let containerElm = document.createElement('div')
			let itemElm = document.createElement('div')

			containerElm.appendChild( itemElm )
			document.body.appendChild( containerElm )

			let dragon = new Dragon( [ containerElm ], utils, touchy, classes )

			// Act
			let drag = dragon.grab( itemElm )

			// Assert
			expect( drag.item.elm ).toEqual( itemElm )
		} )

		it( 'should grab element by coordinates', function () {
			// Arrange
			let containerElm = document.createElement('div')
			let itemElm = document.createElement('div')
			let itemElm2 = document.createElement('div')

			itemElm.style.width = '100px'
			itemElm.style.height = '100px'
			itemElm2.style.width = '100px'
			itemElm2.style.height = '100px'

			containerElm.appendChild( itemElm )
			containerElm.appendChild( itemElm2 )
			document.body.appendChild( containerElm )

			let dragon = new Dragon( [ containerElm ], utils, touchy, classes )

			// Act
			let drag = dragon.grab( 50, 150 )

			// Assert
			expect( drag.item.elm ).toEqual( itemElm2 )
		} )
	} )

	describe( 'dragon.findDropTarget', function () {

		it( 'should find target containerElm in DOM tree, if there is any', function () {
			// Arrange
			let div = document.createElement('div')
			let div1 = document.createElement('div')
			let div2 = document.createElement('div')
			let div3 = document.createElement('div')
			let dragon = new Dragon( div1, utils, touchy, classes )

			div.appendChild( div1 )
			div1.appendChild( div2 )
			div2.appendChild( div3 )

			document.body.appendChild( div )

			// Act
			let containerElm = dragon.findDropTarget( div3 )
			let containerElm2 = dragon.findDropTarget( div )

			// Assert
			expect( containerElm ).toEqual( div1 )
			expect( containerElm2 ).toBeNull()
		} )
	} )

	describe( 'dragon.getConfig', function () {

		it( 'should return config value or default if not set by input config ', function () {
			// Arrange
			let dragon = new Dragon( {}, utils, touchy, classes )
			let dragon2 = new Dragon( { mouseEvents: false }, utils, touchy, classes )

			// Act
			let configVal = dragon.getConfig( 'mouseEvents' )
			let configVal2 = dragon2.getConfig( 'mouseEvents' )

			// Assert
			expect( configVal ).toEqual( true )
			expect( configVal2 ).toEqual( false )
		} )

		it( 'should return config value and get value from function if provided instead of value', function () {
			// Arrange
			let dragon = new Dragon( { mouseEvents: () => false }, utils, touchy, classes )

			// Act
			let configVal = dragon.getConfig( 'mouseEvents' )

			// Assert
			expect( configVal ).toEqual( false )
		} )
	} )
} )