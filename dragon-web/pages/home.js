
import '../node_modules/flexboxgrid/dist/flexboxgrid.css'
import '../../dist/dragon.css'
import dragon from '../../src/dragon.dev.lib'

export function homeHandler( domEntryPoint, routeParams ){
	buildExample( GET_MOCK_INPUT_GENERATED() )
}

// definitions

function buildExample( containers ){

	var exampleElm = document.getElementById('example')

	if ( !exampleElm )
		return

	createContainers( containers, exampleElm )

	let d = dragon(document.getElementsByClassName('container'))
      console.log('dingdong', d)
}

function createContainers( containers, targetElement, level ) {	

	level = level || 0

	var rowElm = document.createElement('div')
  	rowElm.className = 'row'

	containers.forEach( function( container ){

		var colElm = document.createElement('div')
		colElm.className = level > 0 ? 'col-xs-10 container' : 'col-xs-12 col-sm-6 col-md-4 col-lg-3 container'
		// colElm.innerHTML = '<p>' + container.value + '</p>'

		if ( container.items ){

			container.items.forEach( function( item ){

				var boxElm = document.createElement('div')
				boxElm.className = 'box'
				boxElm.innerHTML = '<p>' + item.value + '</p>'

				if ( item.items ) // nested containers
					createContainers( [item], boxElm, level + 1 )

				colElm.appendChild( boxElm )
			})
		}

	  	rowElm.appendChild( colElm )
	})

	targetElement.appendChild( rowElm )

}

function GET_MOCK_INPUT(){

	return [

		{
			items: [{
				value: 'item 1'
			}, {
				value: 'item 2'
			}, {
				value: 'item 3',

				items: [{
					value: 'item 31'
				}, {
					value: 'item 32'
				}, {
					value: 'item 33'
				}, {
					value: 'item 34'
				}]
			}, {
				value: 'item 4'
			}]
		},

		{
			items: [{
				value: 'item 5'
			}, {
				value: 'item 6'
			}, {
				value: 'item 7'
			}, {
				value: 'item 8'
			}]
		}
	]
}

function GET_MOCK_INPUT_GENERATED(){

	return [
		getRandomContainerData(),
		getRandomContainerData(),
		getRandomContainerData(),
		getRandomContainerData(),
	]
}

function getRandomContainerData( data, level ){

	var num = 1 + Math.round( Math.random() *2 +3 )

	data = data || {}
	level = level || 0

	data.items = []

	for ( var i = 0; i < num; i++) {

		var item = {value: 'item #' + Math.round( Math.random() *10000 )}

		if ( level < 3 && Math.random() < 0.1 ) // make nested
			item = getRandomContainerData( item, level + 1 )

		data.items.push( item )
	}

	return data
}
