'use strict'

import './polyfills.js' // Element.classList polyfill
import touchy from './touchy.js' // cross event
import { getParent, toArray, isInput, lookUpByElm } from './utils'
import * as utils from './utils'
import Container from './container'
import { decorator as middle } from 'middle.js'

let doc = document

if ( !window.dragonSpace )
	window.dragonSpace = {}
let space = window.dragonSpace

// ==============================================================================================================================================================
// Dragon =====================================================================================================================================================
// =============================================================================================================================================================
/** is group of containers */
export default class Dragon {

	constructor( config ) {

		config = config || {}

		if ( typeof config.length !== 'undefined' ) // is array-like
			config = { containers: toArray( config ) }

		this.initSpace( config.space )
		this.space = space
		space.dragons.push( this )

		this.config = config
		this.defaults = {
			mouseEvents: true,
			mirrorAbsolute: false,
			mirrorContainer: doc.body
		}
		this.id = config.id || 'dragonID_' + Date.now()
		this.containers = []

		// init
		this.addContainers()
	}

	@middle
	initSpace( newSpace ) {

		if ( newSpace )

			space = newSpace

		if ( !space.dragons ) { // initialisation

			space.dragons = []
			space.drags = []
			space.utils = utils

			touchy( document.documentElement, 'add', 'mousedown', e => {

				e.preventDefault() // fixes github.com/bevacqua/dragula/issues/155

				if ( isInput( e.target ) ) {
					// see also: github.com/bevacqua/dragula/issues/208
					e.target.focus() // fixes github.com/bevacqua/dragula/issues/176
					return
				}

				this.grab( e.clientX, e.clientY, e.target )
			} )
		}

		if ( !space.Dragon )

			space.Dragon = Dragon
	}

	@middle
	addContainers( containerElms, config ) {

		containerElms = containerElms || this.config.containers

		if ( !containerElms ) return

		let len = containerElms.length

		for ( let i = 0, elm; i < len; i++ ) {

			elm = containerElms[ i ]

			if ( this.getContainer( elm ) ) {

				/* eslint-disable no-console */
				console.warn( 'container already registered', elm )
				/* eslint-enable no-console */
			}
			else {

				this.containers.push( new Container( this, elm, config ) )
			}
		}
	}

	@middle
	getContainer( elm, own ) {

		if ( own )
			return this.containers[ lookUpByElm( this.containers, elm ) ]

		let dragons = space.dragons
		let dragonsLen = dragons.length

		for ( let i = 0, ii; i < dragonsLen; i++ ) {

			ii = lookUpByElm( dragons[ i ].containers, elm )

			if ( ii > -1 )
				return dragons[ i ].containers[ ii ]
		}

		return null
	}

	@middle
	grab( xOrElm, y ) {

		let itemElm = y == undefined ? xOrElm : doc.elementFromPoint( xOrElm, y )
		let parentElm = itemElm
		let container
		let index
		let drag

		do {
			itemElm = parentElm // drag target should be a top element
			parentElm = getParent( itemElm )
		}
		while ( parentElm && !this.getContainer( parentElm ) )

		if ( !parentElm ) {
			// container not found, so don't grab
			return
		}

		index = lookUpByElm( this.containers, parentElm )
		container = this.containers[ index ]
		drag = container.grab( itemElm )
		space.drags.push( drag )
		return drag
	}

	@middle
	findDropTarget( elementBehindCursor ) {

		let target = elementBehindCursor

		while ( target && !this.getContainer( target ) ) {
			target = getParent( target )
		}

		return target
	}

	@middle
	getConfig( prop ) {

		prop = this.config.hasOwnProperty( prop ) ? this.config[ prop ] : this.defaults[ prop ]
		return typeof prop == 'function' ? prop() : prop
	}

}
