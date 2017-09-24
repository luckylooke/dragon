
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

	constructor( config, utils, domEventManager, domClassManager ) {

		config = config || {}

		if ( config.nodeType == 1 ) // is DOM Element
			config = { containers: [ config ] }

		this.utils = utils

		if ( typeof config.length !== 'undefined' ) // is array-like
			config = { containers: this.utils.ensureArray( config ) }


		this.domEventManager = domEventManager
		this.domClassManager = domClassManager
		this.using = [] // array of plugins using by this dragon
		this.config = config
		this.defaults = {
			mouseEvents: true,
			mirrorAbsolute: false,
			mirrorWithParent: true,
			mirrorContainer: null,
		}
		this.id = config.id || 'dragonID_' + Date.now()
		this.containers = []

		// init

		this.initSpace( config.space )
		this.space = space
		space.dragons.push( this )

		this.addContainers()
	}

	@middle
	initSpace( newSpace ) {

		if ( newSpace )

			space = newSpace

		if ( !space.dragons ) { // initialisation

			space.dragons = []
			space.drags = []
			space.utils = this.utils

			this.domEventManager( document.documentElement, 'add', 'mousedown', e => {

				if( this.utils.whichMouseButton(e) == 3 ) return // prevent right click dragging

				e.preventDefault() // fixes github.com/bevacqua/dragula/issues/155

				if ( this.utils.isInput( e.target ) ) {
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

		containerElms = this.utils.ensureArray( containerElms )

		let len = containerElms.length
		let addedContainers = []

		for ( let i = 0, elm, container; i < len; i++ ) {

			elm = containerElms[ i ]

			if ( this.getContainer( elm ) ) {

				/* eslint-disable no-console */
				console.warn( 'container already registered', elm )
				/* eslint-enable no-console */
			}
			else {

				container = new Container( this, elm, config )
				this.containers.push( container )
				addedContainers.push( container )
			}
		}

		return addedContainers
	}

	@middle
	getContainer( elm, own ) {

		if ( own )
			return this.containers[ this.utils.getIndexByElm( this.containers, elm ) ]

		let dragons = space.dragons
		let dragonsLen = dragons.length

		for ( let i = 0, ii; i < dragonsLen; i++ ) {

			ii = this.utils.getIndexByElm( dragons[ i ].containers, elm )

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
			parentElm = this.utils.getParent( itemElm )
		}
		while ( parentElm && !this.getContainer( parentElm ) )

		if ( !parentElm ) {
			// container not found, so don't grab
			return
		}

		index = this.utils.getIndexByElm( this.containers, parentElm )
		container = this.containers[ index ]
		drag = container.grab( itemElm )
		space.drags.push( drag )
		return drag
	}

	@middle
	findDropTarget( target ) {

		while ( target && !this.getContainer( target )) {
			target = this.utils.getParent( target )
		}

		return target
	}

	@middle
	getConfig( prop ) {

		prop = this.config.hasOwnProperty( prop ) ? this.config[ prop ] : this.defaults[ prop ]
		return typeof prop == 'function' ? prop() : prop
	}

	@middle
	use( plugins ) {

		if ( !Array.isArray( plugins ) )
			plugins = [ plugins ]

		plugins.forEach( plugin => this.using.indexOf( plugin ) > -1 ? 0 : plugin( this ) )

		return this;
	}

}
