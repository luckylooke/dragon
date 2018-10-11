let cache = {}
let start = '(?:^|\\s)'
let end = '(?:\\s|$)'

function lookup( className ) {

	let cached = cache[ className ]

	if ( cached ) {

		cached.lastIndex = 0
	}
	else {

		cache[ className ] = cached = new RegExp( start + className + end, 'g')
	}

	return cached
}

function add( el, className ) {

	let current = el.className

	if ( !current.length ) {

		el.className = className
	}
	else if ( !lookup( className ).test( current ) ) {

		el.className += ' ' + className
	}
}

function rm( el, className ) {

	el.className = el.className.replace( lookup( className ), ' ').trim()
}

export default {
	add,
	rm
}
