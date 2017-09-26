'use strict'

/* global describe, fit, require, expect */

import dragon from '../../dist/dragon.js'
import * as dragonES from '../../dist/dragon.es.js'
import dragonImport from '../../dist/dragon.js'
const dragonRequire = require('../../dist/dragon.js')
// anyone who knows how to test amd laoding? :)

describe( 'dragon library Spec', function () {

	it( 'should have been loaded', function () {
		// Assert 
		
		let dragonInstance = dragon()
		expect( dragonInstance.id ).toBeDefined()
		expect( dragonInstance.config ).toBeDefined()
		expect( dragonInstance.containers ).toBeDefined()
		expect( dragonInstance.defaults ).toBeDefined()
		
		let dragonImportInstance = dragonImport()
		expect( dragonImportInstance.id ).toBeDefined()
		expect( dragonImportInstance.config ).toBeDefined()
		expect( dragonImportInstance.containers ).toBeDefined()
		expect( dragonImportInstance.defaults ).toBeDefined()
		
		let dragonRequireInstance = dragonRequire()
		expect( dragonRequireInstance.id ).toBeDefined()
		expect( dragonRequireInstance.config ).toBeDefined()
		expect( dragonRequireInstance.containers ).toBeDefined()
		expect( dragonRequireInstance.defaults ).toBeDefined()
		
		let dragonESInstance = dragonES.default()
		expect( dragonESInstance.id ).toBeDefined()
		expect( dragonESInstance.config ).toBeDefined()
		expect( dragonESInstance.containers ).toBeDefined()
		expect( dragonESInstance.defaults ).toBeDefined()
	} )

} )