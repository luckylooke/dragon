'use strict';

import Dragon from './../src/dragon.js'

describe('Dragon Spec', function() {
	it('should have corectly defined space property', function() {
		// Arrange
		var dragon = new Dragon();

		// Act
		// var result = calculator.add(2, 2);

		// Assert
		expect(dragon.space).toBeDefined();
		expect(dragon.space.dragons).toBeDefined();
		expect(dragon.space.drags).toBeDefined();
		expect(dragon.space.utils).toBeDefined();
		expect(dragon.space.Dragon).toBe(Dragon);
	});
});

describe( 'A suite is just a function', function () {
	var a;

	it( 'and so is a spec', function () {
		a = true;

		expect( a ).toBe( true );
	} );
} );
describe( 'A suite is just a function', function () {
	var a;

	it( 'and so is a spec', function () {
		a = true;

		expect( a ).toBe( true );
	} );
} );
describe( 'A suite is just a function', function () {
	var a;

	it( 'and so is a spec', function () {
		a = true;

		expect( a ).toBe( true );
	} );
} );