/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			memo[selector] = fn.call(this, selector);
		}

		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(5);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__app_css__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__app_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__app_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_flexboxgrid_dist_flexboxgrid_css__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_flexboxgrid_dist_flexboxgrid_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__node_modules_flexboxgrid_dist_flexboxgrid_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__dist_dragon_css__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__dist_dragon_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__dist_dragon_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__dist_dragon_es__ = __webpack_require__(10);






buildExample( GET_MOCK_INPUT() )

console.log( __WEBPACK_IMPORTED_MODULE_3__dist_dragon_es__["a" /* default */] )

// definitions

function buildExample( containers ){

	var exampleElm = document.getElementById('example')
	createContainers( containers, exampleElm )
}

function createContainers( containers, targetElement ) {

	containers.forEach( function( container ){

		  var el = document.createElement('div')
		  el.className = 'col-xs-12 col-sm-6 col-md-4 col-lg-3 container'
		  // el.innerHTML = '<p>' + container.value + '</p>'

		  if ( container.items ){

		  	// var rowElm = document.createElement('div')
		  	// rowElm.className = 'row'

		  	// var colElm = document.createElement('div')
		  	// colElm.className = 'col-xs'

		  	// rowElm.appendChild( colElm )

		  	container.items.forEach( function( item ){

		  		var boxElm = document.createElement('div')
		  		boxElm.className = 'box'
		  		boxElm.innerHTML = '<p>' + item.value + '</p>'

		  		el.appendChild(boxElm)
		  	})
		  }

		  targetElement.appendChild( el )
	})

	let d = Object(__WEBPACK_IMPORTED_MODULE_3__dist_dragon_es__["a" /* default */])(document.getElementsByClassName('container'))
      console.log('dingdong', d)
}

