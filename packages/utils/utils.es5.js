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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
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
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var g;

// This works in non-strict mode
g = function () {
	return this;
}();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1, eval)("this");
} catch (e) {
	// This works if the window reference is available
	if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var cache = {};
var start = '(?:^|\\s)';
var end = '(?:\\s|$)';

function lookup(className) {

	var cached = cache[className];

	if (cached) {

		cached.lastIndex = 0;
	} else {

		cache[className] = cached = new RegExp(start + className + end, 'g');
	}

	return cached;
}

function add(el, className) {

	var current = el.className;

	if (!current.length) {

		el.className = className;
	} else if (!lookup(className).test(current)) {

		el.className += ' ' + className;
	}
}

function rm(el, className) {

	el.className = el.className.replace(lookup(className), ' ').trim();
}

exports.default = {
	add: add,
	rm: rm
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = touchy;

var _crossvent = __webpack_require__(3);

var _crossvent2 = _interopRequireDefault(_crossvent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function touchy(el, op, type, fn) {

	var touch = {
		mouseup: 'touchend',
		mousedown: 'touchstart',
		mousemove: 'touchmove'
	};

	var pointers = {
		mouseup: 'pointerup',
		mousedown: 'pointerdown',
		mousemove: 'pointermove'
	};

	var microsoft = {
		mouseup: 'MSPointerUp',
		mousedown: 'MSPointerDown',
		mousemove: 'MSPointerMove'

		/** @namespace global.navigator.pointerEnabled -- resolving webstorm unresolved variables */
		/** @namespace global.navigator.msPointerEnabled -- resolving webstorm unresolved variables */
	};if (global.navigator.pointerEnabled) {

		_crossvent2.default[op](el, pointers[type], fn, { passive: false });
	} else if (global.navigator.msPointerEnabled) {

		_crossvent2.default[op](el, microsoft[type], fn, { passive: false });
	} else {

		_crossvent2.default[op](el, touch[type], fn, { passive: false });
		_crossvent2.default[op](el, type, fn, { passive: false });
	}
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var customEvent = __webpack_require__(5);
var eventmap = __webpack_require__(4);
var doc = global.document;
var addEvent = addEventEasy;
var removeEvent = removeEventEasy;
var hardCache = [];

if (!global.addEventListener) {
  addEvent = addEventHard;
  removeEvent = removeEventHard;
}

module.exports = {
  add: addEvent,
  remove: removeEvent,
  fabricate: fabricateEvent
};

function addEventEasy(el, type, fn, capturing) {
  return el.addEventListener(type, fn, capturing);
}

function addEventHard(el, type, fn) {
  return el.attachEvent('on' + type, wrap(el, type, fn));
}

function removeEventEasy(el, type, fn, capturing) {
  return el.removeEventListener(type, fn, capturing);
}

function removeEventHard(el, type, fn) {
  var listener = unwrap(el, type, fn);
  if (listener) {
    return el.detachEvent('on' + type, listener);
  }
}

function fabricateEvent(el, type, model) {
  var e = eventmap.indexOf(type) === -1 ? makeCustomEvent() : makeClassicEvent();
  if (el.dispatchEvent) {
    el.dispatchEvent(e);
  } else {
    el.fireEvent('on' + type, e);
  }
  function makeClassicEvent() {
    var e;
    if (doc.createEvent) {
      e = doc.createEvent('Event');
      e.initEvent(type, true, true);
    } else if (doc.createEventObject) {
      e = doc.createEventObject();
    }
    return e;
  }
  function makeCustomEvent() {
    return new customEvent(type, { detail: model });
  }
}

function wrapperFactory(el, type, fn) {
  return function wrapper(originalEvent) {
    var e = originalEvent || global.event;
    e.target = e.target || e.srcElement;
    e.preventDefault = e.preventDefault || function preventDefault() {
      e.returnValue = false;
    };
    e.stopPropagation = e.stopPropagation || function stopPropagation() {
      e.cancelBubble = true;
    };
    e.which = e.which || e.keyCode;
    fn.call(el, e);
  };
}

function wrap(el, type, fn) {
  var wrapper = unwrap(el, type, fn) || wrapperFactory(el, type, fn);
  hardCache.push({
    wrapper: wrapper,
    element: el,
    type: type,
    fn: fn
  });
  return wrapper;
}

function unwrap(el, type, fn) {
  var i = find(el, type, fn);
  if (i) {
    var wrapper = hardCache[i].wrapper;
    hardCache.splice(i, 1); // free up a tad of memory
    return wrapper;
  }
}

function find(el, type, fn) {
  var i, item;
  for (i = 0; i < hardCache.length; i++) {
    item = hardCache[i];
    if (item.element === el && item.type === type && item.fn === fn) {
      return i;
    }
  }
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var eventmap = [];
var eventname = '';
var ron = /^on/;

for (eventname in global) {
  if (ron.test(eventname)) {
    eventmap.push(eventname.slice(2));
  }
}

module.exports = eventmap;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var NativeCustomEvent = global.CustomEvent;

function useNative() {
  try {
    var p = new NativeCustomEvent('cat', { detail: { foo: 'bar' } });
    return 'cat' === p.type && 'bar' === p.detail.foo;
  } catch (e) {}
  return false;
}

/**
 * Cross-browser `CustomEvent` constructor.
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent.CustomEvent
 *
 * @public
 */

module.exports = useNative() ? NativeCustomEvent :

// IE >= 9
'undefined' !== typeof document && 'function' === typeof document.createEvent ? function CustomEvent(type, params) {
  var e = document.createEvent('CustomEvent');
  if (params) {
    e.initCustomEvent(type, params.bubbles, params.cancelable, params.detail);
  } else {
    e.initCustomEvent(type, false, false, void 0);
  }
  return e;
} :

// IE <= 8
function CustomEvent(type, params) {
  var e = document.createEventObject();
  e.type = type;
  if (params) {
    e.bubbles = Boolean(params.bubbles);
    e.cancelable = Boolean(params.cancelable);
    e.detail = params.detail;
  } else {
    e.bubbles = false;
    e.cancelable = false;
    e.detail = void 0;
  }
  return e;
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.domClassManager = exports.domEventManager = undefined;
exports.setConfig = setConfig;
exports.getConfig = getConfig;
exports.getImmediateChild = getImmediateChild;
exports.getReference = getReference;
exports.getCoord = getCoord;
exports.getEventHost = getEventHost;
exports.whichMouseButton = whichMouseButton;
exports.getOffset = getOffset;
exports.getScroll = getScroll;
exports.getElementBehindPoint = getElementBehindPoint;
exports.getRectWidth = getRectWidth;
exports.getRectHeight = getRectHeight;
exports.getParent = getParent;
exports.nextEl = nextEl;
exports.toArray = toArray;
exports.ensureArray = ensureArray;
exports.bind = bind;
exports.domIndexOf = domIndexOf;
exports.isInput = isInput;
exports.isEditable = isEditable;
exports.getIndexByElm = getIndexByElm;
exports.hierarchySafe = hierarchySafe;

var _touchy = __webpack_require__(2);

var _touchy2 = _interopRequireDefault(_touchy);

var _domClasses = __webpack_require__(1);

var _domClasses2 = _interopRequireDefault(_domClasses);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* global global */
var doc = document; // cross dom event management

var docElm = doc.documentElement;

exports.default = {

	// domEventManager: touchy,
	// domClassManager: classes,
	// getConfig: getConfig,
	// getImmediateChild: getImmediateChild,
	// getReference: getReference,
	// getCoord: getCoord,
	// getEventHost: getEventHost,
	// getOffset: getOffset,
	// getScroll: getScroll,
	// getElementBehindPoint: getElementBehindPoint,
	// getRectWidth: getRectWidth,
	// getRectHeight: getRectHeight,
	// getParent: getParent,
	// nextEl: nextEl,
	// toArray: toArray,
	// bind: bind,
	// domIndexOf: domIndexOf,
	// isInput: isInput,
	// isEditable: isEditable,
	// getIndexByElm: getIndexByElm,
	// ensureArray: ensureArray,
};
exports.domEventManager = _touchy2.default;
exports.domClassManager = _domClasses2.default;
function setConfig(parent, config) {

	this.config = Object.assign(Object.create(parent.config), config);
}

function getConfig(prop) {

	prop = this.config[prop];
	return typeof prop == 'function' ? prop(this) : prop;
}

function getImmediateChild(dropTarget, target) {

	var immediate = target;

	while (immediate !== dropTarget && getParent(immediate) !== dropTarget) {
		immediate = getParent(immediate);
	}

	if (immediate === docElm) {
		return null;
	}

	return immediate;
}

function getReference(dropTarget, target, x, y, direction, abs) {

	var horizontal = direction === 'horizontal';

	if (abs) {
		x = x - getScroll('scrollLeft', 'pageXOffset');
		y = y - getScroll('scrollTop', 'pageYOffset');
	}
	return target !== dropTarget ? inside() : outside(); // reference

	function outside() {
		// slower, but able to figure out any position
		var len = dropTarget.children.length,
		    i = void 0,
		    el = void 0,
		    rect = void 0;

		for (i = 0; i < len; i++) {

			el = dropTarget.children[i];
			rect = el.getBoundingClientRect();

			if (horizontal && rect.left + rect.width / 2 > x) {
				return el;
			}

			if (!horizontal && rect.top + rect.height / 2 > y) {
				return el;
			}
		}

		return null;
	}

	function inside() {
		// faster, but only available if dropped inside a child element

		var rect = target.getBoundingClientRect();

		if (horizontal) {
			return resolve(x > rect.left + getRectWidth(rect) / 2);
		}

		return resolve(y > rect.top + getRectHeight(rect) / 2);
	}

	function resolve(after) {

		return after ? nextEl(target) : target;
	}
}

function getCoord(coord, e) {

	var host = getEventHost(e);
	var missMap = {
		pageX: 'clientX', // IE8
		pageY: 'clientY' // IE8
	};

	if (coord in missMap && !(coord in host) && missMap[coord] in host) {
		coord = missMap[coord];
	}

	return host[coord];
}

function getEventHost(e) {

	// on touchend event, we have to use `e.changedTouches`
	// see http://stackoverflow.com/questions/7192563/touchend-event-properties
	// see github.com/bevacqua/dragula/issues/34
	if (e.targetTouches && e.targetTouches.length) {
		return e.targetTouches[0];
	}

	if (e.changedTouches && e.changedTouches.length) {
		return e.changedTouches[0];
	}

	return e;
}

function whichMouseButton(e) {

	// if (e.touches !== void 0) { return e.touches.length }
	if (e.touches !== void 0) {
		return 1;
	} // accept all touches
	if (e.which !== void 0 && e.which !== 0) {
		return e.which;
	} // see github.com/bevacqua/dragula/issues/261
	if (e.buttons !== void 0) {
		return e.buttons;
	}
	var button = e.button;
	if (button !== void 0) {
		// see github.com/jquery/jquery/blob/99e8ff1baa7ae341e94bb89c3e84570c7c3ad9ea/src/event.js#L573-L575
		return button & 1 ? 1 : button & 2 ? 3 : button & 4 ? 2 : 0;
	}
}

// get offset of element from top left corner of document
function getOffset(el, size) {

	var rect = el.getBoundingClientRect();
	var result = {
		left: rect.left + getScroll('scrollLeft', 'pageXOffset'),
		top: rect.top + getScroll('scrollTop', 'pageYOffset')
	};

	if (size) {

		result.width = getRectWidth(rect);
		result.height = getRectHeight(rect);
	}

	return result;
}

function getScroll(scrollProp, offsetProp) {

	if (typeof global[offsetProp] !== 'undefined') {
		return global[offsetProp];
	}

	if (docElm.clientHeight) {
		return docElm[scrollProp];
	}

	return doc.body[scrollProp];
}

function getElementBehindPoint(elmToHide, x, y, abs) {

	var state = elmToHide.className;
	var el = void 0;

	// hide elmToHide
	elmToHide.className += ' dragon-hide';
	// look at the position
	el = doc.elementFromPoint(abs ? x - getScroll('scrollLeft', 'pageXOffset') : x, abs ? y - getScroll('scrollTop', 'pageYOffset') : y);
	// show elmToHide back
	elmToHide.className = state;

	return el;
}

function getRectWidth(rect) {

	return rect.width || rect.right - rect.left;
}

function getRectHeight(rect) {

	return rect.height || rect.bottom - rect.top;
}

function getParent(el) {

	return el.parentNode === doc ? null : el.parentNode;
}

function nextEl(el) {

	return el.nextElementSibling || manually();

	function manually() {
		var sibling = el;
		do {
			sibling = sibling.nextSibling;
		} while (sibling && sibling.nodeType !== 1);
		return sibling;
	}
}

function toArray(obj) {

	return [].slice.call(obj);
}

function ensureArray(it) {

	if (Array.isArray(it)) return it;else if (it.length && it.length != 0) return toArray(it);else return [it];
}

function bind(obj, methodName) {

	var bindedName = '_binded_' + methodName;

	if (!obj[bindedName]) obj[bindedName] = function () {
		return obj[methodName].apply(obj, arguments);
	};

	return obj[bindedName];
}

function domIndexOf(parent, child) {
	// Possible problems with IE8- ? https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/children#Browser_compatibility
	return Array.prototype.indexOf.call(parent.children, child);
}

function isInput(el) {
	return el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || isEditable(el);
}

function isEditable(el) {

	if (!el) {
		return false;
	}
	// no parents were editable
	if (el.contentEditable === 'false') {
		return false;
	}
	// stop the lookup
	if (el.contentEditable === 'true') {
		return true;
	}
	// found a contentEditable element in the chain
	return isEditable(getParent(el)); // contentEditable is set to 'inherit'
}

function getIndexByElm(sourceArray, elm) {

	var len = sourceArray.length;

	for (var i = 0; i < len; i++) {

		if (sourceArray[i].elm == elm) return i;
	}

	return -1;
}

function hierarchySafe(fn, success, fail) {

	try {
		// dom edit fn to protect
		fn();
		if (success) success();
	} catch (e) {
		// console.dir(e)
		if (e.name !== 'HierarchyRequestError') // fixing: Uncaught DOMException: Failed to execute 'insertBefore' on 'Node': The new child element contains the parent.
			console.error(e); // eslint-disable-line no-console

		if (fail) fail();
	}
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ })
/******/ ]);