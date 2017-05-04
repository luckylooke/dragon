/**
 * Polyfill from https://github.com/remy/polyfills/blob/master/classList.js
 */

(function () {

	if ( typeof window.Element === "undefined" || "classList" in document.documentElement ) return;

	let prototype = Array.prototype,
		push = prototype.push,
		splice = prototype.splice,
		join = prototype.join;

	function DOMTokenList( el ) {
		this.el = el;
		// The className needs to be trimmed and split on whitespace
		// to retrieve a list of classes.
		let classes = el.className.replace( /^\s+|\s+$/g, '' ).split( /\s+/ );
		for ( let i = 0; i < classes.length; i++ ) {
			push.call( this, classes[ i ] );
		}
	}

	DOMTokenList.prototype = {
		add: function ( token ) {
			if ( this.contains( token ) ) return;
			push.call( this, token );
			this.el.className = this.toString();
		},
		contains: function ( token ) {
			return this.el.className.indexOf( token ) != -1;
		},
		item: function ( index ) {
			return this[ index ] || null;
		},
		remove: function ( token ) {
			if ( !this.contains( token ) ) return;
			for ( var i = 0; i < this.length; i++ ) {
				if ( this[ i ] == token ) break;
			}
			splice.call( this, i, 1 );
			this.el.className = this.toString();
		},
		toString: function () {
			return join.call( this, ' ' );
		},
		toggle: function ( token ) {
			if ( !this.contains( token ) ) {
				this.add( token );
			} else {
				this.remove( token );
			}

			return this.contains( token );
		}
	};

	window.DOMTokenList = DOMTokenList;

	function defineElementGetter( obj, prop, getter ) {
		if ( Object.defineProperty ) {
			Object.defineProperty( obj, prop, {
				get: getter
			} );
		} else {
			obj.__defineGetter__( prop, getter );
		}
	}

	defineElementGetter( Element.prototype, 'classList', function () {
		return new DOMTokenList( this );
	} );

})();


/**
 * Polyfill from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now#Polyfill
 */

if (!Date.now) {
	Date.now = function now() {
		return new Date().getTime();
	};
}

// Simple version of polyfill Array.prototype.forEach()
if ( ![].forEach ) {
	Array.prototype.forEach = function ( callback, thisArg ) {
		var len = this.length;
		for ( var i = 0; i < len; i++ ) {
			callback.call( thisArg, this[ i ], i, this )
		}
	};
}


/**
 * Polyfill from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#Polyfill
 */

if (!Function.prototype.bind) {
	Function.prototype.bind = function(oThis) {
		if (typeof this !== 'function') {
			// closest thing possible to the ECMAScript 5
			// internal IsCallable function
			throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
		}

		var aArgs   = Array.prototype.slice.call(arguments, 1),
			fToBind = this,
			fNOP    = function() {},
			fBound  = function() {
				return fToBind.apply(this instanceof fNOP
						? this
						: oThis,
					aArgs.concat(Array.prototype.slice.call(arguments)));
			};

		if (this.prototype) {
			// Function.prototype doesn't have a prototype property
			fNOP.prototype = this.prototype;
		}
		fBound.prototype = new fNOP();

		return fBound;
	};
}