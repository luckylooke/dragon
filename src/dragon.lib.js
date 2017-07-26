import              '@dragon/polyfills'
import  Dragon       from '@dragon/core'
import  * as utils   from '@dragon/utils'
import  touchy       from '@dragon/touchy' // cross dom event management
import  classes      from '@dragon/dom-classes'

export default function dragon( config ) {

	return new Dragon( config, utils, touchy, classes )
}
