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
