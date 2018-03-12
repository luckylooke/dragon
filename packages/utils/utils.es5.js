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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
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
/* WEBPACK VAR INJECTION */(function(global) {

Object.defineProperty(exports, "__esModule", {
	value: true
});
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
/* global global */
var doc = document;
var docElm = doc.documentElement;

exports.default = {

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