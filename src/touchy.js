"use strict";
let crossvent = require('crossvent');

module.exports = function touchy (el, op, type, fn) {
    let touch = {
        mouseup: 'touchend',
        mousedown: 'touchstart',
        mousemove: 'touchmove'
    };
    let pointers = {
        mouseup: 'pointerup',
        mousedown: 'pointerdown',
        mousemove: 'pointermove'
    };
    let microsoft = {
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