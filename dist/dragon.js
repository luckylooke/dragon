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
/******/ 	return __webpack_require__(__webpack_require__.s = 9);
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
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

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
var doc = document,
    docElm = doc.documentElement;

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

function getReference(dropTarget, target, x, y, direction) {

	var horizontal = direction === 'horizontal';
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
	/** @namespace e.targetTouches -- resolving webstorm unresolved variables */
	/** @namespace e.changedTouches -- resolving webstorm unresolved variables */
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
//   if (e.touches !== void 0) { return e.touches.length; }
//   if (e.which !== void 0 && e.which !== 0) { return e.which; } // see github.com/bevacqua/dragula/issues/261
//   if (e.buttons !== void 0) { return e.buttons; }
//   let button = e.button;
//   if (button !== void 0) { // see github.com/jquery/jquery/blob/99e8ff1baa7ae341e94bb89c3e84570c7c3ad9ea/src/event.js#L573-L575
//     return button & 1 ? 1 : button & 2 ? 3 : (button & 4 ? 2 : 0);
//   }
// }

function getOffset(el) {

	var rect = el.getBoundingClientRect();
	return {
		left: rect.left + getScroll('scrollLeft', 'pageXOffset'),
		top: rect.top + getScroll('scrollTop', 'pageYOffset')
	};
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

function getElementBehindPoint(point, x, y) {

	var p = point || {},
	    state = p.className,
	    el = void 0;
	p.className += ' gu-hide';
	el = doc.elementFromPoint(x, y);
	p.className = state;
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
	return [].indexOf.call(parent.children, child);
}

function isInput(el) {
	return el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || isEditable(el);
}

function isEditable(el) {
	/** @namespace el.contentEditable -- resolving webstorm unresolved variables */
	if (!el) {
		return false;
	} // no parents were editable
	if (el.contentEditable === 'false') {
		return false;
	} // stop the lookup
	if (el.contentEditable === 'true') {
		return true;
	} // found a contentEditable element in the chain
	return isEditable(getParent(el)); // contentEditable is set to 'inherit'
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var crossvent = __webpack_require__(10);

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
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _desc, _value, _class; // Element.classList polyfill
// cross event


__webpack_require__(8);

var _touchy = __webpack_require__(2);

var _touchy2 = _interopRequireDefault(_touchy);

var _utils = __webpack_require__(1);

var _container = __webpack_require__(5);

var _container2 = _interopRequireDefault(_container);

var _middle = __webpack_require__(13);

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
/** is group of containers with same settings */
var Dragon = (_class = function () {
	function Dragon(config) {
		_classCallCheck(this, Dragon);

		config = config || {};

		if (typeof config.length !== 'undefined') // is array-like
			config = { containers: (0, _utils.toArray)(config) };

		this.initSpace(config.space);
		this.space = space;
		space.dragons.push(this);

		this.config = config;
		this.defaults = {
			mirrorContainer: doc.body
		};
		this.id = config.id || 'dragonID_' + Date.now();
		this.containers = [];
		this.containersLookUp = [];

		// init
		this.addContainers();
	}

	_createClass(Dragon, [{
		key: 'initSpace',
		value: function initSpace(newSpace) {

			if (newSpace) space = newSpace;

			if (!space.dragons) {
				// initialisation
				space.dragons = [];
				(0, _touchy2.default)(document.documentElement, 'add', 'mousedown', this.grab.bind(this));
			}

			if (!space.Dragon) space.Dragon = Dragon;
		}
	}, {
		key: 'addContainers',
		value: function addContainers(containerElms, config) {

			containerElms = containerElms || this.config.containers;

			if (!containerElms) return;

			var self = this;
			containerElms.forEach(function (elm) {
				if (self.containersLookUp.indexOf(elm) > -1) {
					console.warn('container already registered', elm);
					return;
				}

				var container = new _container2.default(self, elm, config);

				self.containers.push(container);
				self.containersLookUp.push(elm);
			});
		}
	}, {
		key: 'getContainer',
		value: function getContainer(el, own) {

			if (own) return this.containers[this.containersLookUp.indexOf(el)];

			var container = null;
			space.dragons.forEach(function (dragon) {
				if (dragon.containersLookUp.indexOf(el) != -1) container = dragon.containers[dragon.containersLookUp.indexOf(el)];
			});

			return container;
		}
	}, {
		key: 'grab',
		value: function grab(e) {

			var item = e.target;
			var source = void 0;
			var container = void 0;
			var index = void 0;

			if ((0, _utils.isInput)(item)) {
				// see also: github.com/bevacqua/dragula/issues/208
				e.target.focus(); // fixes github.com/bevacqua/dragula/issues/176
				return;
			}

			while ((0, _utils.getParent)(item) && !this.getContainer((0, _utils.getParent)(item), item, e)) {
				item = (0, _utils.getParent)(item); // drag target should be a top element
			}
			source = (0, _utils.getParent)(item);
			if (!source) {
				return;
			}

			index = this.containersLookUp.indexOf(source);
			container = this.containers[index];
			return container.grab(e, item, source);
		}
	}, {
		key: 'findDropTarget',
		value: function findDropTarget(elementBehindCursor) {

			var target = elementBehindCursor;
			while (target && !this.getContainer(target)) {
				target = (0, _utils.getParent)(target);
			}
			return target;
		}
	}, {
		key: 'getConfig',
		value: function getConfig(prop) {

			if (!prop) return this.config;

			prop = this.config.hasOwnProperty(prop) ? this.config[prop] : this.defaults[prop];
			return typeof prop == 'function' ? prop() : prop;
		}
	}]);

	return Dragon;
}(), (_applyDecoratedDescriptor(_class.prototype, 'initSpace', [_middle.decorator], Object.getOwnPropertyDescriptor(_class.prototype, 'initSpace'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'addContainers', [_middle.decorator], Object.getOwnPropertyDescriptor(_class.prototype, 'addContainers'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'getContainer', [_middle.decorator], Object.getOwnPropertyDescriptor(_class.prototype, 'getContainer'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'grab', [_middle.decorator], Object.getOwnPropertyDescriptor(_class.prototype, 'grab'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'findDropTarget', [_middle.decorator], Object.getOwnPropertyDescriptor(_class.prototype, 'findDropTarget'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'getConfig', [_middle.decorator], Object.getOwnPropertyDescriptor(_class.prototype, 'getConfig'), _class.prototype)), _class);
exports.default = Dragon;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _desc, _value, _class;

var _item = __webpack_require__(7);

var _item2 = _interopRequireDefault(_item);

var _utils = __webpack_require__(1);

var _middle = __webpack_require__(13);

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
		this.itemsLookUp = [];
		this.elm = elm;

		this.initItems();
	}

	_createClass(Container, [{
		key: 'grab',
		value: function grab(e, itemElm) {

			return this.items[this.itemsLookUp.indexOf(itemElm)].grab(e);
		}
	}, {
		key: 'addItem',
		value: function addItem(itemOrElm, index, config) {

			index = index || 0;

			var item = void 0,
			    elm = void 0;

			if (itemOrElm instanceof _item2.default) {

				itemOrElm.container = this;
				item = itemOrElm;
				elm = itemOrElm.elm;
			} else {

				item = new _item2.default(this, itemOrElm, config);
				elm = itemOrElm;
			}

			this.items.splice(index, 0, item);
			this.itemsLookUp.splice(index, 0, elm);
			return this;
		}
	}, {
		key: 'removeItem',
		value: function removeItem(itemOrElm) {

			var index = void 0;

			if (itemOrElm instanceof _item2.default) {

				itemOrElm.container = null;
				index = this.itemsLookUp.indexOf(itemOrElm.elm);
			} else {

				index = this.itemsLookUp.indexOf(itemOrElm);
			}

			this.items.splice(index, 1);
			this.itemsLookUp.splice(index, 1);
			return this;
		}
	}, {
		key: 'initItems',
		value: function initItems() {

			var self = this;

			(0, _utils.toArray)(this.elm.children).forEach(function (itemElm) {
				self.addItem(itemElm);
			});
		}
	}, {
		key: 'getConfig',
		value: function getConfig(prop) {

			if (!prop) return this.config;

			prop = this.config.hasOwnProperty(prop) ? this.config[prop] : this.dragon.getConfig(prop);
			return typeof prop == 'function' ? prop() : prop;
		}
	}]);

	return Container;
}(), (_applyDecoratedDescriptor(_class.prototype, 'grab', [_middle.decorator], Object.getOwnPropertyDescriptor(_class.prototype, 'grab'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'addItem', [_middle.decorator], Object.getOwnPropertyDescriptor(_class.prototype, 'addItem'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'removeItem', [_middle.decorator], Object.getOwnPropertyDescriptor(_class.prototype, 'removeItem'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'initItems', [_middle.decorator], Object.getOwnPropertyDescriptor(_class.prototype, 'initItems'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'getConfig', [_middle.decorator], Object.getOwnPropertyDescriptor(_class.prototype, 'getConfig'), _class.prototype)), _class);
exports.default = Container;

/***/ }),
/* 6 */
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


var _touchy = __webpack_require__(2);

var _touchy2 = _interopRequireDefault(_touchy);

var _classes = __webpack_require__(4);

var _classes2 = _interopRequireDefault(_classes);

var _utils = __webpack_require__(1);

var _middle = __webpack_require__(13);

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
	function Drag(e, item, container) {
		_classCallCheck(this, Drag);

		// this.mirror; // mirror image
		// this.source; // source container element
		// this.source; // source Container object
		// this.itemElm; // item element being dragged
		// this.offsetX; // reference x
		// this.offsetY; // reference y
		// this.moveX; // reference move x
		// this.moveY; // reference move y
		// this.initialSibling; // reference sibling when grabbed
		// this.currentSibling; // reference sibling now
		// this.state; // holds Drag state (grabbed, dragging, dropped...)

		e.preventDefault(); // fixes github.com/bevacqua/dragula/issues/155
		this.moveX = e.clientX;
		this.moveY = e.clientY;
		this.state = 'grabbed';

		this.item = item;
		this.itemElm = item.elm;
		this.sourceContainer = container;
		this.source = container.elm;
		this.config = this.sourceContainer.config || {};
		this.config.mirrorContainer = this.config.mirrorContainer || document.body; // TODO: default config obj, initOptions from dragular
		//noinspection JSUnresolvedVariable
		this.dragon = this.sourceContainer.dragon;
		this.findDropTarget = this.dragon.findDropTarget.bind(this.dragon);

		this.events();
	}

	_createClass(Drag, [{
		key: 'destroy',
		value: function destroy() {

			this.release({});
		}
	}, {
		key: 'events',
		value: function events(remove) {

			var op = remove ? 'remove' : 'add';
			(0, _touchy2.default)(docElm, op, 'mouseup', (0, _utils.bind)(this, 'release'));
			(0, _touchy2.default)(docElm, op, 'mousemove', (0, _utils.bind)(this, 'drag'));
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
		key: 'drag',
		value: function drag(e) {

			if (this.state == 'grabbed') {
				this.startByMovement(e);
				return;
			}
			if (this.state !== 'moved' && this.state !== 'dragging') {
				this.cancel();
				return;
			}
			this.state = 'dragging';

			e.preventDefault();

			var clientX = (0, _utils.getCoord)('clientX', e),
			    clientY = (0, _utils.getCoord)('clientY', e),
			    x = clientX - this.offsetX,
			    y = clientY - this.offsetY,
			    mirror = this.mirror;

			mirror.style.left = x + 'px';
			mirror.style.top = y + 'px';

			var elementBehindCursor = (0, _utils.getElementBehindPoint)(mirror, clientX, clientY),
			    dropTarget = this.findDropTarget(elementBehindCursor, clientX, clientY),
			    reference = void 0,
			    immediate = (0, _utils.getImmediateChild)(dropTarget, elementBehindCursor);

			if (immediate !== null) {
				reference = (0, _utils.getReference)(dropTarget, immediate, clientX, clientY);
			} else {
				return;
			}
			if (reference === null || reference !== this.itemElm && reference !== (0, _utils.nextEl)(this.itemElm)) {
				this.currentSibling = reference;
				dropTarget.insertBefore(this.itemElm, reference);
			}
		}
	}, {
		key: 'startByMovement',
		value: function startByMovement(e) {

			// if (whichMouseButton(e) === 0) {
			//   release({});
			//   return; // when text is selected on an input and then dragged, mouseup doesn't fire. this is our only hope
			// }

			// truthy check fixes github.com/bevacqua/dragula/issues/239, equality fixes github.com/bevacqua/dragula/issues/207
			if (e.clientX !== void 0 && e.clientX === this.moveX && e.clientY !== void 0 && e.clientY === this.moveY) {
				return;
			}

			this.initialSibling = this.currentSibling = (0, _utils.nextEl)(this.itemElm);

			var offset = (0, _utils.getOffset)(this.itemElm);
			this.offsetX = (0, _utils.getCoord)('pageX', e) - offset.left;
			this.offsetY = (0, _utils.getCoord)('pageY', e) - offset.top;

			_classes2.default.add(this.itemElm, 'gu-transit');
			this.renderMirrorImage(this.config.mirrorContainer);
			this.state = 'moved';
		}
	}, {
		key: 'renderMirrorImage',
		value: function renderMirrorImage(mirrorContainer) {

			var rect = this.itemElm.getBoundingClientRect();
			var mirror = this.mirror = this.itemElm.cloneNode(true);

			mirror.style.width = (0, _utils.getRectWidth)(rect) + 'px';
			mirror.style.height = (0, _utils.getRectHeight)(rect) + 'px';
			_classes2.default.rm(mirror, 'gu-transit');
			_classes2.default.add(mirror, 'gu-mirror');
			mirrorContainer.appendChild(mirror);
			_classes2.default.add(mirrorContainer, 'gu-unselectable');
		}
	}, {
		key: 'removeMirrorImage',
		value: function removeMirrorImage() {

			var mirrorContainer = (0, _utils.getParent)(this.mirror);
			_classes2.default.rm(mirrorContainer, 'gu-unselectable');
			mirrorContainer.removeChild(this.mirror);
		}
	}, {
		key: 'release',
		value: function release(e) {

			(0, _touchy2.default)(docElm, 'remove', 'mouseup', this.release);

			var clientX = (0, _utils.getCoord)('clientX', e);
			var clientY = (0, _utils.getCoord)('clientY', e);

			var elementBehindCursor = (0, _utils.getElementBehindPoint)(this.mirror, clientX, clientY);
			var dropTarget = this.findDropTarget(elementBehindCursor, clientX, clientY);
			if (dropTarget && dropTarget !== this.source) {
				this.drop(dropTarget);
			} else {
				this.cancel();
			}
		}
	}, {
		key: 'drop',
		value: function drop(dropTarget) {

			if (this.state !== 'dragging') return;

			var container = this.dragon.getContainer(dropTarget);
			container.addItem(this.item, (0, _utils.domIndexOf)(dropTarget, this.itemElm));
			this.state = 'dropped';

			this.cleanup();
		}
	}, {
		key: 'remove',
		value: function remove() {

			if (this.state !== 'dragging') return;
			this.state = 'removed';

			var parent = (0, _utils.getParent)(this.itemElm);
			if (parent) {
				parent.removeChild(this.itemElm);
			}
			this.cleanup();
		}
	}, {
		key: 'cancel',
		value: function cancel(reverts) {

			if (this.state === 'dragging') {
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

			this.events('remove');

			if (this.mirror) this.removeMirrorImage();

			if (this.itemElm) {
				_classes2.default.rm(this.itemElm, 'gu-transit');
			}
			this.state = 'cleaned';
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
	}]);

	return Drag;
}(), (_applyDecoratedDescriptor(_class.prototype, 'destroy', [_middle.decorator], Object.getOwnPropertyDescriptor(_class.prototype, 'destroy'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'events', [_middle.decorator], Object.getOwnPropertyDescriptor(_class.prototype, 'events'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'protectGrab', [_middle.decorator], Object.getOwnPropertyDescriptor(_class.prototype, 'protectGrab'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'drag', [_middle.decorator], Object.getOwnPropertyDescriptor(_class.prototype, 'drag'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'startByMovement', [_middle.decorator], Object.getOwnPropertyDescriptor(_class.prototype, 'startByMovement'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'renderMirrorImage', [_middle.decorator], Object.getOwnPropertyDescriptor(_class.prototype, 'renderMirrorImage'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'removeMirrorImage', [_middle.decorator], Object.getOwnPropertyDescriptor(_class.prototype, 'removeMirrorImage'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'release', [_middle.decorator], Object.getOwnPropertyDescriptor(_class.prototype, 'release'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'drop', [_middle.decorator], Object.getOwnPropertyDescriptor(_class.prototype, 'drop'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'remove', [_middle.decorator], Object.getOwnPropertyDescriptor(_class.prototype, 'remove'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'cancel', [_middle.decorator], Object.getOwnPropertyDescriptor(_class.prototype, 'cancel'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'cleanup', [_middle.decorator], Object.getOwnPropertyDescriptor(_class.prototype, 'cleanup'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'isInitialPlacement', [_middle.decorator], Object.getOwnPropertyDescriptor(_class.prototype, 'isInitialPlacement'), _class.prototype)), _class);
exports.default = Drag;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _desc, _value, _class;

var _drag = __webpack_require__(6);

var _drag2 = _interopRequireDefault(_drag);

var _middle = __webpack_require__(13);

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
		this.id = config.id || 'containerID_' + Date.now();
		this.container = container;
		this.elm = elm;
	}

	_createClass(Item, [{
		key: 'grab',
		value: function grab(e) {

			this.drag = new _drag2.default(e, this, this.container);
			return this.drag;
		}
	}, {
		key: 'getConfig',
		value: function getConfig(prop) {

			if (!prop) return this.config;

			prop = this.config.hasOwnProperty(prop) ? this.config[prop] : this.container.getConfig(prop);
			return typeof prop == 'function' ? prop() : prop;
		}
	}]);

	return Item;
}(), (_applyDecoratedDescriptor(_class.prototype, 'grab', [_middle.decorator], Object.getOwnPropertyDescriptor(_class.prototype, 'grab'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'getConfig', [_middle.decorator], Object.getOwnPropertyDescriptor(_class.prototype, 'getConfig'), _class.prototype)), _class);
exports.default = Item;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Polyfill from https://github.com/remy/polyfills/blob/master/classList.js
 */

(function () {

	if (typeof window.Element === "undefined" || "classList" in document.documentElement) return;

	var prototype = Array.prototype,
	    push = prototype.push,
	    splice = prototype.splice,
	    join = prototype.join;

	function DOMTokenList(el) {
		this.el = el;
		// The className needs to be trimmed and split on whitespace
		// to retrieve a list of classes.
		var classes = el.className.replace(/^\s+|\s+$/g, '').split(/\s+/);
		for (var _i = 0; _i < classes.length; _i++) {
			push.call(this, classes[_i]);
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
			for (var _i2 = 0; _i2 < this.length; _i2++) {
				if (this[_i2] == token) break;
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

// Simple version of polyfill Array.prototype.forEach()
if (![].forEach) {
	Array.prototype.forEach = function (callback, thisArg) {
		var len = this.length;
		for (var _i3 = 0; _i3 < len; _i3++) {
			callback.call(thisArg, this[_i3], _i3, this);
		}
	};
}

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

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// workaround from https://github.com/webpack/webpack/issues/3929
module.exports = __webpack_require__(3).default;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var customEvent = __webpack_require__(12);
var eventmap = __webpack_require__(11);
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
/* 11 */
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
/* 12 */
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

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("Middle", [], factory);
	else if(typeof exports === 'object')
		exports["Middle"] = factory();
	else
		root["Middle"] = factory();
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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = middle;
exports.decorator = decorator;
function middle(fn, ctx) {

	var enhanced = function middle_enhanced_fn() {

		var arg = Array.apply(null, arguments);

		if (enhanced._m_ctx === undefined) enhanced._m_ctx = this;

		if (enhanced._m_stack.length === enhanced._m_index) {

			enhanced._m_index = 0;
			return fn.apply(enhanced._m_ctx, arg);
		}

		arg.unshift(middle_enhanced_fn);
		return enhanced._m_stack[enhanced._m_index++].apply(enhanced._m_ctx, arg);
	};

	enhanced._m_stack = [];
	enhanced._m_index = 0;
	enhanced._m_ctx = ctx;

	enhanced.use = function (fn, ctx) {

		enhanced._m_stack.push(fn.bind(ctx));
	};

	return enhanced;
}

// ES7 decorator
function decorator(target, keyOrCtx, descriptor) {

	if (!target) return;

	var writable = descriptor.writable,
	    enumerable = descriptor.enumerable;


	return {
		get: function get() {

			var enhanced = middle(descriptor.value, this);
			Object.defineProperty(this, keyOrCtx, {
				value: enhanced,
				writable: writable,
				enumerable: enumerable
			});

			return enhanced;
		}
	};
}

/***/ })
/******/ ]);
});
//# sourceMappingURL=middle.js.map

/***/ })
/******/ ]);
});