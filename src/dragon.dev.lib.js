import              './../packages/polyfills/polyfills'
import  Dragon       from './../packages/core/dragon'
import  * as utils   from './../packages/utils/utils'
import  touchy       from './../packages/touchy/touchy' // cross dom event management
import  classes      from './../packages/dom-classes/classes'

// injecting dev versions
utils.domEventManager = touchy
utils.domClassManager = classes

export default function dragon( config ) {

	return new Dragon( config, utils )
}
export { Dragon, utils }