function GET_MOCK_INPUT(){

	return [
		{items:[{
			value: 'item 1'
		},{
			value: 'item 2'
		},{
			value: 'item 3'
		},{
			value: 'item 4'
		}]},
		{items:[{
			value: 'item 5'
		},{
			value: 'item 6'
		},{
			value: 'item 7'
		},{
			value: 'item 8'
		}]}
	]
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(4);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js!./app.css", function() {
			var newContent = require("!!../node_modules/css-loader/index.js!./app.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "\nbody {\n\ttext-align: center;\n}\n\nimg.logo {\n        max-width: 300px;\n    }\n\n    .demo {\n        text-align: center;\n    }\n\n    .box {\n        background: #bdffa3;\n    }", ""]);

// exports


/***/ }),
/* 5 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(7);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../css-loader/index.js!./flexboxgrid.css", function() {
			var newContent = require("!!../../css-loader/index.js!./flexboxgrid.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, ".container-fluid,\n.container {\n  margin-right: auto;\n  margin-left: auto;\n}\n\n.container-fluid {\n  padding-right: 2rem;\n  padding-left: 2rem;\n}\n\n.row {\n  box-sizing: border-box;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-flex: 0;\n  -ms-flex: 0 1 auto;\n  flex: 0 1 auto;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n  -ms-flex-direction: row;\n  flex-direction: row;\n  -ms-flex-wrap: wrap;\n  flex-wrap: wrap;\n  margin-right: -0.5rem;\n  margin-left: -0.5rem;\n}\n\n.row.reverse {\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: reverse;\n  -ms-flex-direction: row-reverse;\n  flex-direction: row-reverse;\n}\n\n.col.reverse {\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: reverse;\n  -ms-flex-direction: column-reverse;\n  flex-direction: column-reverse;\n}\n\n.col-xs,\n.col-xs-1,\n.col-xs-2,\n.col-xs-3,\n.col-xs-4,\n.col-xs-5,\n.col-xs-6,\n.col-xs-7,\n.col-xs-8,\n.col-xs-9,\n.col-xs-10,\n.col-xs-11,\n.col-xs-12,\n.col-xs-offset-0,\n.col-xs-offset-1,\n.col-xs-offset-2,\n.col-xs-offset-3,\n.col-xs-offset-4,\n.col-xs-offset-5,\n.col-xs-offset-6,\n.col-xs-offset-7,\n.col-xs-offset-8,\n.col-xs-offset-9,\n.col-xs-offset-10,\n.col-xs-offset-11,\n.col-xs-offset-12 {\n  box-sizing: border-box;\n  -webkit-box-flex: 0;\n  -ms-flex: 0 0 auto;\n  flex: 0 0 auto;\n  padding-right: 0.5rem;\n  padding-left: 0.5rem;\n}\n\n.col-xs {\n  -webkit-box-flex: 1;\n  -ms-flex-positive: 1;\n  flex-grow: 1;\n  -ms-flex-preferred-size: 0;\n  flex-basis: 0;\n  max-width: 100%;\n}\n\n.col-xs-1 {\n  -ms-flex-preferred-size: 8.33333333%;\n  flex-basis: 8.33333333%;\n  max-width: 8.33333333%;\n}\n\n.col-xs-2 {\n  -ms-flex-preferred-size: 16.66666667%;\n  flex-basis: 16.66666667%;\n  max-width: 16.66666667%;\n}\n\n.col-xs-3 {\n  -ms-flex-preferred-size: 25%;\n  flex-basis: 25%;\n  max-width: 25%;\n}\n\n.col-xs-4 {\n  -ms-flex-preferred-size: 33.33333333%;\n  flex-basis: 33.33333333%;\n  max-width: 33.33333333%;\n}\n\n.col-xs-5 {\n  -ms-flex-preferred-size: 41.66666667%;\n  flex-basis: 41.66666667%;\n  max-width: 41.66666667%;\n}\n\n.col-xs-6 {\n  -ms-flex-preferred-size: 50%;\n  flex-basis: 50%;\n  max-width: 50%;\n}\n\n.col-xs-7 {\n  -ms-flex-preferred-size: 58.33333333%;\n  flex-basis: 58.33333333%;\n  max-width: 58.33333333%;\n}\n\n.col-xs-8 {\n  -ms-flex-preferred-size: 66.66666667%;\n  flex-basis: 66.66666667%;\n  max-width: 66.66666667%;\n}\n\n.col-xs-9 {\n  -ms-flex-preferred-size: 75%;\n  flex-basis: 75%;\n  max-width: 75%;\n}\n\n.col-xs-10 {\n  -ms-flex-preferred-size: 83.33333333%;\n  flex-basis: 83.33333333%;\n  max-width: 83.33333333%;\n}\n\n.col-xs-11 {\n  -ms-flex-preferred-size: 91.66666667%;\n  flex-basis: 91.66666667%;\n  max-width: 91.66666667%;\n}\n\n.col-xs-12 {\n  -ms-flex-preferred-size: 100%;\n  flex-basis: 100%;\n  max-width: 100%;\n}\n\n.col-xs-offset-0 {\n  margin-left: 0;\n}\n\n.col-xs-offset-1 {\n  margin-left: 8.33333333%;\n}\n\n.col-xs-offset-2 {\n  margin-left: 16.66666667%;\n}\n\n.col-xs-offset-3 {\n  margin-left: 25%;\n}\n\n.col-xs-offset-4 {\n  margin-left: 33.33333333%;\n}\n\n.col-xs-offset-5 {\n  margin-left: 41.66666667%;\n}\n\n.col-xs-offset-6 {\n  margin-left: 50%;\n}\n\n.col-xs-offset-7 {\n  margin-left: 58.33333333%;\n}\n\n.col-xs-offset-8 {\n  margin-left: 66.66666667%;\n}\n\n.col-xs-offset-9 {\n  margin-left: 75%;\n}\n\n.col-xs-offset-10 {\n  margin-left: 83.33333333%;\n}\n\n.col-xs-offset-11 {\n  margin-left: 91.66666667%;\n}\n\n.start-xs {\n  -webkit-box-pack: start;\n  -ms-flex-pack: start;\n  justify-content: flex-start;\n  text-align: start;\n}\n\n.center-xs {\n  -webkit-box-pack: center;\n  -ms-flex-pack: center;\n  justify-content: center;\n  text-align: center;\n}\n\n.end-xs {\n  -webkit-box-pack: end;\n  -ms-flex-pack: end;\n  justify-content: flex-end;\n  text-align: end;\n}\n\n.top-xs {\n  -webkit-box-align: start;\n  -ms-flex-align: start;\n  align-items: flex-start;\n}\n\n.middle-xs {\n  -webkit-box-align: center;\n  -ms-flex-align: center;\n  align-items: center;\n}\n\n.bottom-xs {\n  -webkit-box-align: end;\n  -ms-flex-align: end;\n  align-items: flex-end;\n}\n\n.around-xs {\n  -ms-flex-pack: distribute;\n  justify-content: space-around;\n}\n\n.between-xs {\n  -webkit-box-pack: justify;\n  -ms-flex-pack: justify;\n  justify-content: space-between;\n}\n\n.first-xs {\n  -webkit-box-ordinal-group: 0;\n  -ms-flex-order: -1;\n  order: -1;\n}\n\n.last-xs {\n  -webkit-box-ordinal-group: 2;\n  -ms-flex-order: 1;\n  order: 1;\n}\n\n@media only screen and (min-width: 48em) {\n  .container {\n    width: 49rem;\n  }\n\n  .col-sm,\n  .col-sm-1,\n  .col-sm-2,\n  .col-sm-3,\n  .col-sm-4,\n  .col-sm-5,\n  .col-sm-6,\n  .col-sm-7,\n  .col-sm-8,\n  .col-sm-9,\n  .col-sm-10,\n  .col-sm-11,\n  .col-sm-12,\n  .col-sm-offset-0,\n  .col-sm-offset-1,\n  .col-sm-offset-2,\n  .col-sm-offset-3,\n  .col-sm-offset-4,\n  .col-sm-offset-5,\n  .col-sm-offset-6,\n  .col-sm-offset-7,\n  .col-sm-offset-8,\n  .col-sm-offset-9,\n  .col-sm-offset-10,\n  .col-sm-offset-11,\n  .col-sm-offset-12 {\n    box-sizing: border-box;\n    -webkit-box-flex: 0;\n    -ms-flex: 0 0 auto;\n    flex: 0 0 auto;\n    padding-right: 0.5rem;\n    padding-left: 0.5rem;\n  }\n\n  .col-sm {\n    -webkit-box-flex: 1;\n    -ms-flex-positive: 1;\n    flex-grow: 1;\n    -ms-flex-preferred-size: 0;\n    flex-basis: 0;\n    max-width: 100%;\n  }\n\n  .col-sm-1 {\n    -ms-flex-preferred-size: 8.33333333%;\n    flex-basis: 8.33333333%;\n    max-width: 8.33333333%;\n  }\n\n  .col-sm-2 {\n    -ms-flex-preferred-size: 16.66666667%;\n    flex-basis: 16.66666667%;\n    max-width: 16.66666667%;\n  }\n\n  .col-sm-3 {\n    -ms-flex-preferred-size: 25%;\n    flex-basis: 25%;\n    max-width: 25%;\n  }\n\n  .col-sm-4 {\n    -ms-flex-preferred-size: 33.33333333%;\n    flex-basis: 33.33333333%;\n    max-width: 33.33333333%;\n  }\n\n  .col-sm-5 {\n    -ms-flex-preferred-size: 41.66666667%;\n    flex-basis: 41.66666667%;\n    max-width: 41.66666667%;\n  }\n\n  .col-sm-6 {\n    -ms-flex-preferred-size: 50%;\n    flex-basis: 50%;\n    max-width: 50%;\n  }\n\n  .col-sm-7 {\n    -ms-flex-preferred-size: 58.33333333%;\n    flex-basis: 58.33333333%;\n    max-width: 58.33333333%;\n  }\n\n  .col-sm-8 {\n    -ms-flex-preferred-size: 66.66666667%;\n    flex-basis: 66.66666667%;\n    max-width: 66.66666667%;\n  }\n\n  .col-sm-9 {\n    -ms-flex-preferred-size: 75%;\n    flex-basis: 75%;\n    max-width: 75%;\n  }\n\n  .col-sm-10 {\n    -ms-flex-preferred-size: 83.33333333%;\n    flex-basis: 83.33333333%;\n    max-width: 83.33333333%;\n  }\n\n  .col-sm-11 {\n    -ms-flex-preferred-size: 91.66666667%;\n    flex-basis: 91.66666667%;\n    max-width: 91.66666667%;\n  }\n\n  .col-sm-12 {\n    -ms-flex-preferred-size: 100%;\n    flex-basis: 100%;\n    max-width: 100%;\n  }\n\n  .col-sm-offset-0 {\n    margin-left: 0;\n  }\n\n  .col-sm-offset-1 {\n    margin-left: 8.33333333%;\n  }\n\n  .col-sm-offset-2 {\n    margin-left: 16.66666667%;\n  }\n\n  .col-sm-offset-3 {\n    margin-left: 25%;\n  }\n\n  .col-sm-offset-4 {\n    margin-left: 33.33333333%;\n  }\n\n  .col-sm-offset-5 {\n    margin-left: 41.66666667%;\n  }\n\n  .col-sm-offset-6 {\n    margin-left: 50%;\n  }\n\n  .col-sm-offset-7 {\n    margin-left: 58.33333333%;\n  }\n\n  .col-sm-offset-8 {\n    margin-left: 66.66666667%;\n  }\n\n  .col-sm-offset-9 {\n    margin-left: 75%;\n  }\n\n  .col-sm-offset-10 {\n    margin-left: 83.33333333%;\n  }\n\n  .col-sm-offset-11 {\n    margin-left: 91.66666667%;\n  }\n\n  .start-sm {\n    -webkit-box-pack: start;\n    -ms-flex-pack: start;\n    justify-content: flex-start;\n    text-align: start;\n  }\n\n  .center-sm {\n    -webkit-box-pack: center;\n    -ms-flex-pack: center;\n    justify-content: center;\n    text-align: center;\n  }\n\n  .end-sm {\n    -webkit-box-pack: end;\n    -ms-flex-pack: end;\n    justify-content: flex-end;\n    text-align: end;\n  }\n\n  .top-sm {\n    -webkit-box-align: start;\n    -ms-flex-align: start;\n    align-items: flex-start;\n  }\n\n  .middle-sm {\n    -webkit-box-align: center;\n    -ms-flex-align: center;\n    align-items: center;\n  }\n\n  .bottom-sm {\n    -webkit-box-align: end;\n    -ms-flex-align: end;\n    align-items: flex-end;\n  }\n\n  .around-sm {\n    -ms-flex-pack: distribute;\n    justify-content: space-around;\n  }\n\n  .between-sm {\n    -webkit-box-pack: justify;\n    -ms-flex-pack: justify;\n    justify-content: space-between;\n  }\n\n  .first-sm {\n    -webkit-box-ordinal-group: 0;\n    -ms-flex-order: -1;\n    order: -1;\n  }\n\n  .last-sm {\n    -webkit-box-ordinal-group: 2;\n    -ms-flex-order: 1;\n    order: 1;\n  }\n}\n\n@media only screen and (min-width: 64em) {\n  .container {\n    width: 65rem;\n  }\n\n  .col-md,\n  .col-md-1,\n  .col-md-2,\n  .col-md-3,\n  .col-md-4,\n  .col-md-5,\n  .col-md-6,\n  .col-md-7,\n  .col-md-8,\n  .col-md-9,\n  .col-md-10,\n  .col-md-11,\n  .col-md-12,\n  .col-md-offset-0,\n  .col-md-offset-1,\n  .col-md-offset-2,\n  .col-md-offset-3,\n  .col-md-offset-4,\n  .col-md-offset-5,\n  .col-md-offset-6,\n  .col-md-offset-7,\n  .col-md-offset-8,\n  .col-md-offset-9,\n  .col-md-offset-10,\n  .col-md-offset-11,\n  .col-md-offset-12 {\n    box-sizing: border-box;\n    -webkit-box-flex: 0;\n    -ms-flex: 0 0 auto;\n    flex: 0 0 auto;\n    padding-right: 0.5rem;\n    padding-left: 0.5rem;\n  }\n\n  .col-md {\n    -webkit-box-flex: 1;\n    -ms-flex-positive: 1;\n    flex-grow: 1;\n    -ms-flex-preferred-size: 0;\n    flex-basis: 0;\n    max-width: 100%;\n  }\n\n  .col-md-1 {\n    -ms-flex-preferred-size: 8.33333333%;\n    flex-basis: 8.33333333%;\n    max-width: 8.33333333%;\n  }\n\n  .col-md-2 {\n    -ms-flex-preferred-size: 16.66666667%;\n    flex-basis: 16.66666667%;\n    max-width: 16.66666667%;\n  }\n\n  .col-md-3 {\n    -ms-flex-preferred-size: 25%;\n    flex-basis: 25%;\n    max-width: 25%;\n  }\n\n  .col-md-4 {\n    -ms-flex-preferred-size: 33.33333333%;\n    flex-basis: 33.33333333%;\n    max-width: 33.33333333%;\n  }\n\n  .col-md-5 {\n    -ms-flex-preferred-size: 41.66666667%;\n    flex-basis: 41.66666667%;\n    max-width: 41.66666667%;\n  }\n\n  .col-md-6 {\n    -ms-flex-preferred-size: 50%;\n    flex-basis: 50%;\n    max-width: 50%;\n  }\n\n  .col-md-7 {\n    -ms-flex-preferred-size: 58.33333333%;\n    flex-basis: 58.33333333%;\n    max-width: 58.33333333%;\n  }\n\n  .col-md-8 {\n    -ms-flex-preferred-size: 66.66666667%;\n    flex-basis: 66.66666667%;\n    max-width: 66.66666667%;\n  }\n\n  .col-md-9 {\n    -ms-flex-preferred-size: 75%;\n    flex-basis: 75%;\n    max-width: 75%;\n  }\n\n  .col-md-10 {\n    -ms-flex-preferred-size: 83.33333333%;\n    flex-basis: 83.33333333%;\n    max-width: 83.33333333%;\n  }\n\n  .col-md-11 {\n    -ms-flex-preferred-size: 91.66666667%;\n    flex-basis: 91.66666667%;\n    max-width: 91.66666667%;\n  }\n\n  .col-md-12 {\n    -ms-flex-preferred-size: 100%;\n    flex-basis: 100%;\n    max-width: 100%;\n  }\n\n  .col-md-offset-0 {\n    margin-left: 0;\n  }\n\n  .col-md-offset-1 {\n    margin-left: 8.33333333%;\n  }\n\n  .col-md-offset-2 {\n    margin-left: 16.66666667%;\n  }\n\n  .col-md-offset-3 {\n    margin-left: 25%;\n  }\n\n  .col-md-offset-4 {\n    margin-left: 33.33333333%;\n  }\n\n  .col-md-offset-5 {\n    margin-left: 41.66666667%;\n  }\n\n  .col-md-offset-6 {\n    margin-left: 50%;\n  }\n\n  .col-md-offset-7 {\n    margin-left: 58.33333333%;\n  }\n\n  .col-md-offset-8 {\n    margin-left: 66.66666667%;\n  }\n\n  .col-md-offset-9 {\n    margin-left: 75%;\n  }\n\n  .col-md-offset-10 {\n    margin-left: 83.33333333%;\n  }\n\n  .col-md-offset-11 {\n    margin-left: 91.66666667%;\n  }\n\n  .start-md {\n    -webkit-box-pack: start;\n    -ms-flex-pack: start;\n    justify-content: flex-start;\n    text-align: start;\n  }\n\n  .center-md {\n    -webkit-box-pack: center;\n    -ms-flex-pack: center;\n    justify-content: center;\n    text-align: center;\n  }\n\n  .end-md {\n    -webkit-box-pack: end;\n    -ms-flex-pack: end;\n    justify-content: flex-end;\n    text-align: end;\n  }\n\n  .top-md {\n    -webkit-box-align: start;\n    -ms-flex-align: start;\n    align-items: flex-start;\n  }\n\n  .middle-md {\n    -webkit-box-align: center;\n    -ms-flex-align: center;\n    align-items: center;\n  }\n\n  .bottom-md {\n    -webkit-box-align: end;\n    -ms-flex-align: end;\n    align-items: flex-end;\n  }\n\n  .around-md {\n    -ms-flex-pack: distribute;\n    justify-content: space-around;\n  }\n\n  .between-md {\n    -webkit-box-pack: justify;\n    -ms-flex-pack: justify;\n    justify-content: space-between;\n  }\n\n  .first-md {\n    -webkit-box-ordinal-group: 0;\n    -ms-flex-order: -1;\n    order: -1;\n  }\n\n  .last-md {\n    -webkit-box-ordinal-group: 2;\n    -ms-flex-order: 1;\n    order: 1;\n  }\n}\n\n@media only screen and (min-width: 75em) {\n  .container {\n    width: 76rem;\n  }\n\n  .col-lg,\n  .col-lg-1,\n  .col-lg-2,\n  .col-lg-3,\n  .col-lg-4,\n  .col-lg-5,\n  .col-lg-6,\n  .col-lg-7,\n  .col-lg-8,\n  .col-lg-9,\n  .col-lg-10,\n  .col-lg-11,\n  .col-lg-12,\n  .col-lg-offset-0,\n  .col-lg-offset-1,\n  .col-lg-offset-2,\n  .col-lg-offset-3,\n  .col-lg-offset-4,\n  .col-lg-offset-5,\n  .col-lg-offset-6,\n  .col-lg-offset-7,\n  .col-lg-offset-8,\n  .col-lg-offset-9,\n  .col-lg-offset-10,\n  .col-lg-offset-11,\n  .col-lg-offset-12 {\n    box-sizing: border-box;\n    -webkit-box-flex: 0;\n    -ms-flex: 0 0 auto;\n    flex: 0 0 auto;\n    padding-right: 0.5rem;\n    padding-left: 0.5rem;\n  }\n\n  .col-lg {\n    -webkit-box-flex: 1;\n    -ms-flex-positive: 1;\n    flex-grow: 1;\n    -ms-flex-preferred-size: 0;\n    flex-basis: 0;\n    max-width: 100%;\n  }\n\n  .col-lg-1 {\n    -ms-flex-preferred-size: 8.33333333%;\n    flex-basis: 8.33333333%;\n    max-width: 8.33333333%;\n  }\n\n  .col-lg-2 {\n    -ms-flex-preferred-size: 16.66666667%;\n    flex-basis: 16.66666667%;\n    max-width: 16.66666667%;\n  }\n\n  .col-lg-3 {\n    -ms-flex-preferred-size: 25%;\n    flex-basis: 25%;\n    max-width: 25%;\n  }\n\n  .col-lg-4 {\n    -ms-flex-preferred-size: 33.33333333%;\n    flex-basis: 33.33333333%;\n    max-width: 33.33333333%;\n  }\n\n  .col-lg-5 {\n    -ms-flex-preferred-size: 41.66666667%;\n    flex-basis: 41.66666667%;\n    max-width: 41.66666667%;\n  }\n\n  .col-lg-6 {\n    -ms-flex-preferred-size: 50%;\n    flex-basis: 50%;\n    max-width: 50%;\n  }\n\n  .col-lg-7 {\n    -ms-flex-preferred-size: 58.33333333%;\n    flex-basis: 58.33333333%;\n    max-width: 58.33333333%;\n  }\n\n  .col-lg-8 {\n    -ms-flex-preferred-size: 66.66666667%;\n    flex-basis: 66.66666667%;\n    max-width: 66.66666667%;\n  }\n\n  .col-lg-9 {\n    -ms-flex-preferred-size: 75%;\n    flex-basis: 75%;\n    max-width: 75%;\n  }\n\n  .col-lg-10 {\n    -ms-flex-preferred-size: 83.33333333%;\n    flex-basis: 83.33333333%;\n    max-width: 83.33333333%;\n  }\n\n  .col-lg-11 {\n    -ms-flex-preferred-size: 91.66666667%;\n    flex-basis: 91.66666667%;\n    max-width: 91.66666667%;\n  }\n\n  .col-lg-12 {\n    -ms-flex-preferred-size: 100%;\n    flex-basis: 100%;\n    max-width: 100%;\n  }\n\n  .col-lg-offset-0 {\n    margin-left: 0;\n  }\n\n  .col-lg-offset-1 {\n    margin-left: 8.33333333%;\n  }\n\n  .col-lg-offset-2 {\n    margin-left: 16.66666667%;\n  }\n\n  .col-lg-offset-3 {\n    margin-left: 25%;\n  }\n\n  .col-lg-offset-4 {\n    margin-left: 33.33333333%;\n  }\n\n  .col-lg-offset-5 {\n    margin-left: 41.66666667%;\n  }\n\n  .col-lg-offset-6 {\n    margin-left: 50%;\n  }\n\n  .col-lg-offset-7 {\n    margin-left: 58.33333333%;\n  }\n\n  .col-lg-offset-8 {\n    margin-left: 66.66666667%;\n  }\n\n  .col-lg-offset-9 {\n    margin-left: 75%;\n  }\n\n  .col-lg-offset-10 {\n    margin-left: 83.33333333%;\n  }\n\n  .col-lg-offset-11 {\n    margin-left: 91.66666667%;\n  }\n\n  .start-lg {\n    -webkit-box-pack: start;\n    -ms-flex-pack: start;\n    justify-content: flex-start;\n    text-align: start;\n  }\n\n  .center-lg {\n    -webkit-box-pack: center;\n    -ms-flex-pack: center;\n    justify-content: center;\n    text-align: center;\n  }\n\n  .end-lg {\n    -webkit-box-pack: end;\n    -ms-flex-pack: end;\n    justify-content: flex-end;\n    text-align: end;\n  }\n\n  .top-lg {\n    -webkit-box-align: start;\n    -ms-flex-align: start;\n    align-items: flex-start;\n  }\n\n  .middle-lg {\n    -webkit-box-align: center;\n    -ms-flex-align: center;\n    align-items: center;\n  }\n\n  .bottom-lg {\n    -webkit-box-align: end;\n    -ms-flex-align: end;\n    align-items: flex-end;\n  }\n\n  .around-lg {\n    -ms-flex-pack: distribute;\n    justify-content: space-around;\n  }\n\n  .between-lg {\n    -webkit-box-pack: justify;\n    -ms-flex-pack: justify;\n    justify-content: space-between;\n  }\n\n  .first-lg {\n    -webkit-box-ordinal-group: 0;\n    -ms-flex-order: -1;\n    order: -1;\n  }\n\n  .last-lg {\n    -webkit-box-ordinal-group: 2;\n    -ms-flex-order: 1;\n    order: 1;\n  }\n}", ""]);

// exports


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(9);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../dragon-web/node_modules/css-loader/index.js!./dragon.css", function() {
			var newContent = require("!!../dragon-web/node_modules/css-loader/index.js!./dragon.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, ".gu-mirror {\n  position: fixed !important;\n  margin: 0 !important;\n  z-index: 9999 !important;\n  opacity: 0.8;\n  -ms-filter: \"progid:DXImageTransform.Microsoft.Alpha(Opacity=80)\";\n  filter: alpha(opacity=80);\n}\n.gu-mirror-abs {\n  position: absolute !important;\n  margin: 0 !important;\n  z-index: 9999 !important;\n  opacity: 0.8;\n  -ms-filter: \"progid:DXImageTransform.Microsoft.Alpha(Opacity=80)\";\n  filter: alpha(opacity=80);\n}\n.gu-hide {\n  display: none !important;\n}\n.gu-unselectable {\n  -webkit-user-select: none !important;\n  -moz-user-select: none !important;\n  -ms-user-select: none !important;\n  user-select: none !important;\n}\n.gu-transit {\n  opacity: 0.2;\n  -ms-filter: \"progid:DXImageTransform.Microsoft.Alpha(Opacity=20)\";\n  filter: alpha(opacity=20);\n}\n", ""]);

// exports


/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {function middle(e,t){var r=function t(){var i=Array.prototype.slice.call(arguments);return void 0===r._m_ctx&&(r._m_ctx=this),r._m_stack.length===r._m_index?(r._m_index=0,e.apply(r._m_ctx,i)):(i.unshift(t),r._m_stack[r._m_index++].apply(r._m_ctx,i))};return r._m_stack=[],r._m_index=0,r._m_ctx=t,r.use=function(e,t){r._m_stack.push(e.bind(t))},r}function decorator(e,t,r){if(e){var i=r.writable,o=r.enumerable;return{get:function(){var e=middle(r.value,this);return Object.defineProperty(this,t,{value:e,writable:i,enumerable:o}),e}}}}function _applyDecoratedDescriptor$3(e,t,r,i,o){var n={};return Object.keys(i).forEach(function(e){n[e]=i[e]}),n.enumerable=!!n.enumerable,n.configurable=!!n.configurable,("value"in n||n.initializer)&&(n.writable=!0),n=r.slice().reverse().reduce(function(r,i){return i(e,t,r)||r},n),o&&void 0!==n.initializer&&(n.value=n.initializer?n.initializer.call(o):void 0,n.initializer=void 0),void 0===n.initializer&&(Object.defineProperty(e,t,n),n=null),n}function _applyDecoratedDescriptor$2(e,t,r,i,o){var n={};return Object.keys(i).forEach(function(e){n[e]=i[e]}),n.enumerable=!!n.enumerable,n.configurable=!!n.configurable,("value"in n||n.initializer)&&(n.writable=!0),n=r.slice().reverse().reduce(function(r,i){return i(e,t,r)||r},n),o&&void 0!==n.initializer&&(n.value=n.initializer?n.initializer.call(o):void 0,n.initializer=void 0),void 0===n.initializer&&(Object.defineProperty(e,t,n),n=null),n}function _applyDecoratedDescriptor$1(e,t,r,i,o){var n={};return Object.keys(i).forEach(function(e){n[e]=i[e]}),n.enumerable=!!n.enumerable,n.configurable=!!n.configurable,("value"in n||n.initializer)&&(n.writable=!0),n=r.slice().reverse().reduce(function(r,i){return i(e,t,r)||r},n),o&&void 0!==n.initializer&&(n.value=n.initializer?n.initializer.call(o):void 0,n.initializer=void 0),void 0===n.initializer&&(Object.defineProperty(e,t,n),n=null),n}function _applyDecoratedDescriptor(e,t,r,i,o){var n={};return Object.keys(i).forEach(function(e){n[e]=i[e]}),n.enumerable=!!n.enumerable,n.configurable=!!n.configurable,("value"in n||n.initializer)&&(n.writable=!0),n=r.slice().reverse().reduce(function(r,i){return i(e,t,r)||r},n),o&&void 0!==n.initializer&&(n.value=n.initializer?n.initializer.call(o):void 0,n.initializer=void 0),void 0===n.initializer&&(Object.defineProperty(e,t,n),n=null),n}function getImmediateChild(e,t){for(var r=t;r!==e&&getParent(r)!==e;)r=getParent(r);return r===docElm$1?null:r}function getReference(e,t,r,i,o,n){function s(e){return e?nextEl(t):t}var a="horizontal"===o;return n&&(r-=getScroll("scrollLeft","pageXOffset"),i-=getScroll("scrollTop","pageYOffset")),t!==e?function(){var e=t.getBoundingClientRect();return s(a?r>e.left+getRectWidth(e)/2:i>e.top+getRectHeight(e)/2)}():function(){var t=e.children.length,o=void 0,n=void 0,s=void 0;for(o=0;o<t;o++){if(n=e.children[o],s=n.getBoundingClientRect(),a&&s.left+s.width/2>r)return n;if(!a&&s.top+s.height/2>i)return n}return null}()}function getCoord(e,t){var r=getEventHost(t),i={pageX:"clientX",pageY:"clientY"};return e in i&&!(e in r)&&i[e]in r&&(e=i[e]),r[e]}function getEventHost(e){return e.targetTouches&&e.targetTouches.length?e.targetTouches[0]:e.changedTouches&&e.changedTouches.length?e.changedTouches[0]:e}function getOffset(e,t){var r=e.getBoundingClientRect(),i={left:r.left+getScroll("scrollLeft","pageXOffset"),top:r.top+getScroll("scrollTop","pageYOffset")};return t&&(i.width=getRectWidth(r),i.height=getRectHeight(r)),i}function getScroll(e,t){return void 0!==global[t]?global[t]:docElm$1.clientHeight?docElm$1[e]:doc$1.body[e]}function getElementBehindPoint(e,t,r,i){var o=e.className,n=void 0;return e.className+=" gu-hide",n=doc$1.elementFromPoint(i?t-getScroll("scrollLeft","pageXOffset"):t,i?r-getScroll("scrollTop","pageYOffset"):r),e.className=o,n}function getRectWidth(e){return e.width||e.right-e.left}function getRectHeight(e){return e.height||e.bottom-e.top}function getParent(e){return e.parentNode===doc$1?null:e.parentNode}function nextEl(e){return e.nextElementSibling||function(){var t=e;do{t=t.nextSibling}while(t&&1!==t.nodeType);return t}()}function toArray$1(e){return[].slice.call(e)}function ensureArray(e){return Array.isArray(e)?e:e.length&&0!=e.length?toArray$1(e):[e]}function bind(e,t){var r="_binded_"+t;return e[r]||(e[r]=function(){return e[t].apply(e,arguments)}),e[r]}function domIndexOf(e,t){return Array.prototype.indexOf.call(e.children,t)}function isInput(e){return"INPUT"===e.tagName||"TEXTAREA"===e.tagName||"SELECT"===e.tagName||isEditable(e)}function isEditable(e){return!!e&&("false"!==e.contentEditable&&("true"===e.contentEditable||isEditable(getParent(e))))}function getIndexByElm(e,t){for(var r=e.length,i=0;i<r;i++)if(e[i].elm==t)return i;return-1}function useNative(){try{var e=new NativeCustomEvent("cat",{detail:{foo:"bar"}});return"cat"===e.type&&"bar"===e.detail.foo}catch(e){}return!1}function addEventEasy(e,t,r,i){return e.addEventListener(t,r,i)}function addEventHard(e,t,r){return e.attachEvent("on"+t,wrap(e,t,r))}function removeEventEasy(e,t,r,i){return e.removeEventListener(t,r,i)}function removeEventHard(e,t,r){var i=unwrap(e,t,r);if(i)return e.detachEvent("on"+t,i)}function fabricateEvent(e,t,r){var i=-1===eventmap_1.indexOf(t)?function(){return new index(t,{detail:r})}():function(){var e;return doc$2.createEvent?(e=doc$2.createEvent("Event")).initEvent(t,!0,!0):doc$2.createEventObject&&(e=doc$2.createEventObject()),e}();e.dispatchEvent?e.dispatchEvent(i):e.fireEvent("on"+t,i)}function wrapperFactory(e,t,r){return function(t){var i=t||commonjsGlobal.event;i.target=i.target||i.srcElement,i.preventDefault=i.preventDefault||function(){i.returnValue=!1},i.stopPropagation=i.stopPropagation||function(){i.cancelBubble=!0},i.which=i.which||i.keyCode,r.call(e,i)}}function wrap(e,t,r){var i=unwrap(e,t,r)||wrapperFactory(e,t,r);return hardCache.push({wrapper:i,element:e,type:t,fn:r}),i}function unwrap(e,t,r){var i=find(e,t,r);if(i){var o=hardCache[i].wrapper;return hardCache.splice(i,1),o}}function find(e,t,r){var i,o;for(i=0;i<hardCache.length;i++)if((o=hardCache[i]).element===e&&o.type===t&&o.fn===r)return i}function touchy(e,t,r,i){var o={mouseup:"touchend",mousedown:"touchstart",mousemove:"touchmove"},n={mouseup:"pointerup",mousedown:"pointerdown",mousemove:"pointermove"},s={mouseup:"MSPointerUp",mousedown:"MSPointerDown",mousemove:"MSPointerMove"};global.navigator.pointerEnabled?crossvent[t](e,n[r]||r,i):global.navigator.msPointerEnabled?crossvent[t](e,s[r]||r,i):(crossvent[t](e,o[r]||r,i),crossvent[t](e,r,i))}function lookupClass(e){var t=cache[e];return t?t.lastIndex=0:cache[e]=t=new RegExp(start+e+end,"g"),t}function addClass(e,t){var r=e.className;r.length?lookupClass(t).test(r)||(e.className+=" "+t):e.className=t}function rmClass(e,t){e.className=e.className.replace(lookupClass(t)," ").trim()}function dragon(e){return new Dragon(e,utils$1,touchy,classes)}!function(){function e(e){this.el=e;for(var t=e.className.replace(/^\s+|\s+$/g,"").split(/\s+/),i=0;i<t.length;i++)r.call(this,t[i])}if(!(void 0===window.Element||"classList"in document.documentElement)){var t=Array.prototype,r=t.push,i=t.splice,o=t.join;e.prototype={add:function(e){this.contains(e)||(r.call(this,e),this.el.className=this.toString())},contains:function(e){return-1!=this.el.className.indexOf(e)},item:function(e){return this[e]||null},remove:function(e){if(this.contains(e)){var t=void 0;for(t=0;t<this.length&&this[t]!=e;t++);i.call(this,t,1),this.el.className=this.toString()}},toString:function(){return o.call(this," ")},toggle:function(e){return this.contains(e)?this.remove(e):this.add(e),this.contains(e)}},window.DOMTokenList=e,function(e,t,r){Object.defineProperty?Object.defineProperty(e,t,{get:r}):e.__defineGetter__(t,r)}(Element.prototype,"classList",function(){return new e(this)})}}();var classCallCheck=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")},createClass=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}(),_class$3,docElm=document.documentElement,Drag=(_class$3=function(){function e(t){classCallCheck(this,e),this.id="dragID_"+Date.now(),this.state="grabbed",this.item=t,this.itemElm=t.elm,this.sourceContainer=t.container,this.source=t.container.elm,this.dragon=this.sourceContainer.dragon,this.utils=this.dragon.utils,this.domEventManager=this.dragon.domEventManager,this.domClassManager=this.dragon.domClassManager,this.findDropTarget=this.dragon.findDropTarget.bind(this.dragon),this.getConfig("mouseEvents")&&this.mouseEvents()}return createClass(e,[{key:"destroy",value:function(){this.release(this.x,this.y)}},{key:"mouseEvents",value:function(e){this._mousemove||(window.requestAnimationFrame?(this.move_e=null,this._mousemove=this._mousemoveAF):this._mousemove=this.mousemove);var t=e?"remove":"add";this.domEventManager(docElm,t,"mouseup",this.utils.bind(this,"mouseup")),this.domEventManager(docElm,t,"mousemove",this.utils.bind(this,"_mousemove")),this.domEventManager(docElm,t,"selectstart",this.utils.bind(this,"protectGrab")),this.domEventManager(docElm,t,"click",this.utils.bind(this,"protectGrab"))}},{key:"protectGrab",value:function(e){"grabbed"==this.state&&e.preventDefault()}},{key:"mousemove",value:function(e){return e.target||(e=this.move_e,this.move_e=!1),"grabbed"==this.state?void this.startByMouseMove(e):"dragging"!=this.state?void this.cancel():(e.preventDefault(),void this.drag(this.utils.getCoord("clientX",e),this.utils.getCoord("clientY",e)))}},{key:"_mousemoveAF",value:function(e){this.move_e||(this.actualFrame=window.requestAnimationFrame(this.mousemove)),this.move_e=e}},{key:"startByMouseMove",value:function(e){if(void 0==this.x)return this.x=e.clientX,void(this.y=e.clientY);if(void 0===e.clientX||e.clientX!==this.x||void 0===e.clientY||e.clientY!==this.y){var t=this.utils.getOffset(this.itemElm);this.start(this.utils.getCoord("pageX",e)-t.left,this.utils.getCoord("pageY",e)-t.top)}}},{key:"start",value:function(e,t){if("grabbed"==this.state){e=e||0,t=t||0,this._cachedAbs=this.getConfig("mirrorAbsolute"),this._cachedDir=this.getConfig("direction");var r=this._cachedAbs?this.utils.getOffset(this.itemElm):this.itemElm.getBoundingClientRect();void 0==this.x&&(this.x=r.left+e),void 0==this.y&&(this.y=r.top+t),this.itemOffsetX=e,this.itemOffsetY=t,this.initialSibling=this.currentSibling=this.utils.nextEl(this.itemElm),this.domClassManager.add(this.itemElm,"gu-transit"),this.renderMirrorImage(this.itemElm,this.getConfig("mirrorContainer")),this.state="dragging"}}},{key:"drag",value:function(e,t){if("dragging"==this.state){var r=e-this.itemOffsetX,i=t-this.itemOffsetY,o=this.mirror;this.x=e,this.y=t,o.style.left=r+"px",o.style.top=i+"px";var n=this.utils.getElementBehindPoint(o,e,t,this._cachedAbs),s=this.findDropTarget(n),a=void 0,c=s&&this.utils.getImmediateChild(s,n);c&&(null===(a=this.utils.getReference(s,c,e,t,this._cachedDir,this._cachedAbs))||a!==this.itemElm&&a!==this.utils.nextEl(this.itemElm))&&(this.currentSibling=a,s.insertBefore(this.itemElm,a))}}},{key:"renderMirrorImage",value:function(e,t){var r=e.getBoundingClientRect(),i=e.cloneNode(!0);i.style.width=this.utils.getRectWidth(r)+"px",i.style.height=this.utils.getRectHeight(r)+"px",this.domClassManager.rm(i,"gu-transit"),this.getConfig("mirrorAbsolute")?this.domClassManager.add(i,"gu-mirror-abs"):this.domClassManager.add(i,"gu-mirror"),t.appendChild(i),this.domClassManager.add(t,"gu-unselectable"),this.mirror=i}},{key:"removeMirrorImage",value:function(){var e=this.utils.getParent(this.mirror);this.domClassManager.rm(e,"gu-unselectable"),e.removeChild(this.mirror),this.mirror=null}},{key:"mouseup",value:function(e){this.release(this.utils.getCoord("clientX",e),this.utils.getCoord("clientY",e))}},{key:"release",value:function(e,t){if(void 0==e&&(e=this.x),void 0==t&&(t=this.y),"dragging"!=this.state)return this.cancel();this.actualFrame&&(window.cancelAnimationFrame(this.actualFrame),this.actualFrame=!1);var r=this.utils.getElementBehindPoint(this.mirror,e,t,this._cachedAbs),i=this.findDropTarget(r);i&&i!==this.source?this.drop(i):this.cancel()}},{key:"drop",value:function(e){"dragging"==this.state&&(this.dragon.getContainer(e).addItem(this.item,this.utils.domIndexOf(e,this.itemElm)),this.state="dropped",this.cleanup())}},{key:"remove",value:function(){if("dragging"==this.state){var e=this.utils.getParent(this.itemElm);e&&e.removeChild(this.itemElm),this.state="removed",this.cleanup()}}},{key:"cancel",value:function(e){if("dragging"==this.state){var t=this.utils.getParent(this.itemElm);!1===this.isInitialPlacement(t)&&e&&this.source.insertBefore(this.itemElm,this.initialSibling)}this.state="cancelled",this.cleanup()}},{key:"cleanup",value:function(){this.mouseEvents("remove"),this.mirror&&this.removeMirrorImage(),this.itemElm&&this.domClassManager.rm(this.itemElm,"gu-transit")}},{key:"isInitialPlacement",value:function(e,t){var r=void 0;return r=void 0!==t?t:this.mirror?this.currentSibling:this.utils.nextEl(this.itemElm),e===this.source&&r===this.initialSibling}},{key:"getConfig",value:function(e){return this.item.getConfig(e)}}]),e}(),_applyDecoratedDescriptor$3(_class$3.prototype,"destroy",[decorator],Object.getOwnPropertyDescriptor(_class$3.prototype,"destroy"),_class$3.prototype),_applyDecoratedDescriptor$3(_class$3.prototype,"mouseEvents",[decorator],Object.getOwnPropertyDescriptor(_class$3.prototype,"mouseEvents"),_class$3.prototype),_applyDecoratedDescriptor$3(_class$3.prototype,"protectGrab",[decorator],Object.getOwnPropertyDescriptor(_class$3.prototype,"protectGrab"),_class$3.prototype),_applyDecoratedDescriptor$3(_class$3.prototype,"mousemove",[decorator],Object.getOwnPropertyDescriptor(_class$3.prototype,"mousemove"),_class$3.prototype),_applyDecoratedDescriptor$3(_class$3.prototype,"startByMouseMove",[decorator],Object.getOwnPropertyDescriptor(_class$3.prototype,"startByMouseMove"),_class$3.prototype),_applyDecoratedDescriptor$3(_class$3.prototype,"start",[decorator],Object.getOwnPropertyDescriptor(_class$3.prototype,"start"),_class$3.prototype),_applyDecoratedDescriptor$3(_class$3.prototype,"drag",[decorator],Object.getOwnPropertyDescriptor(_class$3.prototype,"drag"),_class$3.prototype),_applyDecoratedDescriptor$3(_class$3.prototype,"renderMirrorImage",[decorator],Object.getOwnPropertyDescriptor(_class$3.prototype,"renderMirrorImage"),_class$3.prototype),_applyDecoratedDescriptor$3(_class$3.prototype,"removeMirrorImage",[decorator],Object.getOwnPropertyDescriptor(_class$3.prototype,"removeMirrorImage"),_class$3.prototype),_applyDecoratedDescriptor$3(_class$3.prototype,"mouseup",[decorator],Object.getOwnPropertyDescriptor(_class$3.prototype,"mouseup"),_class$3.prototype),_applyDecoratedDescriptor$3(_class$3.prototype,"release",[decorator],Object.getOwnPropertyDescriptor(_class$3.prototype,"release"),_class$3.prototype),_applyDecoratedDescriptor$3(_class$3.prototype,"drop",[decorator],Object.getOwnPropertyDescriptor(_class$3.prototype,"drop"),_class$3.prototype),_applyDecoratedDescriptor$3(_class$3.prototype,"remove",[decorator],Object.getOwnPropertyDescriptor(_class$3.prototype,"remove"),_class$3.prototype),_applyDecoratedDescriptor$3(_class$3.prototype,"cancel",[decorator],Object.getOwnPropertyDescriptor(_class$3.prototype,"cancel"),_class$3.prototype),_applyDecoratedDescriptor$3(_class$3.prototype,"cleanup",[decorator],Object.getOwnPropertyDescriptor(_class$3.prototype,"cleanup"),_class$3.prototype),_applyDecoratedDescriptor$3(_class$3.prototype,"isInitialPlacement",[decorator],Object.getOwnPropertyDescriptor(_class$3.prototype,"isInitialPlacement"),_class$3.prototype),_applyDecoratedDescriptor$3(_class$3.prototype,"getConfig",[decorator],Object.getOwnPropertyDescriptor(_class$3.prototype,"getConfig"),_class$3.prototype),_class$3),_class$2,Item=(_class$2=function(){function e(t,r,i){classCallCheck(this,e),i||(i={}),this.config=i,this.id=i.id||"itemID_"+Date.now(),this.container=t,this.elm=r}return createClass(e,[{key:"grab",value:function(){return this.drag=new Drag(this),this.drag}},{key:"getConfig",value:function(e){return e=this.config.hasOwnProperty(e)?this.config[e]:this.container.getConfig(e),"function"==typeof e?e():e}}]),e}(),_applyDecoratedDescriptor$2(_class$2.prototype,"grab",[decorator],Object.getOwnPropertyDescriptor(_class$2.prototype,"grab"),_class$2.prototype),_applyDecoratedDescriptor$2(_class$2.prototype,"getConfig",[decorator],Object.getOwnPropertyDescriptor(_class$2.prototype,"getConfig"),_class$2.prototype),_class$2),_class$1,Container=(_class$1=function(){function e(t,r,i){classCallCheck(this,e),i||(i={}),this.config=i,this.id=i.id||"containerID_"+Date.now(),this.dragon=t,this.utils=t.utils,this.items=[],this.elm=r,this._initItems()}return createClass(e,[{key:"grab",value:function(e){var t=this.items[this.utils.getIndexByElm(this.items,e)];return t?t.grab():null}},{key:"_initItem",value:function(e){this.addItem(e,this.items.length,null,!0)}},{key:"addItem",value:function(e,t,r,i){t=t||0;var o=void 0;if(e instanceof Item?(e.container=this,o=e):o=new Item(this,e,r),this.items.splice(t,0,o),!i&&!this.elm.contains(o.elm)){var n=this.elm.children[t];n?this.elm.insertBefore(o.elm,n):this.elm.appendChild(o.elm)}return o}},{key:"removeItem",value:function(e){var t=void 0,r=void 0;return e instanceof Item?(e.container=null,t=this.items.indexOf(e)):t=this.utils.getIndexByElm(this.items,e),r=this.items.splice(t,1)[0],this.elm.contains(r.elm)&&this.elm.removeChild(r.elm),r}},{key:"_initItems",value:function(){for(var e=this.utils.toArray(this.elm.children),t=e.length,r=0;r<t;r++)this._initItem(e[r])}},{key:"getConfig",value:function(e){return e=this.config.hasOwnProperty(e)?this.config[e]:this.dragon.getConfig(e),"function"==typeof e?e():e}}]),e}(),_applyDecoratedDescriptor$1(_class$1.prototype,"grab",[decorator],Object.getOwnPropertyDescriptor(_class$1.prototype,"grab"),_class$1.prototype),_applyDecoratedDescriptor$1(_class$1.prototype,"addItem",[decorator],Object.getOwnPropertyDescriptor(_class$1.prototype,"addItem"),_class$1.prototype),_applyDecoratedDescriptor$1(_class$1.prototype,"removeItem",[decorator],Object.getOwnPropertyDescriptor(_class$1.prototype,"removeItem"),_class$1.prototype),_applyDecoratedDescriptor$1(_class$1.prototype,"getConfig",[decorator],Object.getOwnPropertyDescriptor(_class$1.prototype,"getConfig"),_class$1.prototype),_class$1),_class,doc=document;window.dragonSpace||(window.dragonSpace={});var space=window.dragonSpace,Dragon=(_class=function(){function e(t,r,i,o){classCallCheck(this,e),1==(t=t||{}).nodeType&&(t={containers:[t]}),this.utils=r,void 0!==t.length&&(t={containers:this.utils.ensureArray(t)}),this.domEventManager=i,this.domClassManager=o,this.using=[],this.config=t,this.defaults={mouseEvents:!0,mirrorAbsolute:!1,mirrorContainer:doc.body},this.id=t.id||"dragonID_"+Date.now(),this.containers=[],this.initSpace(t.space),this.space=space,space.dragons.push(this),this.addContainers()}return createClass(e,[{key:"initSpace",value:function(t){var r=this;t&&(space=t),space.dragons||(space.dragons=[],space.drags=[],space.utils=this.utils,this.domEventManager(document.documentElement,"add","mousedown",function(e){if(e.preventDefault(),r.utils.isInput(e.target))return void e.target.focus();r.grab(e.clientX,e.clientY,e.target)})),space.Dragon||(space.Dragon=e)}},{key:"addContainers",value:function(e,t){if(e=e||this.config.containers){for(var r,i,o=(e=this.utils.ensureArray(e)).length,n=[],s=0;s<o;s++)r=e[s],this.getContainer(r)?console.warn("container already registered",r):(i=new Container(this,r,t),this.containers.push(i),n.push(i));return n}}},{key:"getContainer",value:function(e,t){if(t)return this.containers[this.utils.getIndexByElm(this.containers,e)];for(var r,i=space.dragons,o=i.length,n=0;n<o;n++)if((r=this.utils.getIndexByElm(i[n].containers,e))>-1)return i[n].containers[r];return null}},{key:"grab",value:function(e,t){var r=void 0==t?e:doc.elementFromPoint(e,t),i=r,o=void 0,n=void 0,s=void 0;do{r=i,i=this.utils.getParent(r)}while(i&&!this.getContainer(i));if(i)return n=this.utils.getIndexByElm(this.containers,i),o=this.containers[n],s=o.grab(r),space.drags.push(s),s}},{key:"findDropTarget",value:function(e){for(;e&&!this.getContainer(e);)e=this.utils.getParent(e);return e}},{key:"getConfig",value:function(e){return e=this.config.hasOwnProperty(e)?this.config[e]:this.defaults[e],"function"==typeof e?e():e}},{key:"use",value:function(e){var t=this;return Array.isArray(e)||(e=[e]),e.forEach(function(e){return t.using.indexOf(e)>-1?0:e(t)}),this}}]),e}(),_applyDecoratedDescriptor(_class.prototype,"initSpace",[decorator],Object.getOwnPropertyDescriptor(_class.prototype,"initSpace"),_class.prototype),_applyDecoratedDescriptor(_class.prototype,"addContainers",[decorator],Object.getOwnPropertyDescriptor(_class.prototype,"addContainers"),_class.prototype),_applyDecoratedDescriptor(_class.prototype,"getContainer",[decorator],Object.getOwnPropertyDescriptor(_class.prototype,"getContainer"),_class.prototype),_applyDecoratedDescriptor(_class.prototype,"grab",[decorator],Object.getOwnPropertyDescriptor(_class.prototype,"grab"),_class.prototype),_applyDecoratedDescriptor(_class.prototype,"findDropTarget",[decorator],Object.getOwnPropertyDescriptor(_class.prototype,"findDropTarget"),_class.prototype),_applyDecoratedDescriptor(_class.prototype,"getConfig",[decorator],Object.getOwnPropertyDescriptor(_class.prototype,"getConfig"),_class.prototype),_applyDecoratedDescriptor(_class.prototype,"use",[decorator],Object.getOwnPropertyDescriptor(_class.prototype,"use"),_class.prototype),_class),doc$1=document,docElm$1=doc$1.documentElement,utils={},utils$1=Object.freeze({default:utils,getImmediateChild:getImmediateChild,getReference:getReference,getCoord:getCoord,getEventHost:getEventHost,getOffset:getOffset,getScroll:getScroll,getElementBehindPoint:getElementBehindPoint,getRectWidth:getRectWidth,getRectHeight:getRectHeight,getParent:getParent,nextEl:nextEl,toArray:toArray$1,ensureArray:ensureArray,bind:bind,domIndexOf:domIndexOf,isInput:isInput,isEditable:isEditable,getIndexByElm:getIndexByElm}),commonjsGlobal="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},NativeCustomEvent=commonjsGlobal.CustomEvent,index=useNative()?NativeCustomEvent:"undefined"!=typeof document&&"function"==typeof document.createEvent?function(e,t){var r=document.createEvent("CustomEvent");return t?r.initCustomEvent(e,t.bubbles,t.cancelable,t.detail):r.initCustomEvent(e,!1,!1,void 0),r}:function(e,t){var r=document.createEventObject();return r.type=e,t?(r.bubbles=Boolean(t.bubbles),r.cancelable=Boolean(t.cancelable),r.detail=t.detail):(r.bubbles=!1,r.cancelable=!1,r.detail=void 0),r},eventmap=[],eventname="",ron=/^on/;for(eventname in commonjsGlobal)ron.test(eventname)&&eventmap.push(eventname.slice(2));var eventmap_1=eventmap,doc$2=commonjsGlobal.document,addEvent=addEventEasy,removeEvent=removeEventEasy,hardCache=[];commonjsGlobal.addEventListener||(addEvent=addEventHard,removeEvent=removeEventHard);var crossvent={add:addEvent,remove:removeEvent,fabricate:fabricateEvent},cache={},start="(?:^|\\s)",end="(?:\\s|$)",classes={add:addClass,rm:rmClass};/* harmony default export */ __webpack_exports__["a"] = (dragon);
//# sourceMappingURL=dragon.es.js.map

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(11)))

/***/ }),
/* 11 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ })
/******/ ]);