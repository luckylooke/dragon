import              '@dragon/polyfills'
import  Dragon       from '@dragon/core'
import  * as utils   from '@dragon/utils'

export default function dragon( config ) {

	return new Dragon( config, utils )
}

export { Dragon, utils }
