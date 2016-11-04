'use strict';

var crossvent = require('crossvent');
var classes = require('./utils/classes');
var doc = document;
var docElm = doc.documentElement;

function dragon (options) {
  if(options instanceof Array)
    options = {containers: options};

  var _mirror, // mirror image
      _source, // source container
      _item, // item being dragged
      _offsetX, // reference x
      _offsetY, // reference y
      _moveX, // reference move x
      _moveY, // reference move y
      _initialSibling, // reference sibling when grabbed
      _currentSibling, // reference sibling now
      _grabbedContext, // holds mousedown context until first mousemove
      o = options || {};

  console.log('options', options);

  if (o.containers === void 0) { o.containers = []; }
  if (o.isContainer === void 0) { o.isContainer = never; }
  if (o.direction === void 0) { o.direction = 'vertical'; }
  if (o.mirrorContainer === void 0) { o.mirrorContainer = doc.body; }

  var drake = {
    containers: o.containers,
    cancel: cancel,
    remove: remove,
    drop: drop,
    destroy: destroy,
    dragging: false
  };

  touchy(docElm, 'add', 'mousedown', grab);

  return drake;

  // Declarations

  function isContainer (el) {
    return drake.containers.indexOf(el) !== -1 || o.isContainer(el);
  }

  function events (remove) {
    var op = remove ? 'remove' : 'add';
    touchy(docElm, op, 'mousemove', drag);
    crossvent[op](docElm, 'selectstart', protectGrab); // IE8
    crossvent[op](docElm, 'click', protectGrab);
  }

  function destroy () {
    touchy(docElm, 'remove', 'mousedown', grab);
    release({});
  }

  function protectGrab (e) {
    if (_grabbedContext) {
      e.preventDefault();
    }
  }

  function grab (e) {
    touchy(docElm, 'add', 'mouseup', release);

    var item = e.target;

    if (drake.dragging && _mirror) {
      release();
    }
    while (getParent(item) && isContainer(getParent(item)) === false) {
      item = getParent(item); // drag target should be a top element
    }
    var source = getParent(item);
    if (!source) {
      release();
      return;
    }

    _grabbedContext =  {
      item: item,
      source: source
    };

    _moveX = e.clientX;
    _moveY = e.clientY;

    events();

    if (e.type === 'mousedown') {
      if (isInput(item)) { // see also: github.com/bevacqua/dragula/issues/208
        item.focus(); // fixes github.com/bevacqua/dragula/issues/176
      } else {
        e.preventDefault(); // fixes github.com/bevacqua/dragula/issues/155
      }
    }
  }

  function startByMovement (e) {
    if (whichMouseButton(e) === 0) {
      release({});
      return; // when text is selected on an input and then dragged, mouseup doesn't fire. this is our only hope
    }
    // truthy check fixes github.com/bevacqua/dragula/issues/239, equality fixes github.com/bevacqua/dragula/issues/207
    if (e.clientX !== void 0 && e.clientX === _moveX && e.clientY !== void 0 && e.clientY === _moveY) {
      return;
    }

    touchy(docElm, 'remove', 'mousemove', startByMovement);

    _source = _grabbedContext.source;
    _item = _grabbedContext.item;
    _initialSibling = _currentSibling = nextEl(_grabbedContext.item);

    drake.dragging = true;

    var offset = getOffset(_item);
    _offsetX = getCoord('pageX', e) - offset.left;
    _offsetY = getCoord('pageY', e) - offset.top;

    classes.add(_item, 'gu-transit');
    renderMirrorImage();
    drag(e);
  }

  function release (e) {
    touchy(docElm, 'remove', 'mouseup', release);

    if (!drake.dragging || !e) {
      cancel();
      return;
    }

    var clientX = getCoord('clientX', e);
    var clientY = getCoord('clientY', e);

    var elementBehindCursor = getElementBehindPoint(_mirror, clientX, clientY);
    var dropTarget = findDropTarget(elementBehindCursor, clientX, clientY);
    if (dropTarget && dropTarget !== _source) {
      drop(_item, dropTarget);
    } else {
      cancel();
    }
  }

  function drop () {
    cleanup();
  }

  function remove () {
    if (!drake.dragging) {
      return;
    }
    var parent = getParent(_item);
    if (parent) {
      parent.removeChild(_item);
    }
    cleanup();
  }

  function cancel (reverts) {
    if (!drake.dragging) {
      return;
    }
    var parent = getParent(_item);
    var initial = isInitialPlacement(parent);
    if (initial === false && reverts) {
      _source.insertBefore(_item, _initialSibling);
    }
    cleanup();
  }

  function cleanup () {
    _grabbedContext = false;
    events('remove');
    removeMirrorImage();
    if (_item) {
      classes.rm(_item, 'gu-transit');
    }
    drake.dragging = false;
    _source = _item = _initialSibling = _currentSibling = null;
  }

  function isInitialPlacement (target, s) {
    var sibling;
    if (s !== void 0) {
      sibling = s;
    } else if (_mirror) {
      sibling = _currentSibling;
    } else {
      sibling = nextEl(_item);
    }
    return target === _source && sibling === _initialSibling;
  }

  function findDropTarget (elementBehindCursor) {
    var target = elementBehindCursor;
    while (target && !isContainer(target)) {
      target = getParent(target);
    }
    return target;
  }

  function drag (e) {
    if(!drake.dragging){
      startByMovement(e);
      return;
    }

    if (!_mirror || !e)
      return;

    e.preventDefault();

    var clientX = getCoord('clientX', e),
        clientY = getCoord('clientY', e),
        x = clientX - _offsetX,
        y = clientY - _offsetY;

    _mirror.style.left = x + 'px';
    _mirror.style.top = y + 'px';

    var elementBehindCursor = getElementBehindPoint(_mirror, clientX, clientY),
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
      reference !== _item &&
      reference !== nextEl(_item)
    ) {
      _currentSibling = reference;
      dropTarget.insertBefore(_item, reference);
    }
  }

  function renderMirrorImage () {
    if (_mirror) {
      return;
    }
    var rect = _item.getBoundingClientRect();
    _mirror = _item.cloneNode(true);
    _mirror.style.width = getRectWidth(rect) + 'px';
    _mirror.style.height = getRectHeight(rect) + 'px';
    classes.rm(_mirror, 'gu-transit');
    classes.add(_mirror, 'gu-mirror');
    o.mirrorContainer.appendChild(_mirror);
    classes.add(o.mirrorContainer, 'gu-unselectable');
  }

  function removeMirrorImage () {
    if (!_mirror)
      return;
    classes.rm(o.mirrorContainer, 'gu-unselectable');
    getParent(_mirror).removeChild(_mirror);
    _mirror = null;
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

  function getReference (dropTarget, target, x, y) {
    var horizontal = o.direction === 'horizontal';
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
}

function touchy (el, op, type, fn) {
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
    crossvent[op](el, pointers[type], fn);
  } else if (global.navigator.msPointerEnabled) {
    crossvent[op](el, microsoft[type], fn);
  } else {
    crossvent[op](el, touch[type], fn);
    crossvent[op](el, type, fn);
  }
}

function whichMouseButton (e) {
  /** @namespace e.touches -- resolving webstorm unresolved variables */
  if (e.touches !== void 0) { return e.touches.length; }
  if (e.which !== void 0 && e.which !== 0) { return e.which; } // see github.com/bevacqua/dragula/issues/261
  if (e.buttons !== void 0) { return e.buttons; }
  var button = e.button;
  if (button !== void 0) { // see github.com/jquery/jquery/blob/99e8ff1baa7ae341e94bb89c3e84570c7c3ad9ea/src/event.js#L573-L575
    return button & 1 ? 1 : button & 2 ? 3 : (button & 4 ? 2 : 0);
  }
}

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
// function always () { return true; }
function getRectWidth (rect) { return rect.width || (rect.right - rect.left); }
function getRectHeight (rect) { return rect.height || (rect.bottom - rect.top); }
function getParent (el) { return el.parentNode === doc ? null : el.parentNode; }
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

function always() {
  return true;
}

module.exports = dragon;
