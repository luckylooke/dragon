let cache = {}
let start = '(?:^|\\s)'
let end = '(?:\\s|$)'

function lookupClass( className ) {

	let cached = cache[ className ]

	if ( cached ) {

		cached.lastIndex = 0
	}
	else {

		cache[ className ] = cached = new RegExp( start + className + end, 'g' )
	}

	return cached
}

function addClass( el, className ) {

	let current = el.className

	if ( !current.length ) {

		el.className = className
	}
	else if ( !lookupClass( className ).test( current ) ) {

		el.className += ' ' + className
	}
}

function rmClass( el, className ) {

	el.className = el.className.replace( lookupClass( className ), ' ' ).trim()
}

export default {
	add: addClass,
	rm: rmClass
}
