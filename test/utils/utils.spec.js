'use strict'

/* global describe, it, expect, it */

// import Dragon from './../src/dragon.js'
// import Container from './../src/container.js'
import * as utils from '../../packages/utils/utils.js'

describe('utils.getImmediateChild', function () {

	it('should have found immediate child of a dropTraget', function () {

		// Arrange
		let div = document.createElement('div')
		let itemElm = document.createElement('div')
		let itemElm2 = document.createElement('div')
		let itemElm3 = document.createElement('div')

		div.appendChild( itemElm )
		itemElm.appendChild( itemElm2 )
		itemElm2.appendChild( itemElm3 )
		document.body.appendChild( div )

		let immediate = utils.getImmediateChild( div, itemElm3 )

		// Assert
		expect( immediate ).toEqual( itemElm )
	} )
} )

describe('utils.getOffset', function () {

	it('should have return object with element offset params', function () {

		// Arrange
		let div = document.createElement('div')
		let itemElm = document.createElement('div')
		document.body.innerHTML = ''
		document.body.style.margin = '0px'
		document.body.style.padding = '0px'
		div.style.margin = '100px'
		div.style.padding = '100px'
		itemElm.style.width = '100px'
		itemElm.style.height = '100px'

		div.appendChild( itemElm )
		document.body.appendChild( div )

		// Act
		let offset = utils.getOffset( itemElm )

		// Assert
		expect( offset.left ).toEqual( 200 )
		expect( offset.top ).toEqual( 200 )
		expect( offset.width ).not.toBeDefined()
		expect( offset.height ).not.toBeDefined()

		// Act
		offset = utils.getOffset( itemElm, true )

		// Assert
		expect( offset.left ).toEqual( 200 )
		expect( offset.top ).toEqual( 200 )
		expect( offset.width ).toEqual( 100 )
		expect( offset.height ).toEqual( 100 )
	} )
} )

describe('utils.getRectWidth', function () {

	it('should have return width', function () {

		// Arrange
		let rect = { width: 100 }
		let rect2 = { left: 100, right: 250 }

		// Act
		let width = utils.getRectWidth( rect )
		let width2 = utils.getRectWidth( rect2 )

		// Assert
		expect( width ).toEqual( 100 )
		expect( width2 ).toEqual( 150 )
	} )
} )

describe('utils.getRectHeight', function () {

	it('should have return height', function () {

		// Arrange
		let rect = { height: 100 }
		let rect2 = { top: 100, bottom: 250 }

		// Act
		let height = utils.getRectHeight( rect )
		let height2 = utils.getRectHeight( rect2 )

		// Assert
		expect( height ).toEqual( 100 )
		expect( height2 ).toEqual( 150 )
	} )
} )

describe('utils.getParent', function () {

	it('should have return parent of given element or null if the parent is document', function () {

		// Arrange
		let div = document.createElement('div')
		let itemElm = document.createElement('div')

		div.appendChild( itemElm )
		document.body.appendChild( div )

		// Act
		let parent = utils.getParent( itemElm )
		let parent2 = utils.getParent( document.body.parentNode )

		// Assert
		expect( parent ).toEqual( div )
		expect( parent2 ).toBeNull()
	} )
} )

describe('utils.nextEl', function () {

	it('should have return next sibling element of given element or null if there is no sibling', function () {

		// Arrange
		let div = document.createElement('div')
		let itemElm = document.createElement('div')
		let itemElm2 = document.createElement('div')

		div.appendChild( itemElm )
		div.appendChild( itemElm2 )
		document.body.appendChild( div )

		// Act
		let sib = utils.nextEl( itemElm )
		let sib2 = utils.nextEl( itemElm2 )

		// Assert
		expect( sib ).toEqual( itemElm2 )
		expect( sib2 ).toBeNull()
	} )
} )

describe('utils.toArray', function () {

	it('should have return real array from array-like or array object if input is array already', function () {

		// Arrange
		let div = document.createElement('div')
		let itemElm = document.createElement('div')
		let itemElm2 = document.createElement('div')
		let itemElm3 = document.createElement('div')

		itemElm.className = 'test'
		itemElm2.className = 'test'
		itemElm3.className = 'test'

		div.appendChild( itemElm )
		div.appendChild( itemElm2 )
		div.appendChild( itemElm3 )
		document.body.appendChild( div )

		// Act
		let isArr = Array.isArray( utils.toArray( document.getElementsByClassName('test') ) )
		let isArr2 = Array.isArray( utils.toArray( { 0: {}, 1: '', 2: 11 } ) )
		let isArr3 = Array.isArray( utils.toArray( [ {}, '', 11 ] ) )

		// Assert
		expect( isArr ).toEqual( true )
		expect( isArr2 ).toEqual( true )
		expect( isArr3 ).toEqual( true )
	} )
} )

