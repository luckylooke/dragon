(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Dragon"] = factory();
	else
		root["Dragon"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
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
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
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


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "decorator", function() { return decorator; });
function middle(e,t){var _=function t(){var n=Array.prototype.slice.call(arguments);return void 0===_._m_ctx&&(_._m_ctx=this),_._m_stack.length===_._m_index?(_._m_index=0,e.apply(_._m_ctx,n)):(n.unshift(t),_._m_stack[_._m_index++].apply(_._m_ctx,n))};return _._m_stack=[],_._m_index=0,_._m_ctx=t,_.use=function(e,t){_._m_stack.push(e.bind(t))},_}function decorator(e,t,_){if(e){var n=_.writable,i=_.enumerable;return{get:function(){var e=middle(_.value,this);return Object.defineProperty(this,t,{value:e,writable:n,enumerable:i}),e}}}}/* harmony default export */ __webpack_exports__["default"] = (middle);
//# sourceMappingURL=middle.es.js.map


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/* global global */


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = Utils;
exports.getImmediateChild = getImmediateChild;
exports.getReference = getReference;
exports.getCoord = getCoord;
exports.getEventHost = getEventHost;
exports.getOffset = getOffset;
exports.getScroll = getScroll;
exports.getElementBehindPoint = getElementBehindPoint;
exports.getRectWidth = getRectWidth;
exports.getRectHeight = getRectHeight;
exports.getParent = getParent;
exports.nextEl = nextEl;
exports.toArray = toArray;
exports.bind = bind;
exports.domIndexOf = domIndexOf;
exports.isInput = isInput;
exports.isEditable = isEditable;
exports.getIndexByElm = getIndexByElm;
var doc = document;
var docElm = doc.documentElement;

function Utils() {}

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

// export function whichMouseButton (e) {
//   /** @namespace e.touches -- resolving webstorm unresolved variables */
//   if (e.touches !== void 0) { return e.touches.length }
//   if (e.which !== void 0 && e.which !== 0) { return e.which } // see github.com/bevacqua/dragula/issues/261
//   if (e.buttons !== void 0) { return e.buttons }
//   let button = e.button
//   if (button !== void 0) { // see github.com/jquery/jquery/blob/99e8ff1baa7ae341e94bb89c3e84570c7c3ad9ea/src/event.js#L573-L575
//     return button & 1 ? 1 : button & 2 ? 3 : (button & 4 ? 2 : 0)
//   }
// }

// get offset of element from top left corner of document
function getOffset(el, size) {

	var rect = el.getBoundingClientRect();
	var result = {
		left: rect.left + getScroll('scrollLeft', 'pageXOffset'),
		top: rect.top + getScroll('scrollTop', 'pageYOffset')
	};

	if (size) {

		result.width = rect.width || rect.right - rect.left;
		result.height = rect.height || rect.bottom - rect.top;
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
	elmToHide.className += ' gu-hide';
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

function bind(obj, methodName) {

	var bindedName = 'binded' + methodName;

	if (!obj[bindedName]) obj[bindedName] = function () {
		obj[methodName].apply(obj, arguments);
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
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/* global global, module, require */


var crossvent = __webpack_require__(11);

module.exports = function touchy(el, op, type, fn) {
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
	};

	/** @namespace global.navigator.pointerEnabled -- resolving webstorm unresolved variables */
	/** @namespace global.navigator.msPointerEnabled -- resolving webstorm unresolved variables */
	if (global.navigator.pointerEnabled) {
		crossvent[op](el, pointers[type] || type, fn);
	} else if (global.navigator.msPointerEnabled) {
		crossvent[op](el, microsoft[type] || type, fn);
	} else {
		crossvent[op](el, touch[type] || type, fn);
		crossvent[op](el, type, fn);
	}
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _desc, _value, _class; // Element.classList polyfill
// cross event


__webpack_require__(9);

var _touchy = __webpack_require__(3);

var _touchy2 = _interopRequireDefault(_touchy);

var _utils = __webpack_require__(2);

var utils = _interopRequireWildcard(_utils);

var _container = __webpack_require__(6);

var _container2 = _interopRequireDefault(_container);

var _middle = __webpack_require__(1);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
	var desc = {};
	Object['ke' + 'ys'](descriptor).forEach(function (key) {
		desc[key] = descriptor[key];
	});
	desc.enumerable = !!desc.enumerable;
	desc.configurable = !!desc.configurable;

	if ('value' in desc || desc.initializer) {
		desc.writable = true;
	}

	desc = decorators.slice().reverse().reduce(function (desc, decorator) {
		return decorator(target, property, desc) || desc;
	}, desc);

	if (context && desc.initializer !== void 0) {
		desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
		desc.initializer = undefined;
	}

	if (desc.initializer === void 0) {
		Object['define' + 'Property'](target, property, desc);
		desc = null;
	}

	return desc;
}

var doc = document;

if (!window.dragonSpace) window.dragonSpace = {};
var space = window.dragonSpace;

// ==============================================================================================================================================================
// Dragon =====================================================================================================================================================
// =============================================================================================================================================================
/** is group of containers */
var Dragon = (_class = function () {
	function Dragon(config) {
		_classCallCheck(this, Dragon);

		config = config || {};

		if (config.nodeType == 1) // is DOM Element
			config = { containers: [config] };

		if (typeof config.length !== 'undefined') // is array-like
			config = { containers: (0, _utils.toArray)(config) };

		this.initSpace(config.space);
		this.space = space;
		space.dragons.push(this);

		this.config = config;
		this.defaults = {
			mouseEvents: true,
			mirrorAbsolute: false,
			mirrorContainer: doc.body
		};
		this.id = config.id || 'dragonID_' + Date.now();
		this.containers = [];

		// init
		this.addContainers();
	}

	_createClass(Dragon, [{
		key: 'initSpace',
		value: function initSpace(newSpace) {
			var _this = this;

			if (newSpace) space = newSpace;

			if (!space.dragons) {
				// initialisation

				space.dragons = [];
				space.drags = [];
				space.utils = utils;

				(0, _touchy2.default)(document.documentElement, 'add', 'mousedown', function (e) {

					e.preventDefault(); // fixes github.com/bevacqua/dragula/issues/155

					if ((0, _utils.isInput)(e.target)) {
						// see also: github.com/bevacqua/dragula/issues/208
						e.target.focus(); // fixes github.com/bevacqua/dragula/issues/176
						return;
					}

					_this.grab(e.clientX, e.clientY, e.target);
				});
			}

			if (!space.Dragon) space.Dragon = Dragon;
		}
	}, {
		key: 'addContainers',
		value: function addContainers(containerElms, config) {

			containerElms = containerElms || this.config.containers;

			if (!containerElms) return;

			if (!Array.isArray(containerElms)) containerElms = [containerElms];

			var len = containerElms.length;
			var addedContainers = [];

			for (var i = 0, elm, container; i < len; i++) {

				elm = containerElms[i];

				if (this.getContainer(elm)) {

					/* eslint-disable no-console */
					console.warn('container already registered', elm);
					/* eslint-enable no-console */
				} else {

					container = new _container2.default(this, elm, config);
					this.containers.push(container);
					addedContainers.push(container);
				}
			}

			return addedContainers;
		}
	}, {
		key: 'getContainer',
		value: function getContainer(elm, own) {

			if (own) return this.containers[(0, _utils.getIndexByElm)(this.containers, elm)];

			var dragons = space.dragons;
			var dragonsLen = dragons.length;

			for (var i = 0, ii; i < dragonsLen; i++) {

				ii = (0, _utils.getIndexByElm)(dragons[i].containers, elm);

				if (ii > -1) return dragons[i].containers[ii];
			}

			return null;
		}
	}, {
		key: 'grab',
		value: function grab(xOrElm, y) {

			var itemElm = y == undefined ? xOrElm : doc.elementFromPoint(xOrElm, y);
			var parentElm = itemElm;
			var container = void 0;
			var index = void 0;
			var drag = void 0;

			do {
				itemElm = parentElm; // drag target should be a top element
				parentElm = (0, _utils.getParent)(itemElm);
			} while (parentElm && !this.getContainer(parentElm));

			if (!parentElm) {
				// container not found, so don't grab
				return;
			}

			index = (0, _utils.getIndexByElm)(this.containers, parentElm);
			container = this.containers[index];
			drag = container.grab(itemElm);
			space.drags.push(drag);
			return drag;
		}
	}, {
		key: 'findDropTarget',
		value: function findDropTarget(target) {

			while (target && !this.getContainer(target)) {
				target = (0, _utils.getParent)(target);
			}

			return target;
		}
	}, {
		key: 'getConfig',
		value: function getConfig(prop) {

			prop = this.config.hasOwnProperty(prop) ? this.config[prop] : this.defaults[prop];
			return typeof prop == 'function' ? prop() : prop;
		}
	}]);

	return Dragon;
}(), (_applyDecoratedDescriptor(_class.prototype, 'initSpace', [_middle.decorator], Object.getOwnPropertyDescriptor(_class.prototype, 'initSpace'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'addContainers', [_middle.decorator], Object.getOwnPropertyDescriptor(_class.prototype, 'addContainers'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'getContainer', [_middle.decorator], Object.getOwnPropertyDescriptor(_class.prototype, 'getContainer'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'grab', [_middle.decorator], Object.getOwnPropertyDescriptor(_class.prototype, 'grab'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'findDropTarget', [_middle.decorator], Object.getOwnPropertyDescriptor(_class.prototype, 'findDropTarget'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'getConfig', [_middle.decorator], Object.getOwnPropertyDescriptor(_class.prototype, 'getConfig'), _class.prototype)), _class);
exports.default = Dragon;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* global module */


var cache = {};
var start = '(?:^|\\s)';
var end = '(?:\\s|$)';

function lookupClass(className) {
	var cached = cache[className];
	if (cached) {
		cached.lastIndex = 0;
	} else {
		cache[className] = cached = new RegExp(start + className + end, 'g');
	}
	return cached;
}

function addClass(el, className) {
	var current = el.className;
	if (!current.length) {
		el.className = className;
	} else if (!lookupClass(className).test(current)) {
		el.className += ' ' + className;
	}
}

function rmClass(el, className) {
	el.className = el.className.replace(lookupClass(className), ' ').trim();
}

module.exports = {
	add: addClass,
	rm: rmClass
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _desc, _value, _class;

var _item = __webpack_require__(8);

var _item2 = _interopRequireDefault(_item);

var _utils = __webpack_require__(2);

var _middle = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
	var desc = {};
	Object['ke' + 'ys'](descriptor).forEach(function (key) {
		desc[key] = descriptor[key];
	});
	desc.enumerable = !!desc.enumerable;
	desc.configurable = !!desc.configurable;

	if ('value' in desc || desc.initializer) {
		desc.writable = true;
	}

	desc = decorators.slice().reverse().reduce(function (desc, decorator) {
		return decorator(target, property, desc) || desc;
	}, desc);

	if (context && desc.initializer !== void 0) {
		desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
		desc.initializer = undefined;
	}

	if (desc.initializer === void 0) {
		Object['define' + 'Property'](target, property, desc);
		desc = null;
	}

	return desc;
}

var Container = (_class = function () {
	function Container(dragon, elm, config) {
		_classCallCheck(this, Container);

		if (!config) config = {};

		this.config = config;
		this.id = config.id || 'containerID_' + Date.now();
		this.dragon = dragon;
		this.items = [];
		this.elm = elm;

		this._initItems();
	}

	_createClass(Container, [{
		key: 'grab',
		value: function grab(itemElm) {

			var item = this.items[(0, _utils.getIndexByElm)(this.items, itemElm)];
			return item ? item.grab() : null;
		}
	}, {
		key: '_initItem',
		value: function _initItem(itemOrElm) {

			this.addItem(itemOrElm, this.items.length, null, true);
		}
	}, {
		key: 'addItem',
		value: function addItem(itemOrElm, index, config, init) {

			index = index || 0;

			var item = void 0;

			if (itemOrElm instanceof _item2.default) {

				itemOrElm.container = this;
				item = itemOrElm;
			} else {

				item = new _item2.default(this, itemOrElm, config);
			}

			this.items.splice(index, 0, item);

			if (!init && !this.elm.contains(item.elm)) {
				// sync DOM
				var reference = this.elm.children[index];

				if (reference) this.elm.insertBefore(item.elm, reference);else this.elm.appendChild(item.elm);
			}

			return item;
		}
	}, {
		key: 'removeItem',
		value: function removeItem(itemOrElm) {

			var index = void 0;
			var item = void 0;

			if (itemOrElm instanceof _item2.default) {

				itemOrElm.container = null;
				index = this.items.indexOf(itemOrElm);
			} else {

				index = (0, _utils.getIndexByElm)(this.items, itemOrElm);
			}

			item = this.items.splice(index, 1)[0];

			if (this.elm.contains(item.elm)) {
				// sync DOM
				this.elm.removeChild(item.elm);
			}

			return item;
		}
	}, {
		key: '_initItems',
		value: function _initItems() {

			var arr = (0, _utils.toArray)(this.elm.children);
			var len = arr.length;

			for (var i = 0; i < len; i++) {
				this._initItem(arr[i]);
			}
		}
	}, {
		key: 'getConfig',
		value: function getConfig(prop) {

			prop = this.config.hasOwnProperty(prop) ? this.config[prop] : this.dragon.getConfig(prop);
			return typeof prop == 'function' ? prop() : prop;
		}
	}]);

	return Container;
}(), (_applyDecoratedDescriptor(_class.prototype, 'grab', [_middle.decorator], Object.getOwnPropertyDescriptor(_class.prototype, 'grab'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'addItem', [_middle.decorator], Object.getOwnPropertyDescriptor(_class.prototype, 'addItem'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'removeItem', [_middle.decorator], Object.getOwnPropertyDescriptor(_class.prototype, 'removeItem'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'getConfig', [_middle.decorator], Object.getOwnPropertyDescriptor(_class.prototype, 'getConfig'), _class.prototype)), _class);
exports.default = Container;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _desc, _value, _class; // cross event
// cross event
// cross event


var _touchy = __webpack_require__(3);

var _touchy2 = _interopRequireDefault(_touchy);

var _classes = __webpack_require__(5);

var _classes2 = _interopRequireDefault(_classes);

var _utils = __webpack_require__(2);

var _middle = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
	var desc = {};
	Object['ke' + 'ys'](descriptor).forEach(function (key) {
		desc[key] = descriptor[key];
	});
	desc.enumerable = !!desc.enumerable;
	desc.configurable = !!desc.configurable;

	if ('value' in desc || desc.initializer) {
		desc.writable = true;
	}

	desc = decorators.slice().reverse().reduce(function (desc, decorator) {
		return decorator(target, property, desc) || desc;
	}, desc);

	if (context && desc.initializer !== void 0) {
		desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
		desc.initializer = undefined;
	}

	if (desc.initializer === void 0) {
		Object['define' + 'Property'](target, property, desc);
		desc = null;
	}

	return desc;
}

var docElm = document.documentElement;

var Drag = (_class = function () {
	function Drag(item) {
		_classCallCheck(this, Drag);

		// this.mirror // mirror image
		// this.source // source container element
		// this.source // source Container object
		// this.itemElm // item element being dragged
		// this.itemOffsetX // reference x offset event from itemElement corner
		// this.itemOffsetY // reference y
		// this.x // reference move x - by default clientX + mirrorContainer.scrollX of first event occurrence starting the drag
		// this.y // reference move y
		// this.initialSibling // reference sibling when grabbed
		// this.currentSibling // reference sibling now
		// this.state // holds Drag state (grabbed, dragging, dropped...)

		this.state = 'grabbed';
		this.item = item;
		this.itemElm = item.elm;
		this.sourceContainer = item.container;
		this.source = item.container.elm;
		this.dragon = this.sourceContainer.dragon;
		this.findDropTarget = this.dragon.findDropTarget.bind(this.dragon);

		// use requestAnimationFrame while dragging if available
		if (window.requestAnimationFrame) {

			this._mousemove = this._mousemoveAF;
			this.move_e = false;
		} else this._mousemove = this.mousemove;

		if (this.getConfig('mouseEvents')) this.mouseEvents();
	}

	_createClass(Drag, [{
		key: 'destroy',
		value: function destroy() {

			this.release(this.x, this.y);
		}
	}, {
		key: 'mouseEvents',
		value: function mouseEvents(remove) {

			var op = remove ? 'remove' : 'add';
			(0, _touchy2.default)(docElm, op, 'mouseup', (0, _utils.bind)(this, 'mouseup'));
			(0, _touchy2.default)(docElm, op, 'mousemove', (0, _utils.bind)(this, '_mousemove'));
			(0, _touchy2.default)(docElm, op, 'selectstart', (0, _utils.bind)(this, 'protectGrab')); // IE8
			(0, _touchy2.default)(docElm, op, 'click', (0, _utils.bind)(this, 'protectGrab'));
		}
	}, {
		key: 'protectGrab',
		value: function protectGrab(e) {

			if (this.state == 'grabbed') {
				e.preventDefault();
			}
		}
	}, {
		key: 'mousemove',
		value: function mousemove(e) {

			if (!e.target) {

				e = this.move_e;
				this.move_e = false;
			}

			if (this.state == 'grabbed') {

				this.startByMouseMove(e);
				return;
			}

			if (this.state != 'dragging') {

				this.cancel();
				return;
			}

			e.preventDefault();

			this.drag((0, _utils.getCoord)('clientX', e), (0, _utils.getCoord)('clientY', e));
		}
	}, {
		key: '_mousemoveAF',
		value: function _mousemoveAF(e) {

			if (!this.move_e) this.actualFrame = window.requestAnimationFrame(this.mousemove);

			this.move_e = e;
		}
	}, {
		key: 'startByMouseMove',
		value: function startByMouseMove(e) {

			// if (whichMouseButton(e) === 0) {
			//   release({})
			//   return // when text is selected on an input and then dragged, mouseup doesn't fire. this is our only hope
			// }

			if (this.x == undefined) {

				this.x = e.clientX;
				this.y = e.clientY;
				return;
			}

			// truthy check fixes github.com/bevacqua/dragula/issues/239, equality fixes github.com/bevacqua/dragula/issues/207
			if (e.clientX !== void 0 && e.clientX === this.x && e.clientY !== void 0 && e.clientY === this.y) return;

			var offset = (0, _utils.getOffset)(this.itemElm);

			this.start((0, _utils.getCoord)('pageX', e) - offset.left, (0, _utils.getCoord)('pageY', e) - offset.top);
		}
	}, {
		key: 'start',
		value: function start(x, y) {

			if (this.state != 'grabbed') return;

			x = x || 0;
			y = y || 0;

			this._cachedAbs = this.getConfig('mirrorAbsolute');
			this._cachedDir = this.getConfig('direction');

			var itemPosition = this._cachedAbs ? (0, _utils.getOffset)(this.itemElm) : this.itemElm.getBoundingClientRect();

			if (this.x == undefined) this.x = itemPosition.left + x;

			if (this.y == undefined) this.y = itemPosition.top + y;

			// offset of mouse event from top left corner of the itemElm
			this.itemOffsetX = x;
			this.itemOffsetY = y;

			this.initialSibling = this.currentSibling = (0, _utils.nextEl)(this.itemElm);
			_classes2.default.add(this.itemElm, 'gu-transit');
			this.mirror = this.renderMirrorImage(this.itemElm, this.getConfig('mirrorContainer'));

			this.state = 'dragging';
		}
	}, {
		key: 'drag',
		value: function drag(x, y) {

			if (this.state != 'dragging') return;

			var mirrorX = x - this.itemOffsetX;
			var mirrorY = y - this.itemOffsetY;
			var mirror = this.mirror;

			this.x = x;
			this.y = y;

			mirror.style.left = mirrorX + 'px';
			mirror.style.top = mirrorY + 'px';

			var elementBehindPoint = (0, _utils.getElementBehindPoint)(mirror, x, y, this._cachedAbs);
			var dropTarget = this.findDropTarget(elementBehindPoint);
			var reference = void 0;
			var immediate = dropTarget && (0, _utils.getImmediateChild)(dropTarget, elementBehindPoint);

			if (immediate) {

				reference = (0, _utils.getReference)(dropTarget, immediate, x, y, this._cachedDir, this._cachedAbs);
			} else {

				return;
			}

			if (reference === null || reference !== this.itemElm && reference !== (0, _utils.nextEl)(this.itemElm)) {

				this.currentSibling = reference;
				dropTarget.insertBefore(this.itemElm, reference);
			}
		}
	}, {
		key: 'renderMirrorImage',
		value: function renderMirrorImage(itemElm, mirrorContainer) {

			var rect = itemElm.getBoundingClientRect();
			var mirror = itemElm.cloneNode(true);

			mirror.style.width = (0, _utils.getRectWidth)(rect) + 'px';
			mirror.style.height = (0, _utils.getRectHeight)(rect) + 'px';
			_classes2.default.rm(mirror, 'gu-transit');

			if (this.getConfig('mirrorAbsolute')) _classes2.default.add(mirror, 'gu-mirror-abs');else _classes2.default.add(mirror, 'gu-mirror');

			mirrorContainer.appendChild(mirror);
			_classes2.default.add(mirrorContainer, 'gu-unselectable');

			return mirror;
		}
	}, {
		key: 'removeMirrorImage',
		value: function removeMirrorImage(mirror) {

			var mirrorContainer = (0, _utils.getParent)(mirror);
			_classes2.default.rm(mirrorContainer, 'gu-unselectable');
			mirrorContainer.removeChild(mirror);
		}
	}, {
		key: 'mouseup',
		value: function mouseup(e) {

			this.release((0, _utils.getCoord)('clientX', e), (0, _utils.getCoord)('clientY', e));
		}
	}, {
		key: 'release',
		value: function release(x, y) {

			if (x == undefined) x = this.x;

			if (y == undefined) y = this.y;

			if (this.state != 'dragging') return this.cancel();

			// if requestAnimationFrame mode is used, cancel latest request
			if (this.actualFrame) {
				window.cancelAnimationFrame(this.actualFrame);
				this.actualFrame = false;
			}

			var elementBehindPoint = (0, _utils.getElementBehindPoint)(this.mirror, x, y, this._cachedAbs);
			var dropTarget = this.findDropTarget(elementBehindPoint);

			if (dropTarget && dropTarget !== this.source) {

				this.drop(dropTarget);
			} else {

				this.cancel();
			}
		}
	}, {
		key: 'drop',
		value: function drop(dropTarget) {

			if (this.state != 'dragging') return;

			var container = this.dragon.getContainer(dropTarget);
			container.addItem(this.item, (0, _utils.domIndexOf)(dropTarget, this.itemElm));
			this.state = 'dropped';

			this.cleanup();
		}
	}, {
		key: 'remove',
		value: function remove() {

			if (this.state != 'dragging') return;

			var parent = (0, _utils.getParent)(this.itemElm);
			if (parent) {
				parent.removeChild(this.itemElm);
			}

			this.state = 'removed';

			this.cleanup();
		}
	}, {
		key: 'cancel',
		value: function cancel(reverts) {

			if (this.state == 'dragging') {

				var parent = (0, _utils.getParent)(this.itemElm);
				var initial = this.isInitialPlacement(parent);
				if (initial === false && reverts) {
					this.source.insertBefore(this.itemElm, this.initialSibling);
				}
			}

			this.state = 'cancelled';

			this.cleanup();
		}
	}, {
		key: 'cleanup',
		value: function cleanup() {

			this.mouseEvents('remove');

			if (this.mirror) this.removeMirrorImage(this.mirror);

			if (this.itemElm) {
				_classes2.default.rm(this.itemElm, 'gu-transit');
			}
		}
	}, {
		key: 'isInitialPlacement',
		value: function isInitialPlacement(target, s) {

			var sibling = void 0;

			if (s !== void 0) {

				sibling = s;
			} else if (this.mirror) {

				sibling = this.currentSibling;
			} else {

				sibling = (0, _utils.nextEl)(this.itemElm);
			}

			return target === this.source && sibling === this.initialSibling;
		}
	}, {
		key: 'getConfig',
		value: function getConfig(prop) {

			return this.item.getConfig(prop);
		}
	}]);

	return Drag;
}(), (_applyDecoratedDescriptor(_class.prototype, 'destroy', [_middle.decorator], Object.getOwnPropertyDescriptor(_class.prototype, 'destroy'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'mouseEvents', [_middle.decorator], Object.getOwnPropertyDescriptor(_class.prototype, 'mouseEvents'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'protectGrab', [_middle.decorator], Object.getOwnPropertyDescriptor(_class.prototype, 'protectGrab'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'mousemove', [_middle.decorator], Object.getOwnPropertyDescriptor(_class.prototype, 'mousemove'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'startByMouseMove', [_middle.decorator], Object.getOwnPropertyDescriptor(_class.prototype, 'startByMouseMove'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'start', [_middle.decorator], Object.getOwnPropertyDescriptor(_class.prototype, 'start'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'drag', [_middle.decorator], Object.getOwnPropertyDescriptor(_class.prototype, 'drag'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'renderMirrorImage', [_middle.decorator], Object.getOwnPropertyDescriptor(_class.prototype, 'renderMirrorImage'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'removeMirrorImage', [_middle.decorator], Object.getOwnPropertyDescriptor(_class.prototype, 'removeMirrorImage'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'mouseup', [_middle.decorator], Object.getOwnPropertyDescriptor(_class.prototype, 'mouseup'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'release', [_middle.decorator], Object.getOwnPropertyDescriptor(_class.prototype, 'release'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'drop', [_middle.decorator], Object.getOwnPropertyDescriptor(_class.prototype, 'drop'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'remove', [_middle.decorator], Object.getOwnPropertyDescriptor(_class.prototype, 'remove'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'cancel', [_middle.decorator], Object.getOwnPropertyDescriptor(_class.prototype, 'cancel'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'cleanup', [_middle.decorator], Object.getOwnPropertyDescriptor(_class.prototype, 'cleanup'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'isInitialPlacement', [_middle.decorator], Object.getOwnPropertyDescriptor(_class.prototype, 'isInitialPlacement'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'getConfig', [_middle.decorator], Object.getOwnPropertyDescriptor(_class.prototype, 'getConfig'), _class.prototype)), _class);
exports.default = Drag;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _desc, _value, _class;

var _drag = __webpack_require__(7);

var _drag2 = _interopRequireDefault(_drag);

var _middle = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
	var desc = {};
	Object['ke' + 'ys'](descriptor).forEach(function (key) {
		desc[key] = descriptor[key];
	});
	desc.enumerable = !!desc.enumerable;
	desc.configurable = !!desc.configurable;

	if ('value' in desc || desc.initializer) {
		desc.writable = true;
	}

	desc = decorators.slice().reverse().reduce(function (desc, decorator) {
		return decorator(target, property, desc) || desc;
	}, desc);

	if (context && desc.initializer !== void 0) {
		desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
		desc.initializer = undefined;
	}

	if (desc.initializer === void 0) {
		Object['define' + 'Property'](target, property, desc);
		desc = null;
	}

	return desc;
}

var Item = (_class = function () {
	function Item(container, elm, config) {
		_classCallCheck(this, Item);

		if (!config) config = {};

		this.config = config;
		this.id = config.id || 'itemID_' + Date.now();
		this.container = container;
		this.elm = elm;
	}

	_createClass(Item, [{
		key: 'grab',
		value: function grab() {

			this.drag = new _drag2.default(this);
			return this.drag;
		}
	}, {
		key: 'getConfig',
		value: function getConfig(prop) {

			prop = this.config.hasOwnProperty(prop) ? this.config[prop] : this.container.getConfig(prop);
			return typeof prop == 'function' ? prop() : prop;
		}
	}]);

	return Item;
}(), (_applyDecoratedDescriptor(_class.prototype, 'grab', [_middle.decorator], Object.getOwnPropertyDescriptor(_class.prototype, 'grab'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'getConfig', [_middle.decorator], Object.getOwnPropertyDescriptor(_class.prototype, 'getConfig'), _class.prototype)), _class);
exports.default = Item;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Polyfill from https://github.com/remy/polyfills/blob/master/classList.js
 */

(function () {

	if (typeof window.Element === 'undefined' || 'classList' in document.documentElement) return;

	var prototype = Array.prototype,
	    push = prototype.push,
	    splice = prototype.splice,
	    join = prototype.join;

	function DOMTokenList(el) {
		this.el = el;
		// The className needs to be trimmed and split on whitespace
		// to retrieve a list of classes.
		var classes = el.className.replace(/^\s+|\s+$/g, '').split(/\s+/);
		for (var i = 0; i < classes.length; i++) {
			push.call(this, classes[i]);
		}
	}

	DOMTokenList.prototype = {
		add: function add(token) {
			if (this.contains(token)) return;
			push.call(this, token);
			this.el.className = this.toString();
		},
		contains: function contains(token) {
			return this.el.className.indexOf(token) != -1;
		},
		item: function item(index) {
			return this[index] || null;
		},
		remove: function remove(token) {
			if (!this.contains(token)) return;
			var i = void 0;
			for (i = 0; i < this.length; i++) {
				if (this[i] == token) break;
			}
			splice.call(this, i, 1);
			this.el.className = this.toString();
		},
		toString: function toString() {
			return join.call(this, ' ');
		},
		toggle: function toggle(token) {
			if (!this.contains(token)) {
				this.add(token);
			} else {
				this.remove(token);
			}

			return this.contains(token);
		}
	};

	window.DOMTokenList = DOMTokenList;

	function defineElementGetter(obj, prop, getter) {
		if (Object.defineProperty) {
			Object.defineProperty(obj, prop, {
				get: getter
			});
		} else {
			obj.__defineGetter__(prop, getter);
		}
	}

	defineElementGetter(Element.prototype, 'classList', function () {
		return new DOMTokenList(this);
	});
})();

/**
 * Polyfill from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now#Polyfill
 */

if (!Date.now) {
	Date.now = function now() {
		return new Date().getTime();
	};
}

// // Simple version of polyfill Array.prototype.forEach()
// if ( ![].forEach ) {
// 	Array.prototype.forEach = function ( callback, thisArg ) {
// 		let len = this.length;
// 		for ( let i = 0; i < len; i++ ) {
// 			callback.call( thisArg, this[ i ], i, this )
// 		}
// 	};
// }


/**
 * Polyfill from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#Polyfill
 */

if (!Function.prototype.bind) {
	Function.prototype.bind = function (oThis) {
		if (typeof this !== 'function') {
			// closest thing possible to the ECMAScript 5
			// internal IsCallable function
			throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
		}

		var aArgs = Array.prototype.slice.call(arguments, 1),
		    fToBind = this,
		    fNOP = function fNOP() {},
		    fBound = function fBound() {
			return fToBind.apply(this instanceof fNOP ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
		};

		if (this.prototype) {
			// Function.prototype doesn't have a prototype property
			fNOP.prototype = this.prototype;
		}
		fBound.prototype = new fNOP();

		return fBound;
	};
}

// Overwrites native 'children' prototype.
// Adds Document & DocumentFragment support for IE9 & Safari.
// Returns array instead of HTMLCollection.
// (function ( constructor ) {
// 	if ( constructor &&
// 		constructor.prototype &&
// 		constructor.prototype.children == null ) {
// 		Object.defineProperty( constructor.prototype, 'children', {
// 			get: function () {
// 				let i = 0, node, nodes = this.childNodes || [], children = []
// 				while ( node = nodes[ i++ ] ) {
// 					if ( node.nodeType === 1 ) {
// 						children.push( node )
// 					}
// 				}
// 				return children
// 			}
// 		} )
// 	}
// })( window.Node || window.Element )

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// workaround from https://github.com/webpack/webpack/issues/3929
module.exports = __webpack_require__(4).default;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var customEvent = __webpack_require__(13);
var eventmap = __webpack_require__(12);
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

function addEventEasy (el, type, fn, capturing) {
  return el.addEventListener(type, fn, capturing);
}

function addEventHard (el, type, fn) {
  return el.attachEvent('on' + type, wrap(el, type, fn));
}

function removeEventEasy (el, type, fn, capturing) {
  return el.removeEventListener(type, fn, capturing);
}

function removeEventHard (el, type, fn) {
  var listener = unwrap(el, type, fn);
  if (listener) {
    return el.detachEvent('on' + type, listener);
  }
}

function fabricateEvent (el, type, model) {
  var e = eventmap.indexOf(type) === -1 ? makeCustomEvent() : makeClassicEvent();
  if (el.dispatchEvent) {
    el.dispatchEvent(e);
  } else {
    el.fireEvent('on' + type, e);
  }
  function makeClassicEvent () {
    var e;
    if (doc.createEvent) {
      e = doc.createEvent('Event');
      e.initEvent(type, true, true);
    } else if (doc.createEventObject) {
      e = doc.createEventObject();
    }
    return e;
  }
  function makeCustomEvent () {
    return new customEvent(type, { detail: model });
  }
}

function wrapperFactory (el, type, fn) {
  return function wrapper (originalEvent) {
    var e = originalEvent || global.event;
    e.target = e.target || e.srcElement;
    e.preventDefault = e.preventDefault || function preventDefault () { e.returnValue = false; };
    e.stopPropagation = e.stopPropagation || function stopPropagation () { e.cancelBubble = true; };
    e.which = e.which || e.keyCode;
    fn.call(el, e);
  };
}

function wrap (el, type, fn) {
  var wrapper = unwrap(el, type, fn) || wrapperFactory(el, type, fn);
  hardCache.push({
    wrapper: wrapper,
    element: el,
    type: type,
    fn: fn
  });
  return wrapper;
}

function unwrap (el, type, fn) {
  var i = find(el, type, fn);
  if (i) {
    var wrapper = hardCache[i].wrapper;
    hardCache.splice(i, 1); // free up a tad of memory
    return wrapper;
  }
}

function find (el, type, fn) {
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
/* 12 */
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
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {
var NativeCustomEvent = global.CustomEvent;

function useNative () {
  try {
    var p = new NativeCustomEvent('cat', { detail: { foo: 'bar' } });
    return  'cat' === p.type && 'bar' === p.detail.foo;
  } catch (e) {
  }
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
'function' === typeof document.createEvent ? function CustomEvent (type, params) {
  var e = document.createEvent('CustomEvent');
  if (params) {
    e.initCustomEvent(type, params.bubbles, params.cancelable, params.detail);
  } else {
    e.initCustomEvent(type, false, false, void 0);
  }
  return e;
} :

// IE <= 8
function CustomEvent (type, params) {
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
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ })
/******/ ]);
});