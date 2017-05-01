/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = dragonLib;

	__webpack_require__(1);

	var _dragon = __webpack_require__(2);

	var _dragon2 = _interopRequireDefault(_dragon);

	var _touchy = __webpack_require__(6);

	var _touchy2 = _interopRequireDefault(_touchy);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// cross event

	// Element.classList polyfill
	function dragonLib(config) {

		var dragonInstance = new _dragon2.default(config);
		(0, _touchy2.default)(document.documentElement, 'add', 'mousedown', dragonInstance.grab.bind(dragonInstance));
		return dragonInstance;
	} // library core


	dragon = dragonLib;

/***/ },
/* 1 */
/***/ function(module, exports) {

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
				for (var i = 0; i < this.length; i++) {
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
	 * Polyfill from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now
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
			for (var i = 0; i < len; i++) {
				callback.call(thisArg, this[i], i, this);
			}
		};
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _utils = __webpack_require__(3);

	var _container = __webpack_require__(4);

	var _container2 = _interopRequireDefault(_container);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var classes = __webpack_require__(10);

	var doc = document;

	// ==============================================================================================================================================================
	// Dragon =====================================================================================================================================================
	// =============================================================================================================================================================
	/** is group of containers with same settings */

	var Dragon = function () {
		function Dragon(config) {
			_classCallCheck(this, Dragon);

			console.log('Dragon instance created, config: ', config, this);

			this.config = config || {};
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
			key: 'addContainers',
			value: function addContainers(containerElms, config) {

				console.log('dragon.addContainers called config: ', config, this);

				if (!containerElms) containerElms = this.config.containers;

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
			key: 'isContainer',
			value: function isContainer(el) {

				console.log('dragon.isContainer called, el:', el, this);

				return this.containersLookUp.indexOf(el) != -1;
			}
		}, {
			key: 'getContainer',
			value: function getContainer(el) {

				console.log('dragon.getContainer called, el:', el, this);

				return this.containers[this.containersLookUp.indexOf(el)];
			}
		}, {
			key: 'grab',
			value: function grab(e) {

				console.log('dragon.grab called, e:', e, this);

				var item = e.target;
				var source = void 0;
				var container = void 0;
				var index = void 0;

				// if (isInput(item)) { // see also: github.com/bevacqua/dragula/issues/208
				//   e.target.focus(); // fixes github.com/bevacqua/dragula/issues/176
				//   return;
				// }

				while ((0, _utils.getParent)(item) && !this.isContainer((0, _utils.getParent)(item), item, e)) {
					item = (0, _utils.getParent)(item); // drag target should be a top element
				}
				source = (0, _utils.getParent)(item);
				if (!source) {
					return;
				}

				index = this.containersLookUp.indexOf(source);
				container = this.containers[index];
				container.grab(e, item, source);
			}
		}, {
			key: 'findDropTarget',
			value: function findDropTarget(elementBehindCursor) {

				console.log('dragon.findDropTarget called, prop', elementBehindCursor, this);

				var target = elementBehindCursor;
				while (target && !this.isContainer(target)) {
					target = (0, _utils.getParent)(target);
				}
				return target;
			}
		}, {
			key: 'getConfig',
			value: function getConfig(prop) {

				console.log('dragon.getConfig called, prop', prop, this);

				prop = this.config[prop];
				return typeof prop == 'function' ? prop() : prop;
			}
		}]);

		return Dragon;
	}();

	exports.default = Dragon;

