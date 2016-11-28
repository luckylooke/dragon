(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.dragon = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

var touchy = require('./utils/touchy'),
    classes = require('./utils/classes'),
    doc = document,
    docElm = doc.documentElement,
    dragonSpace = {
      dragons: [],
      drags: [],
      containersLookup: [],
      containers: []
    },
    id = 0,

    DEV = true;

touchy(docElm, 'add', 'mousedown', grab);

// ==============================================================================================================================================================
// Dragon =====================================================================================================================================================
// =============================================================================================================================================================
/** is group of containers with same settings */
function Dragon (options) {
  if(DEV) console.log('Dragon instance created, options: ', options);

  this.options = options instanceof Array ? {containers: options} : options || {};
  this.containers = [];
  this.dragonSpace = dragonSpace;
  this.id = this.options.id || 'dragon' + id++;
  
  dragonSpace.dragons.push(this); // register dragon

  if(this.options.containers)
    this.addContainers(this.options.containers);
}

Dragon.prototype.addContainers = function(containers) {
  if(DEV) console.log('Adding containers: ', containers);

  var self = this;
  containers.forEach(function (containerElm) {
    var container = new Container(self, containerElm);
    self.containers.push(container);
    dragonSpace.containers.push(container);
    dragonSpace.containersLookup.push(containerElm);
  });
};


// ==============================================================================================================================================================
// Container =====================================================================================================================================================
// =============================================================================================================================================================

function Container(dragon, elm) {
  if(DEV) console.log('Container instance created, elm:', elm);

  this.id = elm.id || 'container' + id++;
  this.dragon = dragon;
  this.elm = elm;
  this.options = {};
  this.options.mirrorContainer = doc.body;
}

// ==============================================================================================================================================================
// Drag =====================================================================================================================================================
// =============================================================================================================================================================
function Drag(e, item, source) {

  if(DEV) console.log('Drag instance created, params:', e, item, source);

  // this.mirror; // mirror image
  // this.source; // source container element
  // this.source; // source Container object
  // this.item; // item element being dragged
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

  if(DEV) console.log('*** Changing state: ', this.state, ' -> grabbed');
  this.state = 'grabbed';

  this.item = item;
  this.source = source;
  this.sourceContainer = getContainer(source);
  this.options = this.sourceContainer.options || {};

  this.events();
}

Drag.prototype.destroy = function() {
  if(DEV) console.log('Drag.destroy called');

  this.release({});
};

Drag.prototype.events = function(remove) {
  if(DEV) console.log('Drag.events called, "remove" param:', remove);

  var op = remove ? 'remove' : 'add';
  touchy(docElm, op, 'mouseup', bind(this, 'release'));
  touchy(docElm, op, 'mousemove', bind(this, 'drag'));
  touchy(docElm, op, 'selectstart', bind(this, 'protectGrab')); // IE8
  touchy(docElm, op, 'click', bind(this, 'protectGrab'));
};

Drag.prototype.protectGrab = function(e) {
  if(DEV) console.log('Drag.protectGrab called, e:', e);

  if (this.state == 'grabbed') {
    e.preventDefault();
  }
};

Drag.prototype.drag = function(e) {
  if(DEV) console.log('Drag.drag called, e:', e);

  if(this.state == 'grabbed'){
    this.startByMovement(e);
    return;
  }
  if(this.state !== 'moved' && this.state !== 'dragging'){
    this.cancel();
    return;
  }

  if(DEV) console.log('*** Changing state: ', this.state, ' -> dragging');
  this.state = 'dragging';

  e.preventDefault();

  var clientX = getCoord('clientX', e),
      clientY = getCoord('clientY', e),
      x = clientX - this.offsetX,
      y = clientY - this.offsetY,
      mirror = this.mirror;

  mirror.style.left = x + 'px';
  mirror.style.top = y + 'px';

  var elementBehindCursor = getElementBehindPoint(mirror, clientX, clientY),
      dropTarget = findDropTarget(elementBehindCursor, clientX, clientY),
      reference,
      immediate = getImmediateChild(dropTarget, elementBehindCursor);

  if (immediate !== null) {
    reference = getReference(dropTarget, immediate, clientX, clientY);
  } else {
    return;
  }
  if (
      reference === null ||
      reference !== this.item &&
      reference !== nextEl(this.item)
  ) {
    this.currentSibling = reference;
    dropTarget.insertBefore(this.item, reference);
  }
};

Drag.prototype.startByMovement = function(e) {
  if(DEV) console.log('Drag.startByMovement called, e:', e);

  // if (whichMouseButton(e) === 0) {
  //   release({});
  //   return; // when text is selected on an input and then dragged, mouseup doesn't fire. this is our only hope
  // }

  // truthy check fixes github.com/bevacqua/dragula/issues/239, equality fixes github.com/bevacqua/dragula/issues/207
  if (e.clientX !== void 0 && e.clientX === this.moveX && e.clientY !== void 0 && e.clientY === this.moveY) {
    return;
  }

  this.initialSibling = this.currentSibling = nextEl(this.item);

  var offset = getOffset(this.item);
  this.offsetX = getCoord('pageX', e) - offset.left;
  this.offsetY = getCoord('pageY', e) - offset.top;

  classes.add(this.item, 'gu-transit');
  this.renderMirrorImage(this.options.mirrorContainer);

  if(DEV) console.log('*** Changing state: ', this.state, ' -> moved');
  this.state = 'moved';
};

Drag.prototype.renderMirrorImage = function(mirrorContainer) {
  if(DEV) console.log('Drag.renderMirrorImage called, e:', mirrorContainer);

  var rect = this.item.getBoundingClientRect();
  var mirror = this.mirror = this.item.cloneNode(true);

  mirror.style.width = getRectWidth(rect) + 'px';
  mirror.style.height = getRectHeight(rect) + 'px';
  classes.rm(mirror, 'gu-transit');
  classes.add(mirror, 'gu-mirror');
  mirrorContainer.appendChild(mirror);
  classes.add(mirrorContainer, 'gu-unselectable');
};

Drag.prototype.release = function(e) {
  if(DEV) console.log('Drag.release called, e:', e);

  touchy(docElm, 'remove', 'mouseup', this.release);

  var clientX = getCoord('clientX', e);
  var clientY = getCoord('clientY', e);

  var elementBehindCursor = getElementBehindPoint(this.mirror, clientX, clientY);
  var dropTarget = findDropTarget(elementBehindCursor, clientX, clientY);
  if (dropTarget && dropTarget !== this.source) {
    this.drop(e, this.item, dropTarget);
  } else {
    this.cancel();
  }
};

Drag.prototype.drop = function() {
  if(DEV) console.log('Drag.drop called');
  if (this.state != 'dragging')
    return;

  if(DEV) console.log('*** Changing state: ', this.state, ' -> dropped');
  this.state = 'dropped';

  this.cleanup();
};

Drag.prototype.remove = function() {
  if(DEV) console.log('Drag.remove called, e:', e);

  if (this.state !== 'draging')
    return;

  if(DEV) console.log('*** Changing state: ', this.state, ' -> dragging');
  this.state = 'removed';

  var parent = getParent(this.item);
  if (parent) {
    parent.removeChild(this.item);
  }
  this.cleanup();
};

Drag.prototype.cancel = function(reverts){
  if(DEV) console.log('Drag.cancel called, reverts:', reverts);

  if (this.state == 'draging'){
      var parent = getParent(this.item);
      var initial = this.isInitialPlacement(parent);
      if (initial === false && reverts) {
          this.source.insertBefore(this.item, this.initialSibling);
      }
  }

  if(DEV) console.log('*** Changing state: ', this.state, ' -> cancelled');
  this.state = 'cancelled';

  this.cleanup();
};

Drag.prototype.cleanup = function() {
  if(DEV) console.log('Drag.cleanup called');

  this.events('remove');

  if(this.mirror)
    removeMirrorImage(this.mirror);

  if (this.item) {
    classes.rm(this.item, 'gu-transit');
  }

  if(DEV) console.log('*** Changing state: ', this.state, ' -> cleaned');
  this.state = 'cleaned';

  this.source = this.item = this.initialSibling = this.currentSibling = null;
};

Drag.prototype.isInitialPlacement  = function(target,s) {
  var sibling;
  if (s !== void 0) {
    sibling = s;
  } else if (this.mirror) {
    sibling = this.currentSibling;
  } else {
    sibling = nextEl(this.item);
  }
  return target === this.source && sibling === this.initialSibling;
};


// Declarations

function grab(e) {
  if(DEV) console.log('grab called, e:', e);

  var item = e.target,
      source;

  // if (isInput(item)) { // see also: github.com/bevacqua/dragula/issues/208
  //   e.target.focus(); // fixes github.com/bevacqua/dragula/issues/176
  //   return;
  // }

  while (getParent(item) && !isContainer(getParent(item), item, e)) {
    item = getParent(item); // drag target should be a top element
  }
  source = getParent(item);
  if (!source) {
    return;
  }
  dragonSpace.drags.push(new Drag(e, item, source));
}

function bind(obj, methodName){
  var bindedName = 'binded' + methodName;
  if(!obj[bindedName])
    obj[bindedName] = function(){
      obj[methodName].apply(obj, arguments);
    };
  return obj[bindedName];
}

function removeMirrorImage (mirror) {
  var mirrorContainer = getParent(mirror);
  classes.rm(mirrorContainer, 'gu-unselectable');
  mirrorContainer.removeChild(mirror);
}

function findDropTarget (elementBehindCursor) {
  var target = elementBehindCursor;
  while (target && !isContainer(target)) {
    target = getParent(target);
  }
  return target;
}

function isContainer(elm) {
  return dragonSpace.containersLookup.indexOf(elm)+1;
}

function getImmediateChild (dropTarget, target) {
  var immediate = target;
  while (immediate !== dropTarget && getParent(immediate) !== dropTarget) {
    immediate = getParent(immediate);
  }
  if (immediate === docElm) {
    return null;
  }
  return immediate;
}

function getReference (dropTarget, target, x, y, direction) {
  var horizontal = direction === 'horizontal';
  return target !== dropTarget ? inside() : outside(); // reference

  function outside () { // slower, but able to figure out any position
    var len = dropTarget.children.length,
        i,
        el,
        rect;

    for (i = 0; i < len; i++) {
      el = dropTarget.children[i];
      rect = el.getBoundingClientRect();
      if (horizontal && (rect.left + rect.width / 2) > x) { return el; }
      if (!horizontal && (rect.top + rect.height / 2) > y) { return el; }
    }

    return null;
  }

  function inside () { // faster, but only available if dropped inside a child element
    var rect = target.getBoundingClientRect();
    if (horizontal) {
      return resolve(x > rect.left + getRectWidth(rect) / 2);
    }
    return resolve(y > rect.top + getRectHeight(rect) / 2);
  }

  function resolve (after) {
    return after ? nextEl(target) : target;
  }
}


// function whichMouseButton (e) {
//   /** @namespace e.touches -- resolving webstorm unresolved variables */
//   if (e.touches !== void 0) { return e.touches.length; }
//   if (e.which !== void 0 && e.which !== 0) { return e.which; } // see github.com/bevacqua/dragula/issues/261
//   if (e.buttons !== void 0) { return e.buttons; }
//   var button = e.button;
//   if (button !== void 0) { // see github.com/jquery/jquery/blob/99e8ff1baa7ae341e94bb89c3e84570c7c3ad9ea/src/event.js#L573-L575
//     return button & 1 ? 1 : button & 2 ? 3 : (button & 4 ? 2 : 0);
//   }
// }

function getOffset (el) {
  var rect = el.getBoundingClientRect();
  return {
    left: rect.left + getScroll('scrollLeft', 'pageXOffset'),
    top: rect.top + getScroll('scrollTop', 'pageYOffset')
  };
}

function getScroll (scrollProp, offsetProp) {
  if (typeof global[offsetProp] !== 'undefined') {
    return global[offsetProp];
  }
  if (docElm.clientHeight) {
    return docElm[scrollProp];
  }
  return doc.body[scrollProp];
}

function getElementBehindPoint (point, x, y) {
  var p = point || {},
      state = p.className,
      el;
  p.className += ' gu-hide';
  el = doc.elementFromPoint(x, y);
  p.className = state;
  return el;
}

function never () { return false; }
function always () { return true; }
function getRectWidth (rect) { return rect.width || (rect.right - rect.left); }
function getRectHeight (rect) { return rect.height || (rect.bottom - rect.top); }
function getParent (el) { return el.parentNode === doc ? null : el.parentNode; }
function getContainer (el) { return dragonSpace.containers[dragonSpace.containersLookup.indexOf(el)] }
function isInput (el) { return el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || isEditable(el); }
function isEditable (el) {
  /** @namespace el.contentEditable -- resolving webstorm unresolved variables */
  if (!el) { return false; } // no parents were editable
  if (el.contentEditable === 'false') { return false; } // stop the lookup
  if (el.contentEditable === 'true') { return true; } // found a contentEditable element in the chain
  return isEditable(getParent(el)); // contentEditable is set to 'inherit'
}

function nextEl (el) {
  return el.nextElementSibling || manually();
  function manually () {
    var sibling = el;
    do {
      sibling = sibling.nextSibling;
    } while (sibling && sibling.nodeType !== 1);
    return sibling;
  }
}

function getEventHost (e) {
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

function getCoord (coord, e) {
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

module.exports = Dragon;
window.Dragon = Dragon;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./utils/classes":5,"./utils/touchy":6}],2:[function(require,module,exports){
(function (global){

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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],3:[function(require,module,exports){
(function (global){
'use strict';

var customEvent = require('custom-event');
var eventmap = require('./eventmap');
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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./eventmap":4,"custom-event":2}],4:[function(require,module,exports){
(function (global){
'use strict';

var eventmap = [];
var eventname = '';
var ron = /^on/;

for (eventname in global) {
  if (ron.test(eventname)) {
    eventmap.push(eventname.slice(2));
  }
}

module.exports = eventmap;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],5:[function(require,module,exports){
'use strict';

var cache = {};
var start = '(?:^|\\s)';
var end = '(?:\\s|$)';

function lookupClass (className) {
  var cached = cache[className];
  if (cached) {
    cached.lastIndex = 0;
  } else {
    cache[className] = cached = new RegExp(start + className + end, 'g');
  }
  return cached;
}

function addClass (el, className) {
  var current = el.className;
  if (!current.length) {
    el.className = className;
  } else if (!lookupClass(className).test(current)) {
    el.className += ' ' + className;
  }
}

function rmClass (el, className) {
  el.className = el.className.replace(lookupClass(className), ' ').trim();
}

module.exports = {
  add: addClass,
  rm: rmClass
};

},{}],6:[function(require,module,exports){
(function (global){
"use strict";
var crossvent = require('crossvent');

module.exports = function touchy (el, op, type, fn) {
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
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"crossvent":3}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkcmFnb24uanMiLCJub2RlX21vZHVsZXMvY3Jvc3N2ZW50L25vZGVfbW9kdWxlcy9jdXN0b20tZXZlbnQvaW5kZXguanMiLCJub2RlX21vZHVsZXMvY3Jvc3N2ZW50L3NyYy9jcm9zc3ZlbnQuanMiLCJub2RlX21vZHVsZXMvY3Jvc3N2ZW50L3NyYy9ldmVudG1hcC5qcyIsInV0aWxzL2NsYXNzZXMuanMiLCJ1dGlscy90b3VjaHkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ3hlQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ3JHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbnZhciB0b3VjaHkgPSByZXF1aXJlKCcuL3V0aWxzL3RvdWNoeScpLFxuICAgIGNsYXNzZXMgPSByZXF1aXJlKCcuL3V0aWxzL2NsYXNzZXMnKSxcbiAgICBkb2MgPSBkb2N1bWVudCxcbiAgICBkb2NFbG0gPSBkb2MuZG9jdW1lbnRFbGVtZW50LFxuICAgIGRyYWdvblNwYWNlID0ge1xuICAgICAgZHJhZ29uczogW10sXG4gICAgICBkcmFnczogW10sXG4gICAgICBjb250YWluZXJzTG9va3VwOiBbXSxcbiAgICAgIGNvbnRhaW5lcnM6IFtdXG4gICAgfSxcbiAgICBpZCA9IDAsXG5cbiAgICBERVYgPSB0cnVlO1xuXG50b3VjaHkoZG9jRWxtLCAnYWRkJywgJ21vdXNlZG93bicsIGdyYWIpO1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gRHJhZ29uID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vKiogaXMgZ3JvdXAgb2YgY29udGFpbmVycyB3aXRoIHNhbWUgc2V0dGluZ3MgKi9cbmZ1bmN0aW9uIERyYWdvbiAob3B0aW9ucykge1xuICBpZihERVYpIGNvbnNvbGUubG9nKCdEcmFnb24gaW5zdGFuY2UgY3JlYXRlZCwgb3B0aW9uczogJywgb3B0aW9ucyk7XG5cbiAgdGhpcy5vcHRpb25zID0gb3B0aW9ucyBpbnN0YW5jZW9mIEFycmF5ID8ge2NvbnRhaW5lcnM6IG9wdGlvbnN9IDogb3B0aW9ucyB8fCB7fTtcbiAgdGhpcy5jb250YWluZXJzID0gW107XG4gIHRoaXMuZHJhZ29uU3BhY2UgPSBkcmFnb25TcGFjZTtcbiAgdGhpcy5pZCA9IHRoaXMub3B0aW9ucy5pZCB8fCAnZHJhZ29uJyArIGlkKys7XG4gIFxuICBkcmFnb25TcGFjZS5kcmFnb25zLnB1c2godGhpcyk7IC8vIHJlZ2lzdGVyIGRyYWdvblxuXG4gIGlmKHRoaXMub3B0aW9ucy5jb250YWluZXJzKVxuICAgIHRoaXMuYWRkQ29udGFpbmVycyh0aGlzLm9wdGlvbnMuY29udGFpbmVycyk7XG59XG5cbkRyYWdvbi5wcm90b3R5cGUuYWRkQ29udGFpbmVycyA9IGZ1bmN0aW9uKGNvbnRhaW5lcnMpIHtcbiAgaWYoREVWKSBjb25zb2xlLmxvZygnQWRkaW5nIGNvbnRhaW5lcnM6ICcsIGNvbnRhaW5lcnMpO1xuXG4gIHZhciBzZWxmID0gdGhpcztcbiAgY29udGFpbmVycy5mb3JFYWNoKGZ1bmN0aW9uIChjb250YWluZXJFbG0pIHtcbiAgICB2YXIgY29udGFpbmVyID0gbmV3IENvbnRhaW5lcihzZWxmLCBjb250YWluZXJFbG0pO1xuICAgIHNlbGYuY29udGFpbmVycy5wdXNoKGNvbnRhaW5lcik7XG4gICAgZHJhZ29uU3BhY2UuY29udGFpbmVycy5wdXNoKGNvbnRhaW5lcik7XG4gICAgZHJhZ29uU3BhY2UuY29udGFpbmVyc0xvb2t1cC5wdXNoKGNvbnRhaW5lckVsbSk7XG4gIH0pO1xufTtcblxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gQ29udGFpbmVyID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmZ1bmN0aW9uIENvbnRhaW5lcihkcmFnb24sIGVsbSkge1xuICBpZihERVYpIGNvbnNvbGUubG9nKCdDb250YWluZXIgaW5zdGFuY2UgY3JlYXRlZCwgZWxtOicsIGVsbSk7XG5cbiAgdGhpcy5pZCA9IGVsbS5pZCB8fCAnY29udGFpbmVyJyArIGlkKys7XG4gIHRoaXMuZHJhZ29uID0gZHJhZ29uO1xuICB0aGlzLmVsbSA9IGVsbTtcbiAgdGhpcy5vcHRpb25zID0ge307XG4gIHRoaXMub3B0aW9ucy5taXJyb3JDb250YWluZXIgPSBkb2MuYm9keTtcbn1cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIERyYWcgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmZ1bmN0aW9uIERyYWcoZSwgaXRlbSwgc291cmNlKSB7XG5cbiAgaWYoREVWKSBjb25zb2xlLmxvZygnRHJhZyBpbnN0YW5jZSBjcmVhdGVkLCBwYXJhbXM6JywgZSwgaXRlbSwgc291cmNlKTtcblxuICAvLyB0aGlzLm1pcnJvcjsgLy8gbWlycm9yIGltYWdlXG4gIC8vIHRoaXMuc291cmNlOyAvLyBzb3VyY2UgY29udGFpbmVyIGVsZW1lbnRcbiAgLy8gdGhpcy5zb3VyY2U7IC8vIHNvdXJjZSBDb250YWluZXIgb2JqZWN0XG4gIC8vIHRoaXMuaXRlbTsgLy8gaXRlbSBlbGVtZW50IGJlaW5nIGRyYWdnZWRcbiAgLy8gdGhpcy5vZmZzZXRYOyAvLyByZWZlcmVuY2UgeFxuICAvLyB0aGlzLm9mZnNldFk7IC8vIHJlZmVyZW5jZSB5XG4gIC8vIHRoaXMubW92ZVg7IC8vIHJlZmVyZW5jZSBtb3ZlIHhcbiAgLy8gdGhpcy5tb3ZlWTsgLy8gcmVmZXJlbmNlIG1vdmUgeVxuICAvLyB0aGlzLmluaXRpYWxTaWJsaW5nOyAvLyByZWZlcmVuY2Ugc2libGluZyB3aGVuIGdyYWJiZWRcbiAgLy8gdGhpcy5jdXJyZW50U2libGluZzsgLy8gcmVmZXJlbmNlIHNpYmxpbmcgbm93XG4gIC8vIHRoaXMuc3RhdGU7IC8vIGhvbGRzIERyYWcgc3RhdGUgKGdyYWJiZWQsIHRyYWNraW5nLCB3YWl0aW5nLCBkcmFnZ2luZywgLi4uKVxuXG4gIGUucHJldmVudERlZmF1bHQoKTsgLy8gZml4ZXMgZ2l0aHViLmNvbS9iZXZhY3F1YS9kcmFndWxhL2lzc3Vlcy8xNTVcbiAgdGhpcy5tb3ZlWCA9IGUuY2xpZW50WDtcbiAgdGhpcy5tb3ZlWSA9IGUuY2xpZW50WTtcblxuICBpZihERVYpIGNvbnNvbGUubG9nKCcqKiogQ2hhbmdpbmcgc3RhdGU6ICcsIHRoaXMuc3RhdGUsICcgLT4gZ3JhYmJlZCcpO1xuICB0aGlzLnN0YXRlID0gJ2dyYWJiZWQnO1xuXG4gIHRoaXMuaXRlbSA9IGl0ZW07XG4gIHRoaXMuc291cmNlID0gc291cmNlO1xuICB0aGlzLnNvdXJjZUNvbnRhaW5lciA9IGdldENvbnRhaW5lcihzb3VyY2UpO1xuICB0aGlzLm9wdGlvbnMgPSB0aGlzLnNvdXJjZUNvbnRhaW5lci5vcHRpb25zIHx8IHt9O1xuXG4gIHRoaXMuZXZlbnRzKCk7XG59XG5cbkRyYWcucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbigpIHtcbiAgaWYoREVWKSBjb25zb2xlLmxvZygnRHJhZy5kZXN0cm95IGNhbGxlZCcpO1xuXG4gIHRoaXMucmVsZWFzZSh7fSk7XG59O1xuXG5EcmFnLnByb3RvdHlwZS5ldmVudHMgPSBmdW5jdGlvbihyZW1vdmUpIHtcbiAgaWYoREVWKSBjb25zb2xlLmxvZygnRHJhZy5ldmVudHMgY2FsbGVkLCBcInJlbW92ZVwiIHBhcmFtOicsIHJlbW92ZSk7XG5cbiAgdmFyIG9wID0gcmVtb3ZlID8gJ3JlbW92ZScgOiAnYWRkJztcbiAgdG91Y2h5KGRvY0VsbSwgb3AsICdtb3VzZXVwJywgYmluZCh0aGlzLCAncmVsZWFzZScpKTtcbiAgdG91Y2h5KGRvY0VsbSwgb3AsICdtb3VzZW1vdmUnLCBiaW5kKHRoaXMsICdkcmFnJykpO1xuICB0b3VjaHkoZG9jRWxtLCBvcCwgJ3NlbGVjdHN0YXJ0JywgYmluZCh0aGlzLCAncHJvdGVjdEdyYWInKSk7IC8vIElFOFxuICB0b3VjaHkoZG9jRWxtLCBvcCwgJ2NsaWNrJywgYmluZCh0aGlzLCAncHJvdGVjdEdyYWInKSk7XG59O1xuXG5EcmFnLnByb3RvdHlwZS5wcm90ZWN0R3JhYiA9IGZ1bmN0aW9uKGUpIHtcbiAgaWYoREVWKSBjb25zb2xlLmxvZygnRHJhZy5wcm90ZWN0R3JhYiBjYWxsZWQsIGU6JywgZSk7XG5cbiAgaWYgKHRoaXMuc3RhdGUgPT0gJ2dyYWJiZWQnKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICB9XG59O1xuXG5EcmFnLnByb3RvdHlwZS5kcmFnID0gZnVuY3Rpb24oZSkge1xuICBpZihERVYpIGNvbnNvbGUubG9nKCdEcmFnLmRyYWcgY2FsbGVkLCBlOicsIGUpO1xuXG4gIGlmKHRoaXMuc3RhdGUgPT0gJ2dyYWJiZWQnKXtcbiAgICB0aGlzLnN0YXJ0QnlNb3ZlbWVudChlKTtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYodGhpcy5zdGF0ZSAhPT0gJ21vdmVkJyAmJiB0aGlzLnN0YXRlICE9PSAnZHJhZ2dpbmcnKXtcbiAgICB0aGlzLmNhbmNlbCgpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmKERFVikgY29uc29sZS5sb2coJyoqKiBDaGFuZ2luZyBzdGF0ZTogJywgdGhpcy5zdGF0ZSwgJyAtPiBkcmFnZ2luZycpO1xuICB0aGlzLnN0YXRlID0gJ2RyYWdnaW5nJztcblxuICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgdmFyIGNsaWVudFggPSBnZXRDb29yZCgnY2xpZW50WCcsIGUpLFxuICAgICAgY2xpZW50WSA9IGdldENvb3JkKCdjbGllbnRZJywgZSksXG4gICAgICB4ID0gY2xpZW50WCAtIHRoaXMub2Zmc2V0WCxcbiAgICAgIHkgPSBjbGllbnRZIC0gdGhpcy5vZmZzZXRZLFxuICAgICAgbWlycm9yID0gdGhpcy5taXJyb3I7XG5cbiAgbWlycm9yLnN0eWxlLmxlZnQgPSB4ICsgJ3B4JztcbiAgbWlycm9yLnN0eWxlLnRvcCA9IHkgKyAncHgnO1xuXG4gIHZhciBlbGVtZW50QmVoaW5kQ3Vyc29yID0gZ2V0RWxlbWVudEJlaGluZFBvaW50KG1pcnJvciwgY2xpZW50WCwgY2xpZW50WSksXG4gICAgICBkcm9wVGFyZ2V0ID0gZmluZERyb3BUYXJnZXQoZWxlbWVudEJlaGluZEN1cnNvciwgY2xpZW50WCwgY2xpZW50WSksXG4gICAgICByZWZlcmVuY2UsXG4gICAgICBpbW1lZGlhdGUgPSBnZXRJbW1lZGlhdGVDaGlsZChkcm9wVGFyZ2V0LCBlbGVtZW50QmVoaW5kQ3Vyc29yKTtcblxuICBpZiAoaW1tZWRpYXRlICE9PSBudWxsKSB7XG4gICAgcmVmZXJlbmNlID0gZ2V0UmVmZXJlbmNlKGRyb3BUYXJnZXQsIGltbWVkaWF0ZSwgY2xpZW50WCwgY2xpZW50WSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChcbiAgICAgIHJlZmVyZW5jZSA9PT0gbnVsbCB8fFxuICAgICAgcmVmZXJlbmNlICE9PSB0aGlzLml0ZW0gJiZcbiAgICAgIHJlZmVyZW5jZSAhPT0gbmV4dEVsKHRoaXMuaXRlbSlcbiAgKSB7XG4gICAgdGhpcy5jdXJyZW50U2libGluZyA9IHJlZmVyZW5jZTtcbiAgICBkcm9wVGFyZ2V0Lmluc2VydEJlZm9yZSh0aGlzLml0ZW0sIHJlZmVyZW5jZSk7XG4gIH1cbn07XG5cbkRyYWcucHJvdG90eXBlLnN0YXJ0QnlNb3ZlbWVudCA9IGZ1bmN0aW9uKGUpIHtcbiAgaWYoREVWKSBjb25zb2xlLmxvZygnRHJhZy5zdGFydEJ5TW92ZW1lbnQgY2FsbGVkLCBlOicsIGUpO1xuXG4gIC8vIGlmICh3aGljaE1vdXNlQnV0dG9uKGUpID09PSAwKSB7XG4gIC8vICAgcmVsZWFzZSh7fSk7XG4gIC8vICAgcmV0dXJuOyAvLyB3aGVuIHRleHQgaXMgc2VsZWN0ZWQgb24gYW4gaW5wdXQgYW5kIHRoZW4gZHJhZ2dlZCwgbW91c2V1cCBkb2Vzbid0IGZpcmUuIHRoaXMgaXMgb3VyIG9ubHkgaG9wZVxuICAvLyB9XG5cbiAgLy8gdHJ1dGh5IGNoZWNrIGZpeGVzIGdpdGh1Yi5jb20vYmV2YWNxdWEvZHJhZ3VsYS9pc3N1ZXMvMjM5LCBlcXVhbGl0eSBmaXhlcyBnaXRodWIuY29tL2JldmFjcXVhL2RyYWd1bGEvaXNzdWVzLzIwN1xuICBpZiAoZS5jbGllbnRYICE9PSB2b2lkIDAgJiYgZS5jbGllbnRYID09PSB0aGlzLm1vdmVYICYmIGUuY2xpZW50WSAhPT0gdm9pZCAwICYmIGUuY2xpZW50WSA9PT0gdGhpcy5tb3ZlWSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHRoaXMuaW5pdGlhbFNpYmxpbmcgPSB0aGlzLmN1cnJlbnRTaWJsaW5nID0gbmV4dEVsKHRoaXMuaXRlbSk7XG5cbiAgdmFyIG9mZnNldCA9IGdldE9mZnNldCh0aGlzLml0ZW0pO1xuICB0aGlzLm9mZnNldFggPSBnZXRDb29yZCgncGFnZVgnLCBlKSAtIG9mZnNldC5sZWZ0O1xuICB0aGlzLm9mZnNldFkgPSBnZXRDb29yZCgncGFnZVknLCBlKSAtIG9mZnNldC50b3A7XG5cbiAgY2xhc3Nlcy5hZGQodGhpcy5pdGVtLCAnZ3UtdHJhbnNpdCcpO1xuICB0aGlzLnJlbmRlck1pcnJvckltYWdlKHRoaXMub3B0aW9ucy5taXJyb3JDb250YWluZXIpO1xuXG4gIGlmKERFVikgY29uc29sZS5sb2coJyoqKiBDaGFuZ2luZyBzdGF0ZTogJywgdGhpcy5zdGF0ZSwgJyAtPiBtb3ZlZCcpO1xuICB0aGlzLnN0YXRlID0gJ21vdmVkJztcbn07XG5cbkRyYWcucHJvdG90eXBlLnJlbmRlck1pcnJvckltYWdlID0gZnVuY3Rpb24obWlycm9yQ29udGFpbmVyKSB7XG4gIGlmKERFVikgY29uc29sZS5sb2coJ0RyYWcucmVuZGVyTWlycm9ySW1hZ2UgY2FsbGVkLCBlOicsIG1pcnJvckNvbnRhaW5lcik7XG5cbiAgdmFyIHJlY3QgPSB0aGlzLml0ZW0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIHZhciBtaXJyb3IgPSB0aGlzLm1pcnJvciA9IHRoaXMuaXRlbS5jbG9uZU5vZGUodHJ1ZSk7XG5cbiAgbWlycm9yLnN0eWxlLndpZHRoID0gZ2V0UmVjdFdpZHRoKHJlY3QpICsgJ3B4JztcbiAgbWlycm9yLnN0eWxlLmhlaWdodCA9IGdldFJlY3RIZWlnaHQocmVjdCkgKyAncHgnO1xuICBjbGFzc2VzLnJtKG1pcnJvciwgJ2d1LXRyYW5zaXQnKTtcbiAgY2xhc3Nlcy5hZGQobWlycm9yLCAnZ3UtbWlycm9yJyk7XG4gIG1pcnJvckNvbnRhaW5lci5hcHBlbmRDaGlsZChtaXJyb3IpO1xuICBjbGFzc2VzLmFkZChtaXJyb3JDb250YWluZXIsICdndS11bnNlbGVjdGFibGUnKTtcbn07XG5cbkRyYWcucHJvdG90eXBlLnJlbGVhc2UgPSBmdW5jdGlvbihlKSB7XG4gIGlmKERFVikgY29uc29sZS5sb2coJ0RyYWcucmVsZWFzZSBjYWxsZWQsIGU6JywgZSk7XG5cbiAgdG91Y2h5KGRvY0VsbSwgJ3JlbW92ZScsICdtb3VzZXVwJywgdGhpcy5yZWxlYXNlKTtcblxuICB2YXIgY2xpZW50WCA9IGdldENvb3JkKCdjbGllbnRYJywgZSk7XG4gIHZhciBjbGllbnRZID0gZ2V0Q29vcmQoJ2NsaWVudFknLCBlKTtcblxuICB2YXIgZWxlbWVudEJlaGluZEN1cnNvciA9IGdldEVsZW1lbnRCZWhpbmRQb2ludCh0aGlzLm1pcnJvciwgY2xpZW50WCwgY2xpZW50WSk7XG4gIHZhciBkcm9wVGFyZ2V0ID0gZmluZERyb3BUYXJnZXQoZWxlbWVudEJlaGluZEN1cnNvciwgY2xpZW50WCwgY2xpZW50WSk7XG4gIGlmIChkcm9wVGFyZ2V0ICYmIGRyb3BUYXJnZXQgIT09IHRoaXMuc291cmNlKSB7XG4gICAgdGhpcy5kcm9wKGUsIHRoaXMuaXRlbSwgZHJvcFRhcmdldCk7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5jYW5jZWwoKTtcbiAgfVxufTtcblxuRHJhZy5wcm90b3R5cGUuZHJvcCA9IGZ1bmN0aW9uKCkge1xuICBpZihERVYpIGNvbnNvbGUubG9nKCdEcmFnLmRyb3AgY2FsbGVkJyk7XG4gIGlmICh0aGlzLnN0YXRlICE9ICdkcmFnZ2luZycpXG4gICAgcmV0dXJuO1xuXG4gIGlmKERFVikgY29uc29sZS5sb2coJyoqKiBDaGFuZ2luZyBzdGF0ZTogJywgdGhpcy5zdGF0ZSwgJyAtPiBkcm9wcGVkJyk7XG4gIHRoaXMuc3RhdGUgPSAnZHJvcHBlZCc7XG5cbiAgdGhpcy5jbGVhbnVwKCk7XG59O1xuXG5EcmFnLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbigpIHtcbiAgaWYoREVWKSBjb25zb2xlLmxvZygnRHJhZy5yZW1vdmUgY2FsbGVkLCBlOicsIGUpO1xuXG4gIGlmICh0aGlzLnN0YXRlICE9PSAnZHJhZ2luZycpXG4gICAgcmV0dXJuO1xuXG4gIGlmKERFVikgY29uc29sZS5sb2coJyoqKiBDaGFuZ2luZyBzdGF0ZTogJywgdGhpcy5zdGF0ZSwgJyAtPiBkcmFnZ2luZycpO1xuICB0aGlzLnN0YXRlID0gJ3JlbW92ZWQnO1xuXG4gIHZhciBwYXJlbnQgPSBnZXRQYXJlbnQodGhpcy5pdGVtKTtcbiAgaWYgKHBhcmVudCkge1xuICAgIHBhcmVudC5yZW1vdmVDaGlsZCh0aGlzLml0ZW0pO1xuICB9XG4gIHRoaXMuY2xlYW51cCgpO1xufTtcblxuRHJhZy5wcm90b3R5cGUuY2FuY2VsID0gZnVuY3Rpb24ocmV2ZXJ0cyl7XG4gIGlmKERFVikgY29uc29sZS5sb2coJ0RyYWcuY2FuY2VsIGNhbGxlZCwgcmV2ZXJ0czonLCByZXZlcnRzKTtcblxuICBpZiAodGhpcy5zdGF0ZSA9PSAnZHJhZ2luZycpe1xuICAgICAgdmFyIHBhcmVudCA9IGdldFBhcmVudCh0aGlzLml0ZW0pO1xuICAgICAgdmFyIGluaXRpYWwgPSB0aGlzLmlzSW5pdGlhbFBsYWNlbWVudChwYXJlbnQpO1xuICAgICAgaWYgKGluaXRpYWwgPT09IGZhbHNlICYmIHJldmVydHMpIHtcbiAgICAgICAgICB0aGlzLnNvdXJjZS5pbnNlcnRCZWZvcmUodGhpcy5pdGVtLCB0aGlzLmluaXRpYWxTaWJsaW5nKTtcbiAgICAgIH1cbiAgfVxuXG4gIGlmKERFVikgY29uc29sZS5sb2coJyoqKiBDaGFuZ2luZyBzdGF0ZTogJywgdGhpcy5zdGF0ZSwgJyAtPiBjYW5jZWxsZWQnKTtcbiAgdGhpcy5zdGF0ZSA9ICdjYW5jZWxsZWQnO1xuXG4gIHRoaXMuY2xlYW51cCgpO1xufTtcblxuRHJhZy5wcm90b3R5cGUuY2xlYW51cCA9IGZ1bmN0aW9uKCkge1xuICBpZihERVYpIGNvbnNvbGUubG9nKCdEcmFnLmNsZWFudXAgY2FsbGVkJyk7XG5cbiAgdGhpcy5ldmVudHMoJ3JlbW92ZScpO1xuXG4gIGlmKHRoaXMubWlycm9yKVxuICAgIHJlbW92ZU1pcnJvckltYWdlKHRoaXMubWlycm9yKTtcblxuICBpZiAodGhpcy5pdGVtKSB7XG4gICAgY2xhc3Nlcy5ybSh0aGlzLml0ZW0sICdndS10cmFuc2l0Jyk7XG4gIH1cblxuICBpZihERVYpIGNvbnNvbGUubG9nKCcqKiogQ2hhbmdpbmcgc3RhdGU6ICcsIHRoaXMuc3RhdGUsICcgLT4gY2xlYW5lZCcpO1xuICB0aGlzLnN0YXRlID0gJ2NsZWFuZWQnO1xuXG4gIHRoaXMuc291cmNlID0gdGhpcy5pdGVtID0gdGhpcy5pbml0aWFsU2libGluZyA9IHRoaXMuY3VycmVudFNpYmxpbmcgPSBudWxsO1xufTtcblxuRHJhZy5wcm90b3R5cGUuaXNJbml0aWFsUGxhY2VtZW50ICA9IGZ1bmN0aW9uKHRhcmdldCxzKSB7XG4gIHZhciBzaWJsaW5nO1xuICBpZiAocyAhPT0gdm9pZCAwKSB7XG4gICAgc2libGluZyA9IHM7XG4gIH0gZWxzZSBpZiAodGhpcy5taXJyb3IpIHtcbiAgICBzaWJsaW5nID0gdGhpcy5jdXJyZW50U2libGluZztcbiAgfSBlbHNlIHtcbiAgICBzaWJsaW5nID0gbmV4dEVsKHRoaXMuaXRlbSk7XG4gIH1cbiAgcmV0dXJuIHRhcmdldCA9PT0gdGhpcy5zb3VyY2UgJiYgc2libGluZyA9PT0gdGhpcy5pbml0aWFsU2libGluZztcbn07XG5cblxuLy8gRGVjbGFyYXRpb25zXG5cbmZ1bmN0aW9uIGdyYWIoZSkge1xuICBpZihERVYpIGNvbnNvbGUubG9nKCdncmFiIGNhbGxlZCwgZTonLCBlKTtcblxuICB2YXIgaXRlbSA9IGUudGFyZ2V0LFxuICAgICAgc291cmNlO1xuXG4gIC8vIGlmIChpc0lucHV0KGl0ZW0pKSB7IC8vIHNlZSBhbHNvOiBnaXRodWIuY29tL2JldmFjcXVhL2RyYWd1bGEvaXNzdWVzLzIwOFxuICAvLyAgIGUudGFyZ2V0LmZvY3VzKCk7IC8vIGZpeGVzIGdpdGh1Yi5jb20vYmV2YWNxdWEvZHJhZ3VsYS9pc3N1ZXMvMTc2XG4gIC8vICAgcmV0dXJuO1xuICAvLyB9XG5cbiAgd2hpbGUgKGdldFBhcmVudChpdGVtKSAmJiAhaXNDb250YWluZXIoZ2V0UGFyZW50KGl0ZW0pLCBpdGVtLCBlKSkge1xuICAgIGl0ZW0gPSBnZXRQYXJlbnQoaXRlbSk7IC8vIGRyYWcgdGFyZ2V0IHNob3VsZCBiZSBhIHRvcCBlbGVtZW50XG4gIH1cbiAgc291cmNlID0gZ2V0UGFyZW50KGl0ZW0pO1xuICBpZiAoIXNvdXJjZSkge1xuICAgIHJldHVybjtcbiAgfVxuICBkcmFnb25TcGFjZS5kcmFncy5wdXNoKG5ldyBEcmFnKGUsIGl0ZW0sIHNvdXJjZSkpO1xufVxuXG5mdW5jdGlvbiBiaW5kKG9iaiwgbWV0aG9kTmFtZSl7XG4gIHZhciBiaW5kZWROYW1lID0gJ2JpbmRlZCcgKyBtZXRob2ROYW1lO1xuICBpZighb2JqW2JpbmRlZE5hbWVdKVxuICAgIG9ialtiaW5kZWROYW1lXSA9IGZ1bmN0aW9uKCl7XG4gICAgICBvYmpbbWV0aG9kTmFtZV0uYXBwbHkob2JqLCBhcmd1bWVudHMpO1xuICAgIH07XG4gIHJldHVybiBvYmpbYmluZGVkTmFtZV07XG59XG5cbmZ1bmN0aW9uIHJlbW92ZU1pcnJvckltYWdlIChtaXJyb3IpIHtcbiAgdmFyIG1pcnJvckNvbnRhaW5lciA9IGdldFBhcmVudChtaXJyb3IpO1xuICBjbGFzc2VzLnJtKG1pcnJvckNvbnRhaW5lciwgJ2d1LXVuc2VsZWN0YWJsZScpO1xuICBtaXJyb3JDb250YWluZXIucmVtb3ZlQ2hpbGQobWlycm9yKTtcbn1cblxuZnVuY3Rpb24gZmluZERyb3BUYXJnZXQgKGVsZW1lbnRCZWhpbmRDdXJzb3IpIHtcbiAgdmFyIHRhcmdldCA9IGVsZW1lbnRCZWhpbmRDdXJzb3I7XG4gIHdoaWxlICh0YXJnZXQgJiYgIWlzQ29udGFpbmVyKHRhcmdldCkpIHtcbiAgICB0YXJnZXQgPSBnZXRQYXJlbnQodGFyZ2V0KTtcbiAgfVxuICByZXR1cm4gdGFyZ2V0O1xufVxuXG5mdW5jdGlvbiBpc0NvbnRhaW5lcihlbG0pIHtcbiAgcmV0dXJuIGRyYWdvblNwYWNlLmNvbnRhaW5lcnNMb29rdXAuaW5kZXhPZihlbG0pKzE7XG59XG5cbmZ1bmN0aW9uIGdldEltbWVkaWF0ZUNoaWxkIChkcm9wVGFyZ2V0LCB0YXJnZXQpIHtcbiAgdmFyIGltbWVkaWF0ZSA9IHRhcmdldDtcbiAgd2hpbGUgKGltbWVkaWF0ZSAhPT0gZHJvcFRhcmdldCAmJiBnZXRQYXJlbnQoaW1tZWRpYXRlKSAhPT0gZHJvcFRhcmdldCkge1xuICAgIGltbWVkaWF0ZSA9IGdldFBhcmVudChpbW1lZGlhdGUpO1xuICB9XG4gIGlmIChpbW1lZGlhdGUgPT09IGRvY0VsbSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHJldHVybiBpbW1lZGlhdGU7XG59XG5cbmZ1bmN0aW9uIGdldFJlZmVyZW5jZSAoZHJvcFRhcmdldCwgdGFyZ2V0LCB4LCB5LCBkaXJlY3Rpb24pIHtcbiAgdmFyIGhvcml6b250YWwgPSBkaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJztcbiAgcmV0dXJuIHRhcmdldCAhPT0gZHJvcFRhcmdldCA/IGluc2lkZSgpIDogb3V0c2lkZSgpOyAvLyByZWZlcmVuY2VcblxuICBmdW5jdGlvbiBvdXRzaWRlICgpIHsgLy8gc2xvd2VyLCBidXQgYWJsZSB0byBmaWd1cmUgb3V0IGFueSBwb3NpdGlvblxuICAgIHZhciBsZW4gPSBkcm9wVGFyZ2V0LmNoaWxkcmVuLmxlbmd0aCxcbiAgICAgICAgaSxcbiAgICAgICAgZWwsXG4gICAgICAgIHJlY3Q7XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGVsID0gZHJvcFRhcmdldC5jaGlsZHJlbltpXTtcbiAgICAgIHJlY3QgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgIGlmIChob3Jpem9udGFsICYmIChyZWN0LmxlZnQgKyByZWN0LndpZHRoIC8gMikgPiB4KSB7IHJldHVybiBlbDsgfVxuICAgICAgaWYgKCFob3Jpem9udGFsICYmIChyZWN0LnRvcCArIHJlY3QuaGVpZ2h0IC8gMikgPiB5KSB7IHJldHVybiBlbDsgfVxuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgZnVuY3Rpb24gaW5zaWRlICgpIHsgLy8gZmFzdGVyLCBidXQgb25seSBhdmFpbGFibGUgaWYgZHJvcHBlZCBpbnNpZGUgYSBjaGlsZCBlbGVtZW50XG4gICAgdmFyIHJlY3QgPSB0YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgaWYgKGhvcml6b250YWwpIHtcbiAgICAgIHJldHVybiByZXNvbHZlKHggPiByZWN0LmxlZnQgKyBnZXRSZWN0V2lkdGgocmVjdCkgLyAyKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc29sdmUoeSA+IHJlY3QudG9wICsgZ2V0UmVjdEhlaWdodChyZWN0KSAvIDIpO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVzb2x2ZSAoYWZ0ZXIpIHtcbiAgICByZXR1cm4gYWZ0ZXIgPyBuZXh0RWwodGFyZ2V0KSA6IHRhcmdldDtcbiAgfVxufVxuXG5cbi8vIGZ1bmN0aW9uIHdoaWNoTW91c2VCdXR0b24gKGUpIHtcbi8vICAgLyoqIEBuYW1lc3BhY2UgZS50b3VjaGVzIC0tIHJlc29sdmluZyB3ZWJzdG9ybSB1bnJlc29sdmVkIHZhcmlhYmxlcyAqL1xuLy8gICBpZiAoZS50b3VjaGVzICE9PSB2b2lkIDApIHsgcmV0dXJuIGUudG91Y2hlcy5sZW5ndGg7IH1cbi8vICAgaWYgKGUud2hpY2ggIT09IHZvaWQgMCAmJiBlLndoaWNoICE9PSAwKSB7IHJldHVybiBlLndoaWNoOyB9IC8vIHNlZSBnaXRodWIuY29tL2JldmFjcXVhL2RyYWd1bGEvaXNzdWVzLzI2MVxuLy8gICBpZiAoZS5idXR0b25zICE9PSB2b2lkIDApIHsgcmV0dXJuIGUuYnV0dG9uczsgfVxuLy8gICB2YXIgYnV0dG9uID0gZS5idXR0b247XG4vLyAgIGlmIChidXR0b24gIT09IHZvaWQgMCkgeyAvLyBzZWUgZ2l0aHViLmNvbS9qcXVlcnkvanF1ZXJ5L2Jsb2IvOTllOGZmMWJhYTdhZTM0MWU5NGJiODljM2U4NDU3MGM3YzNhZDllYS9zcmMvZXZlbnQuanMjTDU3My1MNTc1XG4vLyAgICAgcmV0dXJuIGJ1dHRvbiAmIDEgPyAxIDogYnV0dG9uICYgMiA/IDMgOiAoYnV0dG9uICYgNCA/IDIgOiAwKTtcbi8vICAgfVxuLy8gfVxuXG5mdW5jdGlvbiBnZXRPZmZzZXQgKGVsKSB7XG4gIHZhciByZWN0ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIHJldHVybiB7XG4gICAgbGVmdDogcmVjdC5sZWZ0ICsgZ2V0U2Nyb2xsKCdzY3JvbGxMZWZ0JywgJ3BhZ2VYT2Zmc2V0JyksXG4gICAgdG9wOiByZWN0LnRvcCArIGdldFNjcm9sbCgnc2Nyb2xsVG9wJywgJ3BhZ2VZT2Zmc2V0JylcbiAgfTtcbn1cblxuZnVuY3Rpb24gZ2V0U2Nyb2xsIChzY3JvbGxQcm9wLCBvZmZzZXRQcm9wKSB7XG4gIGlmICh0eXBlb2YgZ2xvYmFsW29mZnNldFByb3BdICE9PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybiBnbG9iYWxbb2Zmc2V0UHJvcF07XG4gIH1cbiAgaWYgKGRvY0VsbS5jbGllbnRIZWlnaHQpIHtcbiAgICByZXR1cm4gZG9jRWxtW3Njcm9sbFByb3BdO1xuICB9XG4gIHJldHVybiBkb2MuYm9keVtzY3JvbGxQcm9wXTtcbn1cblxuZnVuY3Rpb24gZ2V0RWxlbWVudEJlaGluZFBvaW50IChwb2ludCwgeCwgeSkge1xuICB2YXIgcCA9IHBvaW50IHx8IHt9LFxuICAgICAgc3RhdGUgPSBwLmNsYXNzTmFtZSxcbiAgICAgIGVsO1xuICBwLmNsYXNzTmFtZSArPSAnIGd1LWhpZGUnO1xuICBlbCA9IGRvYy5lbGVtZW50RnJvbVBvaW50KHgsIHkpO1xuICBwLmNsYXNzTmFtZSA9IHN0YXRlO1xuICByZXR1cm4gZWw7XG59XG5cbmZ1bmN0aW9uIG5ldmVyICgpIHsgcmV0dXJuIGZhbHNlOyB9XG5mdW5jdGlvbiBhbHdheXMgKCkgeyByZXR1cm4gdHJ1ZTsgfVxuZnVuY3Rpb24gZ2V0UmVjdFdpZHRoIChyZWN0KSB7IHJldHVybiByZWN0LndpZHRoIHx8IChyZWN0LnJpZ2h0IC0gcmVjdC5sZWZ0KTsgfVxuZnVuY3Rpb24gZ2V0UmVjdEhlaWdodCAocmVjdCkgeyByZXR1cm4gcmVjdC5oZWlnaHQgfHwgKHJlY3QuYm90dG9tIC0gcmVjdC50b3ApOyB9XG5mdW5jdGlvbiBnZXRQYXJlbnQgKGVsKSB7IHJldHVybiBlbC5wYXJlbnROb2RlID09PSBkb2MgPyBudWxsIDogZWwucGFyZW50Tm9kZTsgfVxuZnVuY3Rpb24gZ2V0Q29udGFpbmVyIChlbCkgeyByZXR1cm4gZHJhZ29uU3BhY2UuY29udGFpbmVyc1tkcmFnb25TcGFjZS5jb250YWluZXJzTG9va3VwLmluZGV4T2YoZWwpXSB9XG5mdW5jdGlvbiBpc0lucHV0IChlbCkgeyByZXR1cm4gZWwudGFnTmFtZSA9PT0gJ0lOUFVUJyB8fCBlbC50YWdOYW1lID09PSAnVEVYVEFSRUEnIHx8IGVsLnRhZ05hbWUgPT09ICdTRUxFQ1QnIHx8IGlzRWRpdGFibGUoZWwpOyB9XG5mdW5jdGlvbiBpc0VkaXRhYmxlIChlbCkge1xuICAvKiogQG5hbWVzcGFjZSBlbC5jb250ZW50RWRpdGFibGUgLS0gcmVzb2x2aW5nIHdlYnN0b3JtIHVucmVzb2x2ZWQgdmFyaWFibGVzICovXG4gIGlmICghZWwpIHsgcmV0dXJuIGZhbHNlOyB9IC8vIG5vIHBhcmVudHMgd2VyZSBlZGl0YWJsZVxuICBpZiAoZWwuY29udGVudEVkaXRhYmxlID09PSAnZmFsc2UnKSB7IHJldHVybiBmYWxzZTsgfSAvLyBzdG9wIHRoZSBsb29rdXBcbiAgaWYgKGVsLmNvbnRlbnRFZGl0YWJsZSA9PT0gJ3RydWUnKSB7IHJldHVybiB0cnVlOyB9IC8vIGZvdW5kIGEgY29udGVudEVkaXRhYmxlIGVsZW1lbnQgaW4gdGhlIGNoYWluXG4gIHJldHVybiBpc0VkaXRhYmxlKGdldFBhcmVudChlbCkpOyAvLyBjb250ZW50RWRpdGFibGUgaXMgc2V0IHRvICdpbmhlcml0J1xufVxuXG5mdW5jdGlvbiBuZXh0RWwgKGVsKSB7XG4gIHJldHVybiBlbC5uZXh0RWxlbWVudFNpYmxpbmcgfHwgbWFudWFsbHkoKTtcbiAgZnVuY3Rpb24gbWFudWFsbHkgKCkge1xuICAgIHZhciBzaWJsaW5nID0gZWw7XG4gICAgZG8ge1xuICAgICAgc2libGluZyA9IHNpYmxpbmcubmV4dFNpYmxpbmc7XG4gICAgfSB3aGlsZSAoc2libGluZyAmJiBzaWJsaW5nLm5vZGVUeXBlICE9PSAxKTtcbiAgICByZXR1cm4gc2libGluZztcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRFdmVudEhvc3QgKGUpIHtcbiAgLy8gb24gdG91Y2hlbmQgZXZlbnQsIHdlIGhhdmUgdG8gdXNlIGBlLmNoYW5nZWRUb3VjaGVzYFxuICAvLyBzZWUgaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy83MTkyNTYzL3RvdWNoZW5kLWV2ZW50LXByb3BlcnRpZXNcbiAgLy8gc2VlIGdpdGh1Yi5jb20vYmV2YWNxdWEvZHJhZ3VsYS9pc3N1ZXMvMzRcbiAgLyoqIEBuYW1lc3BhY2UgZS50YXJnZXRUb3VjaGVzIC0tIHJlc29sdmluZyB3ZWJzdG9ybSB1bnJlc29sdmVkIHZhcmlhYmxlcyAqL1xuICAvKiogQG5hbWVzcGFjZSBlLmNoYW5nZWRUb3VjaGVzIC0tIHJlc29sdmluZyB3ZWJzdG9ybSB1bnJlc29sdmVkIHZhcmlhYmxlcyAqL1xuICBpZiAoZS50YXJnZXRUb3VjaGVzICYmIGUudGFyZ2V0VG91Y2hlcy5sZW5ndGgpIHtcbiAgICByZXR1cm4gZS50YXJnZXRUb3VjaGVzWzBdO1xuICB9XG4gIGlmIChlLmNoYW5nZWRUb3VjaGVzICYmIGUuY2hhbmdlZFRvdWNoZXMubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGUuY2hhbmdlZFRvdWNoZXNbMF07XG4gIH1cbiAgcmV0dXJuIGU7XG59XG5cbmZ1bmN0aW9uIGdldENvb3JkIChjb29yZCwgZSkge1xuICB2YXIgaG9zdCA9IGdldEV2ZW50SG9zdChlKTtcbiAgdmFyIG1pc3NNYXAgPSB7XG4gICAgcGFnZVg6ICdjbGllbnRYJywgLy8gSUU4XG4gICAgcGFnZVk6ICdjbGllbnRZJyAvLyBJRThcbiAgfTtcbiAgaWYgKGNvb3JkIGluIG1pc3NNYXAgJiYgIShjb29yZCBpbiBob3N0KSAmJiBtaXNzTWFwW2Nvb3JkXSBpbiBob3N0KSB7XG4gICAgY29vcmQgPSBtaXNzTWFwW2Nvb3JkXTtcbiAgfVxuICByZXR1cm4gaG9zdFtjb29yZF07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRHJhZ29uO1xud2luZG93LkRyYWdvbiA9IERyYWdvbjtcbiIsIlxudmFyIE5hdGl2ZUN1c3RvbUV2ZW50ID0gZ2xvYmFsLkN1c3RvbUV2ZW50O1xuXG5mdW5jdGlvbiB1c2VOYXRpdmUgKCkge1xuICB0cnkge1xuICAgIHZhciBwID0gbmV3IE5hdGl2ZUN1c3RvbUV2ZW50KCdjYXQnLCB7IGRldGFpbDogeyBmb286ICdiYXInIH0gfSk7XG4gICAgcmV0dXJuICAnY2F0JyA9PT0gcC50eXBlICYmICdiYXInID09PSBwLmRldGFpbC5mb287XG4gIH0gY2F0Y2ggKGUpIHtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogQ3Jvc3MtYnJvd3NlciBgQ3VzdG9tRXZlbnRgIGNvbnN0cnVjdG9yLlxuICpcbiAqIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9DdXN0b21FdmVudC5DdXN0b21FdmVudFxuICpcbiAqIEBwdWJsaWNcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IHVzZU5hdGl2ZSgpID8gTmF0aXZlQ3VzdG9tRXZlbnQgOlxuXG4vLyBJRSA+PSA5XG4nZnVuY3Rpb24nID09PSB0eXBlb2YgZG9jdW1lbnQuY3JlYXRlRXZlbnQgPyBmdW5jdGlvbiBDdXN0b21FdmVudCAodHlwZSwgcGFyYW1zKSB7XG4gIHZhciBlID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0N1c3RvbUV2ZW50Jyk7XG4gIGlmIChwYXJhbXMpIHtcbiAgICBlLmluaXRDdXN0b21FdmVudCh0eXBlLCBwYXJhbXMuYnViYmxlcywgcGFyYW1zLmNhbmNlbGFibGUsIHBhcmFtcy5kZXRhaWwpO1xuICB9IGVsc2Uge1xuICAgIGUuaW5pdEN1c3RvbUV2ZW50KHR5cGUsIGZhbHNlLCBmYWxzZSwgdm9pZCAwKTtcbiAgfVxuICByZXR1cm4gZTtcbn0gOlxuXG4vLyBJRSA8PSA4XG5mdW5jdGlvbiBDdXN0b21FdmVudCAodHlwZSwgcGFyYW1zKSB7XG4gIHZhciBlID0gZG9jdW1lbnQuY3JlYXRlRXZlbnRPYmplY3QoKTtcbiAgZS50eXBlID0gdHlwZTtcbiAgaWYgKHBhcmFtcykge1xuICAgIGUuYnViYmxlcyA9IEJvb2xlYW4ocGFyYW1zLmJ1YmJsZXMpO1xuICAgIGUuY2FuY2VsYWJsZSA9IEJvb2xlYW4ocGFyYW1zLmNhbmNlbGFibGUpO1xuICAgIGUuZGV0YWlsID0gcGFyYW1zLmRldGFpbDtcbiAgfSBlbHNlIHtcbiAgICBlLmJ1YmJsZXMgPSBmYWxzZTtcbiAgICBlLmNhbmNlbGFibGUgPSBmYWxzZTtcbiAgICBlLmRldGFpbCA9IHZvaWQgMDtcbiAgfVxuICByZXR1cm4gZTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGN1c3RvbUV2ZW50ID0gcmVxdWlyZSgnY3VzdG9tLWV2ZW50Jyk7XG52YXIgZXZlbnRtYXAgPSByZXF1aXJlKCcuL2V2ZW50bWFwJyk7XG52YXIgZG9jID0gZ2xvYmFsLmRvY3VtZW50O1xudmFyIGFkZEV2ZW50ID0gYWRkRXZlbnRFYXN5O1xudmFyIHJlbW92ZUV2ZW50ID0gcmVtb3ZlRXZlbnRFYXN5O1xudmFyIGhhcmRDYWNoZSA9IFtdO1xuXG5pZiAoIWdsb2JhbC5hZGRFdmVudExpc3RlbmVyKSB7XG4gIGFkZEV2ZW50ID0gYWRkRXZlbnRIYXJkO1xuICByZW1vdmVFdmVudCA9IHJlbW92ZUV2ZW50SGFyZDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGFkZDogYWRkRXZlbnQsXG4gIHJlbW92ZTogcmVtb3ZlRXZlbnQsXG4gIGZhYnJpY2F0ZTogZmFicmljYXRlRXZlbnRcbn07XG5cbmZ1bmN0aW9uIGFkZEV2ZW50RWFzeSAoZWwsIHR5cGUsIGZuLCBjYXB0dXJpbmcpIHtcbiAgcmV0dXJuIGVsLmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgZm4sIGNhcHR1cmluZyk7XG59XG5cbmZ1bmN0aW9uIGFkZEV2ZW50SGFyZCAoZWwsIHR5cGUsIGZuKSB7XG4gIHJldHVybiBlbC5hdHRhY2hFdmVudCgnb24nICsgdHlwZSwgd3JhcChlbCwgdHlwZSwgZm4pKTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlRXZlbnRFYXN5IChlbCwgdHlwZSwgZm4sIGNhcHR1cmluZykge1xuICByZXR1cm4gZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCBmbiwgY2FwdHVyaW5nKTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlRXZlbnRIYXJkIChlbCwgdHlwZSwgZm4pIHtcbiAgdmFyIGxpc3RlbmVyID0gdW53cmFwKGVsLCB0eXBlLCBmbik7XG4gIGlmIChsaXN0ZW5lcikge1xuICAgIHJldHVybiBlbC5kZXRhY2hFdmVudCgnb24nICsgdHlwZSwgbGlzdGVuZXIpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGZhYnJpY2F0ZUV2ZW50IChlbCwgdHlwZSwgbW9kZWwpIHtcbiAgdmFyIGUgPSBldmVudG1hcC5pbmRleE9mKHR5cGUpID09PSAtMSA/IG1ha2VDdXN0b21FdmVudCgpIDogbWFrZUNsYXNzaWNFdmVudCgpO1xuICBpZiAoZWwuZGlzcGF0Y2hFdmVudCkge1xuICAgIGVsLmRpc3BhdGNoRXZlbnQoZSk7XG4gIH0gZWxzZSB7XG4gICAgZWwuZmlyZUV2ZW50KCdvbicgKyB0eXBlLCBlKTtcbiAgfVxuICBmdW5jdGlvbiBtYWtlQ2xhc3NpY0V2ZW50ICgpIHtcbiAgICB2YXIgZTtcbiAgICBpZiAoZG9jLmNyZWF0ZUV2ZW50KSB7XG4gICAgICBlID0gZG9jLmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xuICAgICAgZS5pbml0RXZlbnQodHlwZSwgdHJ1ZSwgdHJ1ZSk7XG4gICAgfSBlbHNlIGlmIChkb2MuY3JlYXRlRXZlbnRPYmplY3QpIHtcbiAgICAgIGUgPSBkb2MuY3JlYXRlRXZlbnRPYmplY3QoKTtcbiAgICB9XG4gICAgcmV0dXJuIGU7XG4gIH1cbiAgZnVuY3Rpb24gbWFrZUN1c3RvbUV2ZW50ICgpIHtcbiAgICByZXR1cm4gbmV3IGN1c3RvbUV2ZW50KHR5cGUsIHsgZGV0YWlsOiBtb2RlbCB9KTtcbiAgfVxufVxuXG5mdW5jdGlvbiB3cmFwcGVyRmFjdG9yeSAoZWwsIHR5cGUsIGZuKSB7XG4gIHJldHVybiBmdW5jdGlvbiB3cmFwcGVyIChvcmlnaW5hbEV2ZW50KSB7XG4gICAgdmFyIGUgPSBvcmlnaW5hbEV2ZW50IHx8IGdsb2JhbC5ldmVudDtcbiAgICBlLnRhcmdldCA9IGUudGFyZ2V0IHx8IGUuc3JjRWxlbWVudDtcbiAgICBlLnByZXZlbnREZWZhdWx0ID0gZS5wcmV2ZW50RGVmYXVsdCB8fCBmdW5jdGlvbiBwcmV2ZW50RGVmYXVsdCAoKSB7IGUucmV0dXJuVmFsdWUgPSBmYWxzZTsgfTtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbiA9IGUuc3RvcFByb3BhZ2F0aW9uIHx8IGZ1bmN0aW9uIHN0b3BQcm9wYWdhdGlvbiAoKSB7IGUuY2FuY2VsQnViYmxlID0gdHJ1ZTsgfTtcbiAgICBlLndoaWNoID0gZS53aGljaCB8fCBlLmtleUNvZGU7XG4gICAgZm4uY2FsbChlbCwgZSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHdyYXAgKGVsLCB0eXBlLCBmbikge1xuICB2YXIgd3JhcHBlciA9IHVud3JhcChlbCwgdHlwZSwgZm4pIHx8IHdyYXBwZXJGYWN0b3J5KGVsLCB0eXBlLCBmbik7XG4gIGhhcmRDYWNoZS5wdXNoKHtcbiAgICB3cmFwcGVyOiB3cmFwcGVyLFxuICAgIGVsZW1lbnQ6IGVsLFxuICAgIHR5cGU6IHR5cGUsXG4gICAgZm46IGZuXG4gIH0pO1xuICByZXR1cm4gd3JhcHBlcjtcbn1cblxuZnVuY3Rpb24gdW53cmFwIChlbCwgdHlwZSwgZm4pIHtcbiAgdmFyIGkgPSBmaW5kKGVsLCB0eXBlLCBmbik7XG4gIGlmIChpKSB7XG4gICAgdmFyIHdyYXBwZXIgPSBoYXJkQ2FjaGVbaV0ud3JhcHBlcjtcbiAgICBoYXJkQ2FjaGUuc3BsaWNlKGksIDEpOyAvLyBmcmVlIHVwIGEgdGFkIG9mIG1lbW9yeVxuICAgIHJldHVybiB3cmFwcGVyO1xuICB9XG59XG5cbmZ1bmN0aW9uIGZpbmQgKGVsLCB0eXBlLCBmbikge1xuICB2YXIgaSwgaXRlbTtcbiAgZm9yIChpID0gMDsgaSA8IGhhcmRDYWNoZS5sZW5ndGg7IGkrKykge1xuICAgIGl0ZW0gPSBoYXJkQ2FjaGVbaV07XG4gICAgaWYgKGl0ZW0uZWxlbWVudCA9PT0gZWwgJiYgaXRlbS50eXBlID09PSB0eXBlICYmIGl0ZW0uZm4gPT09IGZuKSB7XG4gICAgICByZXR1cm4gaTtcbiAgICB9XG4gIH1cbn1cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGV2ZW50bWFwID0gW107XG52YXIgZXZlbnRuYW1lID0gJyc7XG52YXIgcm9uID0gL15vbi87XG5cbmZvciAoZXZlbnRuYW1lIGluIGdsb2JhbCkge1xuICBpZiAocm9uLnRlc3QoZXZlbnRuYW1lKSkge1xuICAgIGV2ZW50bWFwLnB1c2goZXZlbnRuYW1lLnNsaWNlKDIpKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV2ZW50bWFwO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY2FjaGUgPSB7fTtcbnZhciBzdGFydCA9ICcoPzpefFxcXFxzKSc7XG52YXIgZW5kID0gJyg/OlxcXFxzfCQpJztcblxuZnVuY3Rpb24gbG9va3VwQ2xhc3MgKGNsYXNzTmFtZSkge1xuICB2YXIgY2FjaGVkID0gY2FjaGVbY2xhc3NOYW1lXTtcbiAgaWYgKGNhY2hlZCkge1xuICAgIGNhY2hlZC5sYXN0SW5kZXggPSAwO1xuICB9IGVsc2Uge1xuICAgIGNhY2hlW2NsYXNzTmFtZV0gPSBjYWNoZWQgPSBuZXcgUmVnRXhwKHN0YXJ0ICsgY2xhc3NOYW1lICsgZW5kLCAnZycpO1xuICB9XG4gIHJldHVybiBjYWNoZWQ7XG59XG5cbmZ1bmN0aW9uIGFkZENsYXNzIChlbCwgY2xhc3NOYW1lKSB7XG4gIHZhciBjdXJyZW50ID0gZWwuY2xhc3NOYW1lO1xuICBpZiAoIWN1cnJlbnQubGVuZ3RoKSB7XG4gICAgZWwuY2xhc3NOYW1lID0gY2xhc3NOYW1lO1xuICB9IGVsc2UgaWYgKCFsb29rdXBDbGFzcyhjbGFzc05hbWUpLnRlc3QoY3VycmVudCkpIHtcbiAgICBlbC5jbGFzc05hbWUgKz0gJyAnICsgY2xhc3NOYW1lO1xuICB9XG59XG5cbmZ1bmN0aW9uIHJtQ2xhc3MgKGVsLCBjbGFzc05hbWUpIHtcbiAgZWwuY2xhc3NOYW1lID0gZWwuY2xhc3NOYW1lLnJlcGxhY2UobG9va3VwQ2xhc3MoY2xhc3NOYW1lKSwgJyAnKS50cmltKCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBhZGQ6IGFkZENsYXNzLFxuICBybTogcm1DbGFzc1xufTtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIGNyb3NzdmVudCA9IHJlcXVpcmUoJ2Nyb3NzdmVudCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRvdWNoeSAoZWwsIG9wLCB0eXBlLCBmbikge1xuICAgIHZhciB0b3VjaCA9IHtcbiAgICAgICAgbW91c2V1cDogJ3RvdWNoZW5kJyxcbiAgICAgICAgbW91c2Vkb3duOiAndG91Y2hzdGFydCcsXG4gICAgICAgIG1vdXNlbW92ZTogJ3RvdWNobW92ZSdcbiAgICB9O1xuICAgIHZhciBwb2ludGVycyA9IHtcbiAgICAgICAgbW91c2V1cDogJ3BvaW50ZXJ1cCcsXG4gICAgICAgIG1vdXNlZG93bjogJ3BvaW50ZXJkb3duJyxcbiAgICAgICAgbW91c2Vtb3ZlOiAncG9pbnRlcm1vdmUnXG4gICAgfTtcbiAgICB2YXIgbWljcm9zb2Z0ID0ge1xuICAgICAgICBtb3VzZXVwOiAnTVNQb2ludGVyVXAnLFxuICAgICAgICBtb3VzZWRvd246ICdNU1BvaW50ZXJEb3duJyxcbiAgICAgICAgbW91c2Vtb3ZlOiAnTVNQb2ludGVyTW92ZSdcbiAgICB9O1xuXG4gICAgLyoqIEBuYW1lc3BhY2UgZ2xvYmFsLm5hdmlnYXRvci5wb2ludGVyRW5hYmxlZCAtLSByZXNvbHZpbmcgd2Vic3Rvcm0gdW5yZXNvbHZlZCB2YXJpYWJsZXMgKi9cbiAgICAvKiogQG5hbWVzcGFjZSBnbG9iYWwubmF2aWdhdG9yLm1zUG9pbnRlckVuYWJsZWQgLS0gcmVzb2x2aW5nIHdlYnN0b3JtIHVucmVzb2x2ZWQgdmFyaWFibGVzICovXG4gICAgaWYgKGdsb2JhbC5uYXZpZ2F0b3IucG9pbnRlckVuYWJsZWQpIHtcbiAgICAgICAgY3Jvc3N2ZW50W29wXShlbCwgcG9pbnRlcnNbdHlwZV0gfHwgdHlwZSwgZm4pO1xuICAgIH0gZWxzZSBpZiAoZ2xvYmFsLm5hdmlnYXRvci5tc1BvaW50ZXJFbmFibGVkKSB7XG4gICAgICAgIGNyb3NzdmVudFtvcF0oZWwsIG1pY3Jvc29mdFt0eXBlXSB8fCB0eXBlLCBmbik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY3Jvc3N2ZW50W29wXShlbCwgdG91Y2hbdHlwZV0gfHwgdHlwZSwgZm4pO1xuICAgICAgICBjcm9zc3ZlbnRbb3BdKGVsLCB0eXBlLCBmbik7XG4gICAgfVxufTsiXX0=