describe('utils.bind', function () {

	it('should create method with binded context to provided object and return it', function () {

		// Arrange
		let obj = {
			selfProp: 'test',
			method: function () {
				return this.selfProp
			}
		}

		// Act
		let bindedMethod = utils.bind( obj, 'method')

		// Assert
		expect( obj.method() ).toEqual('test')
		expect( bindedMethod() ).toEqual('test')
	} )
} )

describe('utils.domIndexOf', function () {

	it('should return index of child element in parentNode', function () {

		// Arrange
		let div = document.createElement('div')
		let itemElm = document.createElement('div')
		let itemElm2 = document.createElement('div')
		let itemElm3 = document.createElement('div')

		div.appendChild( itemElm )
		div.appendChild( itemElm2 )
		div.appendChild( itemElm3 )
		document.body.appendChild( div )

		// Act
		let index = utils.domIndexOf( div, itemElm )
		let index2 = utils.domIndexOf( div, itemElm2 )
		let index3 = utils.domIndexOf( div, itemElm3 )

		// Assert
		expect( index ).toEqual( 0 )
		expect( index2 ).toEqual( 1 )
		expect( index3 ).toEqual( 2 )
	} )
} )

describe('utils.isInput', function () {

	it('should return true if provided element is one of input types or element is in content-editable mode', function () {

		// Arrange
		let inputElm = document.createElement('input')
		let textAreaElm = document.createElement('textarea')
		let selectElm = document.createElement('select')
		let editableElm = document.createElement('div')
		let editableChildElm = document.createElement('div')
		let notInput = document.createElement('div')

		editableElm.contentEditable = true

		editableElm.appendChild( editableChildElm )
		document.body.appendChild( editableElm )
		document.body.appendChild( inputElm )
		document.body.appendChild( textAreaElm )
		document.body.appendChild( selectElm )
		document.body.appendChild( notInput )

		// Act
		let isInput = utils.isInput( notInput )
		let isInput2 = utils.isInput( inputElm )
		let isInput3 = utils.isInput( textAreaElm )
		let isInput4 = utils.isInput( editableElm )
		let isInput5 = utils.isInput( editableChildElm )
		let isInput6 = utils.isInput( selectElm )

		// Assert
		expect( isInput ).toEqual( false )
		expect( isInput2 ).toEqual( true )
		expect( isInput3 ).toEqual( true )
		expect( isInput4 ).toEqual( true )
		expect( isInput5 ).toEqual( true )
		expect( isInput6 ).toEqual( true )
	} )
} )

describe('utils.isEditable', function () {

	it('should return true if provided element is in content-editable mode', function () {

		// Arrange
		let editableElm = document.createElement('div')
		let editableChildElm = document.createElement('div')
		let notEditable = document.createElement('div')

		editableElm.contentEditable = true

		editableElm.appendChild( editableChildElm )
		document.body.appendChild( editableElm )
		document.body.appendChild( notEditable )

		// Act
		let isEditable = utils.isEditable( notEditable )
		let isEditable4 = utils.isEditable( editableElm )
		let isEditable5 = utils.isEditable( editableChildElm )

		// Assert
		expect( isEditable ).toEqual( false )
		expect( isEditable4 ).toEqual( true )
		expect( isEditable5 ).toEqual( true )
	} )
} )

describe('utils.getIndexByElm', function () {

	it('should return index of the object in collection array looked up by elm property containing DOM element', function () {

		// Arrange
		let elm = document.createElement('div')
		let elm2 = document.createElement('div')
		let elm3 = document.createElement('div')

		let collection = [ {
			elm: elm
		}, {
			elm: elm2
		}, {
			elm: elm3
		}, ]

		// Act
		let index = utils.getIndexByElm( collection, elm )
		let index2 = utils.getIndexByElm( collection, elm2 )
		let index3 = utils.getIndexByElm( collection, elm3 )

		// Assert
		expect( index ).toEqual( 0 )
		expect( index2 ).toEqual( 1 )
		expect( index3 ).toEqual( 2 )
	} )
} )