/***/ },
/* 3 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

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
	exports.bind = bind;
	exports.toArray = toArray;
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
	//   var button = e.button;
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

	function bind(obj, methodName) {

		var bindedName = 'binded' + methodName;
		if (!obj[bindedName]) obj[bindedName] = function () {
			obj[methodName].apply(obj, arguments);
		};
		return obj[bindedName];
	}

	function toArray(obj) {

		return [].slice.call(obj);
	}
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _item = __webpack_require__(11);

	var _item2 = _interopRequireDefault(_item);

	var _utils = __webpack_require__(3);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Container = function () {
		function Container(dragon, elm, config) {
			_classCallCheck(this, Container);

			console.log('Container instance created, dragon, config:', dragon, config, this);

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

				console.log('container.grab called, e, itemElm:', e, itemElm, this);

				this.items[this.itemsLookUp.indexOf(itemElm)].grab(e);
			}
		}, {
			key: 'addItem',
			value: function addItem(item, index) {

				console.log('dragon.addItem called config: ', config, this);

				this.items.splice(index, 0, item);
			}
		}, {
			key: 'addItemElm',
			value: function addItemElm(elm, config) {

				console.log('container.item called, elm, config', elm, config, this);

				var item = new _item2.default(this, elm, config);
				this.items.push(item);
				this.itemsLookUp.push(elm);
			}
		}, {
			key: 'initItems',
			value: function initItems() {

				var self = this;

				(0, _utils.toArray)(this.elm.children).forEach(function (itemElm) {
					self.addItemElm(itemElm);
				});
			}
		}, {
			key: 'getConfig',
			value: function getConfig(prop) {

				console.log('container.getConfig called, prop', prop, this);

				prop = typeof this.config[prop] != 'undefined' ? this.config[prop] : this.dragon.getConfig(prop);
				return typeof prop == 'function' ? prop() : prop;
			}
		}]);

		return Container;
	}();

	exports.default = Container;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // cross event
	// cross event


	var _touchy = __webpack_require__(6);

	var _touchy2 = _interopRequireDefault(_touchy);

	var _classes = __webpack_require__(10);

	var _classes2 = _interopRequireDefault(_classes);

	var _utils = __webpack_require__(3);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	// cross event

	var docElm = document.documentElement;

	var Drag = function () {
		function Drag(e, item, container) {
			_classCallCheck(this, Drag);

			console.log('Drag instance created, params:', e, item, container);

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
			// this.state; // holds Drag state (grabbed, tracking, waiting, dragging, ...)

			e.preventDefault(); // fixes github.com/bevacqua/dragula/issues/155
			this.moveX = e.clientX;
			this.moveY = e.clientY;

			console.log('*** Changing state: ', this.state, ' -> grabbed');
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
				console.log('Drag.destroy called');

				this.release({});
			}
		}, {
			key: 'events',
			value: function events(remove) {
				console.log('Drag.events called, "remove" param:', remove);

				var op = remove ? 'remove' : 'add';
				(0, _touchy2.default)(docElm, op, 'mouseup', (0, _utils.bind)(this, 'release'));
				(0, _touchy2.default)(docElm, op, 'mousemove', (0, _utils.bind)(this, 'drag'));
				(0, _touchy2.default)(docElm, op, 'selectstart', (0, _utils.bind)(this, 'protectGrab')); // IE8
				(0, _touchy2.default)(docElm, op, 'click', (0, _utils.bind)(this, 'protectGrab'));
			}
		}, {
			key: 'protectGrab',
			value: function protectGrab(e) {
				console.log('Drag.protectGrab called, e:', e);

				if (this.state == 'grabbed') {
					e.preventDefault();
				}
			}
		}, {
			key: 'drag',
			value: function drag(e) {
				console.log('Drag.drag called, e:', e);

				if (this.state == 'grabbed') {
					this.startByMovement(e);
					return;
				}
				if (this.state !== 'moved' && this.state !== 'dragging') {
					this.cancel();
					return;
				}

				console.log('*** Changing state: ', this.state, ' -> dragging');
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
				console.log('Drag.startByMovement called, e:', e);

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

				console.log('*** Changing state: ', this.state, ' -> moved');
				this.state = 'moved';
			}
		}, {
			key: 'renderMirrorImage',
			value: function renderMirrorImage(mirrorContainer) {
				console.log('Drag.renderMirrorImage called, e:', mirrorContainer);

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
				console.log('Drag.release called, e:', e);

				(0, _touchy2.default)(docElm, 'remove', 'mouseup', this.release);

				var clientX = (0, _utils.getCoord)('clientX', e);
				var clientY = (0, _utils.getCoord)('clientY', e);

				var elementBehindCursor = (0, _utils.getElementBehindPoint)(this.mirror, clientX, clientY);
				var dropTarget = this.findDropTarget(elementBehindCursor, clientX, clientY);
				if (dropTarget && dropTarget !== this.source) {
					this.drop(e, this.itemElm, dropTarget);
				} else {
					this.cancel();
				}
			}
		}, {
			key: 'drop',
			value: function drop() {
				console.log('Drag.drop called');
				if (this.state != 'dragging') return;

				console.log('*** Changing state: ', this.state, ' -> dropped');
				this.state = 'dropped';

				this.cleanup();
			}
		}, {
			key: 'remove',
			value: function remove() {
				console.log('Drag.remove called');

				if (this.state !== 'dragging') return;

				console.log('*** Changing state: ', this.state, ' -> dragging');
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
				console.log('Drag.cancel called, reverts:', reverts);

				if (this.state == 'dragging') {
					var parent = (0, _utils.getParent)(this.itemElm);
					var initial = this.isInitialPlacement(parent);
					if (initial === false && reverts) {
						this.source.insertBefore(this.itemElm, this.initialSibling);
					}
				}

				console.log('*** Changing state: ', this.state, ' -> cancelled');
				this.state = 'cancelled';

				this.cleanup();
			}
		}, {
			key: 'cleanup',
			value: function cleanup() {
				console.log('Drag.cleanup called');

				this.events('remove');

				if (this.mirror) this.removeMirrorImage();

				if (this.itemElm) {
					_classes2.default.rm(this.itemElm, 'gu-transit');
				}

				console.log('*** Changing state: ', this.state, ' -> cleaned');
				this.state = 'cleaned';

				this.source = this.itemElm = this.initialSibling = this.currentSibling = null;
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
	}();

	exports.default = Drag;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {"use strict";

	var crossvent = __webpack_require__(7);

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
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var customEvent = __webpack_require__(8);
	var eventmap = __webpack_require__(9);
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

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 8 */
/***/ function(module, exports) {

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

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 9 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var eventmap = [];
	var eventname = '';
	var ron = /^on/;

	for (eventname in global) {
	  if (ron.test(eventname)) {
	    eventmap.push(eventname.slice(2));
	  }
	}

	module.exports = eventmap;

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict';

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

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _drag = __webpack_require__(5);

	var _drag2 = _interopRequireDefault(_drag);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Item = function () {
		function Item(container, elm, config) {
			_classCallCheck(this, Item);

			console.log('Item instance created, container, elm, config:', container, elm, config, this);

			if (!config) config = {};

			this.config = config;
			this.id = config.id || 'containerID_' + Date.now();
			this.container = container;
			this.elm = elm;
		}

		_createClass(Item, [{
			key: 'grab',
			value: function grab(e) {

				console.log('container.grab called, e:', e, this);

				this.drag = new _drag2.default(e, this, this.container);
				return this.drag;
			}
		}, {
			key: 'getConfig',
			value: function getConfig(prop) {

				console.log('item.getConfig called, prop', prop, this);

				prop = typeof this.config[prop] != 'undefined' ? this.config[prop] : this.container.getConfig(prop);
				return typeof prop == 'function' ? prop() : prop;
			}
		}]);

		return Item;
	}();

	exports.default = Item;

/***/ }
/******/ ]);