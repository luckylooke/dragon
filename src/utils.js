var doc = document,
    docElm = doc.documentElement;

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

function getRectWidth (rect) { return rect.width || (rect.right - rect.left); }
function getRectHeight (rect) { return rect.height || (rect.bottom - rect.top); }
function getParent (el) { return el.parentNode === doc ? null : el.parentNode; }
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





module.exports = {
    nextEl: nextEl,
    getParent: getParent,
    getRectHeight: getRectHeight,
    getRectWidth: getRectWidth,
    getElementBehindPoint: getElementBehindPoint,
    getCoord: getCoord,
    getOffset: getOffset,
    getReference: getReference,
    getImmediateChild: getImmediateChild
};