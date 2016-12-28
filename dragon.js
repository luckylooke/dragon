'use strict';

var touchy = require(__dirname + '/src/touchy'), // cross event
    classes = require(__dirname + '/src/classes'),

    utils = require(__dirname + '/src/utils'),
    nextEl = utils.nextEl,
    getParent = utils.getParent,
    getRectHeight = utils.getRectHeight,
    getRectWidth = utils.getRectWidth,
    getElementBehindPoint = utils.getElementBehindPoint,
    getCoord = utils.getCoord,
    getOffset = utils.getOffset,
    getReference = utils.getReference,
    getImmediateChild = utils.getImmediateChild,

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
    //noinspection JSUnresolvedVariable
  this.dragonSpace = dragonSpace;
    //noinspection JSUnresolvedVariable
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

    //noinspection JSUnresolvedVariable
  this.id = elm.id || 'container' + id++;
    //noinspection JSUnresolvedVariable
  this.dragon = dragon;
  /** @property this.elm
   * @interface */
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
    //noinspection JSUnresolvedVariable
  this.dragon = this.sourceContainer.dragon;

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

Drag.prototype.removeMirrorImage = function() {
    var mirrorContainer = getParent(this.mirror);
    classes.rm(mirrorContainer, 'gu-unselectable');
    mirrorContainer.removeChild(this.mirror);
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
  if(DEV) console.log('Drag.remove called');

  if (this.state !== 'dragging')
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

  if (this.state == 'dragging'){
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
    this.removeMirrorImage();

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

function getContainer (el) { return dragonSpace.containers[dragonSpace.containersLookup.indexOf(el)] }

module.exports = Dragon;
window.Dragon = Dragon;
