'use strict'

/* global describe, it, expect, fit */

import Dragon from './../src/dragon.js'
import Container from './../src/container.js'

describe( 'Dragon Spec', function () {

	it( 'should have been initialised properly', function () {
		// Arrange
		let dragon = new Dragon()

		// Assert
		expect( dragon.id ).toBeDefined()
		expect( dragon.config ).toBeDefined()
		expect( dragon.containers ).toBeDefined()
		expect( dragon.defaults ).toBeDefined()
	} )

	it( 'should have correctly defined default space property', function () {
		// Arrange
		let dragon = new Dragon()

		// Assert
		expect( dragon.space ).toBeDefined()
		expect( dragon.space.dragons ).toBeDefined()
		expect( dragon.space.drags ).toBeDefined()
		expect( dragon.space.utils ).toBeDefined()
		expect( dragon.space.Dragon ).toBe( Dragon )
		expect( dragon.space.dragons ).toContain( dragon )
	} )

	it( 'should have correctly defined space property', function () {
		// Arrange
		let mySpace = {}
		let dragon = new Dragon( { space: mySpace } )

		// Assert
		expect( dragon.space ).toEqual( mySpace )
		expect( mySpace.dragons ).toBeDefined()
	} )

	it( 'should have add containers provided to constructor', function () {
		// Arrange
		let container1 = document.createElement( 'div' )
		let container2 = document.createElement( 'div' )
		let dragon = new Dragon( [ container1, container2 ] )

		// Assert
		expect( dragon.containers.length ).toEqual( 2 )
	} )

	it( 'should have add containers provided via options to constructor', function () {
		// Arrange
		let container1 = document.createElement( 'div' )
		let container2 = document.createElement( 'div' )
		let dragon = new Dragon( { containers: [ container1, container2 ] } )

		// Assert
		expect( dragon.containers.length ).toEqual( 2 )
	} )

	describe( 'dragon.addContainers', function () {

		it( 'should add containers to dragon', function () {
			// Arrange
			let container1 = document.createElement( 'div' )
			let container2 = document.createElement( 'div' )
			let container3 = document.createElement( 'div' )
			let dragon = new Dragon()

			// Act
			dragon.addContainers( container1 )

			// Assert
			expect( dragon.containers.length ).toEqual( 1 )

			// Act
			dragon.addContainers( [ container2, container3 ] )

			// Assert
			expect( dragon.containers.length ).toEqual( 3 )
		} )
	} )

	describe( 'dragon.getContainer', function () {

		it( 'should get container instance from dragon', function () {
			// Arrange
			let container1 = document.createElement( 'div' )
			let container2 = document.createElement( 'div' )
			let dragon = new Dragon( [ container1 ] )

			// Act
			let containerInstance = dragon.getContainer( container1 )
			let containerInstance2 = dragon.getContainer( container2 )

			// Assert
			expect( containerInstance instanceof Container ).toEqual( true )
			expect( containerInstance.elm ).toEqual( container1 )
			expect( containerInstance2 ).toEqual( null )
		} )
	} )
} )