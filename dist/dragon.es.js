function middle(e,t){var r=function t(){var i=Array.prototype.slice.call(arguments);return void 0===r._m_ctx&&(r._m_ctx=this),r._m_stack.length===r._m_index?(r._m_index=0,e.apply(r._m_ctx,i)):(i.unshift(t),r._m_stack[r._m_index++].apply(r._m_ctx,i))};return r._m_stack=[],r._m_index=0,r._m_ctx=t,r.use=function(e,t){r._m_stack.push(e.bind(t))},r}function decorator(e,t,r){if(e){var i=r.writable,o=r.enumerable;return{get:function(){var e=middle(r.value,this);return Object.defineProperty(this,t,{value:e,writable:i,enumerable:o}),e}}}}function _applyDecoratedDescriptor$3(e,t,r,i,o){var n={};return Object.keys(i).forEach(function(e){n[e]=i[e]}),n.enumerable=!!n.enumerable,n.configurable=!!n.configurable,("value"in n||n.initializer)&&(n.writable=!0),n=r.slice().reverse().reduce(function(r,i){return i(e,t,r)||r},n),o&&void 0!==n.initializer&&(n.value=n.initializer?n.initializer.call(o):void 0,n.initializer=void 0),void 0===n.initializer&&(Object.defineProperty(e,t,n),n=null),n}function _applyDecoratedDescriptor$2(e,t,r,i,o){var n={};return Object.keys(i).forEach(function(e){n[e]=i[e]}),n.enumerable=!!n.enumerable,n.configurable=!!n.configurable,("value"in n||n.initializer)&&(n.writable=!0),n=r.slice().reverse().reduce(function(r,i){return i(e,t,r)||r},n),o&&void 0!==n.initializer&&(n.value=n.initializer?n.initializer.call(o):void 0,n.initializer=void 0),void 0===n.initializer&&(Object.defineProperty(e,t,n),n=null),n}function _applyDecoratedDescriptor$1(e,t,r,i,o){var n={};return Object.keys(i).forEach(function(e){n[e]=i[e]}),n.enumerable=!!n.enumerable,n.configurable=!!n.configurable,("value"in n||n.initializer)&&(n.writable=!0),n=r.slice().reverse().reduce(function(r,i){return i(e,t,r)||r},n),o&&void 0!==n.initializer&&(n.value=n.initializer?n.initializer.call(o):void 0,n.initializer=void 0),void 0===n.initializer&&(Object.defineProperty(e,t,n),n=null),n}function _applyDecoratedDescriptor(e,t,r,i,o){var n={};return Object.keys(i).forEach(function(e){n[e]=i[e]}),n.enumerable=!!n.enumerable,n.configurable=!!n.configurable,("value"in n||n.initializer)&&(n.writable=!0),n=r.slice().reverse().reduce(function(r,i){return i(e,t,r)||r},n),o&&void 0!==n.initializer&&(n.value=n.initializer?n.initializer.call(o):void 0,n.initializer=void 0),void 0===n.initializer&&(Object.defineProperty(e,t,n),n=null),n}function getImmediateChild(e,t){for(var r=t;r!==e&&getParent(r)!==e;)r=getParent(r);return r===docElm$1?null:r}function getReference(e,t,r,i,o,n){function s(e){return e?nextEl(t):t}var a="horizontal"===o;return n&&(r-=getScroll("scrollLeft","pageXOffset"),i-=getScroll("scrollTop","pageYOffset")),t!==e?function(){var e=t.getBoundingClientRect();return s(a?r>e.left+getRectWidth(e)/2:i>e.top+getRectHeight(e)/2)}():function(){var t=e.children.length,o=void 0,n=void 0,s=void 0;for(o=0;o<t;o++){if(n=e.children[o],s=n.getBoundingClientRect(),a&&s.left+s.width/2>r)return n;if(!a&&s.top+s.height/2>i)return n}return null}()}function getCoord(e,t){var r=getEventHost(t),i={pageX:"clientX",pageY:"clientY"};return e in i&&!(e in r)&&i[e]in r&&(e=i[e]),r[e]}function getEventHost(e){return e.targetTouches&&e.targetTouches.length?e.targetTouches[0]:e.changedTouches&&e.changedTouches.length?e.changedTouches[0]:e}function getOffset(e,t){var r=e.getBoundingClientRect(),i={left:r.left+getScroll("scrollLeft","pageXOffset"),top:r.top+getScroll("scrollTop","pageYOffset")};return t&&(i.width=getRectWidth(r),i.height=getRectHeight(r)),i}function getScroll(e,t){return void 0!==global[t]?global[t]:docElm$1.clientHeight?docElm$1[e]:doc$1.body[e]}function getElementBehindPoint(e,t,r,i){var o=e.className,n=void 0;return e.className+=" gu-hide",n=doc$1.elementFromPoint(i?t-getScroll("scrollLeft","pageXOffset"):t,i?r-getScroll("scrollTop","pageYOffset"):r),e.className=o,n}function getRectWidth(e){return e.width||e.right-e.left}function getRectHeight(e){return e.height||e.bottom-e.top}function getParent(e){return e.parentNode===doc$1?null:e.parentNode}function nextEl(e){return e.nextElementSibling||function(){var t=e;do{t=t.nextSibling}while(t&&1!==t.nodeType);return t}()}function toArray$1(e){return[].slice.call(e)}function ensureArray(e){return Array.isArray(e)?e:e.length&&0!=e.length?toArray$1(e):[e]}function bind(e,t){var r="_binded_"+t;return e[r]||(e[r]=function(){return e[t].apply(e,arguments)}),e[r]}function domIndexOf(e,t){return Array.prototype.indexOf.call(e.children,t)}function isInput(e){return"INPUT"===e.tagName||"TEXTAREA"===e.tagName||"SELECT"===e.tagName||isEditable(e)}function isEditable(e){return!!e&&("false"!==e.contentEditable&&("true"===e.contentEditable||isEditable(getParent(e))))}function getIndexByElm(e,t){for(var r=e.length,i=0;i<r;i++)if(e[i].elm==t)return i;return-1}function useNative(){try{var e=new NativeCustomEvent("cat",{detail:{foo:"bar"}});return"cat"===e.type&&"bar"===e.detail.foo}catch(e){}return!1}function addEventEasy(e,t,r,i){return e.addEventListener(t,r,i)}function addEventHard(e,t,r){return e.attachEvent("on"+t,wrap(e,t,r))}function removeEventEasy(e,t,r,i){return e.removeEventListener(t,r,i)}function removeEventHard(e,t,r){var i=unwrap(e,t,r);if(i)return e.detachEvent("on"+t,i)}function fabricateEvent(e,t,r){var i=-1===eventmap_1.indexOf(t)?function(){return new index(t,{detail:r})}():function(){var e;return doc$2.createEvent?(e=doc$2.createEvent("Event")).initEvent(t,!0,!0):doc$2.createEventObject&&(e=doc$2.createEventObject()),e}();e.dispatchEvent?e.dispatchEvent(i):e.fireEvent("on"+t,i)}function wrapperFactory(e,t,r){return function(t){var i=t||commonjsGlobal.event;i.target=i.target||i.srcElement,i.preventDefault=i.preventDefault||function(){i.returnValue=!1},i.stopPropagation=i.stopPropagation||function(){i.cancelBubble=!0},i.which=i.which||i.keyCode,r.call(e,i)}}function wrap(e,t,r){var i=unwrap(e,t,r)||wrapperFactory(e,t,r);return hardCache.push({wrapper:i,element:e,type:t,fn:r}),i}function unwrap(e,t,r){var i=find(e,t,r);if(i){var o=hardCache[i].wrapper;return hardCache.splice(i,1),o}}function find(e,t,r){var i,o;for(i=0;i<hardCache.length;i++)if((o=hardCache[i]).element===e&&o.type===t&&o.fn===r)return i}function touchy(e,t,r,i){var o={mouseup:"touchend",mousedown:"touchstart",mousemove:"touchmove"},n={mouseup:"pointerup",mousedown:"pointerdown",mousemove:"pointermove"},s={mouseup:"MSPointerUp",mousedown:"MSPointerDown",mousemove:"MSPointerMove"};global.navigator.pointerEnabled?crossvent[t](e,n[r]||r,i):global.navigator.msPointerEnabled?crossvent[t](e,s[r]||r,i):(crossvent[t](e,o[r]||r,i),crossvent[t](e,r,i))}function lookupClass(e){var t=cache[e];return t?t.lastIndex=0:cache[e]=t=new RegExp(start+e+end,"g"),t}function addClass(e,t){var r=e.className;r.length?lookupClass(t).test(r)||(e.className+=" "+t):e.className=t}function rmClass(e,t){e.className=e.className.replace(lookupClass(t)," ").trim()}function dragon(e){return new Dragon(e,utils$1,touchy,classes)}!function(){function e(e){this.el=e;for(var t=e.className.replace(/^\s+|\s+$/g,"").split(/\s+/),i=0;i<t.length;i++)r.call(this,t[i])}if(!(void 0===window.Element||"classList"in document.documentElement)){var t=Array.prototype,r=t.push,i=t.splice,o=t.join;e.prototype={add:function(e){this.contains(e)||(r.call(this,e),this.el.className=this.toString())},contains:function(e){return-1!=this.el.className.indexOf(e)},item:function(e){return this[e]||null},remove:function(e){if(this.contains(e)){var t=void 0;for(t=0;t<this.length&&this[t]!=e;t++);i.call(this,t,1),this.el.className=this.toString()}},toString:function(){return o.call(this," ")},toggle:function(e){return this.contains(e)?this.remove(e):this.add(e),this.contains(e)}},window.DOMTokenList=e,function(e,t,r){Object.defineProperty?Object.defineProperty(e,t,{get:r}):e.__defineGetter__(t,r)}(Element.prototype,"classList",function(){return new e(this)})}}();var classCallCheck=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")},createClass=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}(),_class$3,docElm=document.documentElement,Drag=(_class$3=function(){function e(t){classCallCheck(this,e),this.id="dragID_"+Date.now(),this.state="grabbed",this.item=t,this.itemElm=t.elm,this.sourceContainer=t.container,this.source=t.container.elm,this.dragon=this.sourceContainer.dragon,this.utils=this.dragon.utils,this.domEventManager=this.dragon.domEventManager,this.domClassManager=this.dragon.domClassManager,this.findDropTarget=this.dragon.findDropTarget.bind(this.dragon),this.getConfig("mouseEvents")&&this.mouseEvents()}return createClass(e,[{key:"destroy",value:function(){this.release(this.x,this.y)}},{key:"mouseEvents",value:function(e){this._mousemove||(window.requestAnimationFrame?(this.move_e=null,this._mousemove=this._mousemoveAF):this._mousemove=this.mousemove);var t=e?"remove":"add";this.domEventManager(docElm,t,"mouseup",this.utils.bind(this,"mouseup")),this.domEventManager(docElm,t,"mousemove",this.utils.bind(this,"_mousemove")),this.domEventManager(docElm,t,"selectstart",this.utils.bind(this,"protectGrab")),this.domEventManager(docElm,t,"click",this.utils.bind(this,"protectGrab"))}},{key:"protectGrab",value:function(e){"grabbed"==this.state&&e.preventDefault()}},{key:"mousemove",value:function(e){return e.target||(e=this.move_e,this.move_e=!1),"grabbed"==this.state?void this.startByMouseMove(e):"dragging"!=this.state?void this.cancel():(e.preventDefault(),void this.drag(this.utils.getCoord("clientX",e),this.utils.getCoord("clientY",e)))}},{key:"_mousemoveAF",value:function(e){this.move_e||(this.actualFrame=window.requestAnimationFrame(this.mousemove)),this.move_e=e}},{key:"startByMouseMove",value:function(e){if(void 0==this.x)return this.x=e.clientX,void(this.y=e.clientY);if(void 0===e.clientX||e.clientX!==this.x||void 0===e.clientY||e.clientY!==this.y){var t=this.utils.getOffset(this.itemElm);this.start(this.utils.getCoord("pageX",e)-t.left,this.utils.getCoord("pageY",e)-t.top)}}},{key:"start",value:function(e,t){if("grabbed"==this.state){e=e||0,t=t||0,this._cachedAbs=this.getConfig("mirrorAbsolute"),this._cachedDir=this.getConfig("direction");var r=this._cachedAbs?this.utils.getOffset(this.itemElm):this.itemElm.getBoundingClientRect();void 0==this.x&&(this.x=r.left+e),void 0==this.y&&(this.y=r.top+t),this.itemOffsetX=e,this.itemOffsetY=t,this.initialSibling=this.currentSibling=this.utils.nextEl(this.itemElm),this.domClassManager.add(this.itemElm,"gu-transit"),this.renderMirrorImage(this.itemElm,this.getConfig("mirrorContainer")),this.state="dragging"}}},{key:"drag",value:function(e,t){if("dragging"==this.state){var r=e-this.itemOffsetX,i=t-this.itemOffsetY,o=this.mirror;this.x=e,this.y=t,o.style.left=r+"px",o.style.top=i+"px";var n=this.utils.getElementBehindPoint(o,e,t,this._cachedAbs),s=this.findDropTarget(n),a=void 0,c=s&&this.utils.getImmediateChild(s,n);c&&(null===(a=this.utils.getReference(s,c,e,t,this._cachedDir,this._cachedAbs))||a!==this.itemElm&&a!==this.utils.nextEl(this.itemElm))&&(this.currentSibling=a,s.insertBefore(this.itemElm,a))}}},{key:"renderMirrorImage",value:function(e,t){var r=e.getBoundingClientRect(),i=e.cloneNode(!0);i.style.width=this.utils.getRectWidth(r)+"px",i.style.height=this.utils.getRectHeight(r)+"px",this.domClassManager.rm(i,"gu-transit"),this.getConfig("mirrorAbsolute")?this.domClassManager.add(i,"gu-mirror-abs"):this.domClassManager.add(i,"gu-mirror"),t.appendChild(i),this.domClassManager.add(t,"gu-unselectable"),this.mirror=i}},{key:"removeMirrorImage",value:function(){var e=this.utils.getParent(this.mirror);this.domClassManager.rm(e,"gu-unselectable"),e.removeChild(this.mirror),this.mirror=null}},{key:"mouseup",value:function(e){this.release(this.utils.getCoord("clientX",e),this.utils.getCoord("clientY",e))}},{key:"release",value:function(e,t){if(void 0==e&&(e=this.x),void 0==t&&(t=this.y),"dragging"!=this.state)return this.cancel();this.actualFrame&&(window.cancelAnimationFrame(this.actualFrame),this.actualFrame=!1);var r=this.utils.getElementBehindPoint(this.mirror,e,t,this._cachedAbs),i=this.findDropTarget(r);i&&i!==this.source?this.drop(i):this.cancel()}},{key:"drop",value:function(e){"dragging"==this.state&&(this.dragon.getContainer(e).addItem(this.item,this.utils.domIndexOf(e,this.itemElm)),this.state="dropped",this.cleanup())}},{key:"remove",value:function(){if("dragging"==this.state){var e=this.utils.getParent(this.itemElm);e&&e.removeChild(this.itemElm),this.state="removed",this.cleanup()}}},{key:"cancel",value:function(e){if("dragging"==this.state){var t=this.utils.getParent(this.itemElm);!1===this.isInitialPlacement(t)&&e&&this.source.insertBefore(this.itemElm,this.initialSibling)}this.state="cancelled",this.cleanup()}},{key:"cleanup",value:function(){this.mouseEvents("remove"),this.mirror&&this.removeMirrorImage(),this.itemElm&&this.domClassManager.rm(this.itemElm,"gu-transit")}},{key:"isInitialPlacement",value:function(e,t){var r=void 0;return r=void 0!==t?t:this.mirror?this.currentSibling:this.utils.nextEl(this.itemElm),e===this.source&&r===this.initialSibling}},{key:"getConfig",value:function(e){return this.item.getConfig(e)}}]),e}(),_applyDecoratedDescriptor$3(_class$3.prototype,"destroy",[decorator],Object.getOwnPropertyDescriptor(_class$3.prototype,"destroy"),_class$3.prototype),_applyDecoratedDescriptor$3(_class$3.prototype,"mouseEvents",[decorator],Object.getOwnPropertyDescriptor(_class$3.prototype,"mouseEvents"),_class$3.prototype),_applyDecoratedDescriptor$3(_class$3.prototype,"protectGrab",[decorator],Object.getOwnPropertyDescriptor(_class$3.prototype,"protectGrab"),_class$3.prototype),_applyDecoratedDescriptor$3(_class$3.prototype,"mousemove",[decorator],Object.getOwnPropertyDescriptor(_class$3.prototype,"mousemove"),_class$3.prototype),_applyDecoratedDescriptor$3(_class$3.prototype,"startByMouseMove",[decorator],Object.getOwnPropertyDescriptor(_class$3.prototype,"startByMouseMove"),_class$3.prototype),_applyDecoratedDescriptor$3(_class$3.prototype,"start",[decorator],Object.getOwnPropertyDescriptor(_class$3.prototype,"start"),_class$3.prototype),_applyDecoratedDescriptor$3(_class$3.prototype,"drag",[decorator],Object.getOwnPropertyDescriptor(_class$3.prototype,"drag"),_class$3.prototype),_applyDecoratedDescriptor$3(_class$3.prototype,"renderMirrorImage",[decorator],Object.getOwnPropertyDescriptor(_class$3.prototype,"renderMirrorImage"),_class$3.prototype),_applyDecoratedDescriptor$3(_class$3.prototype,"removeMirrorImage",[decorator],Object.getOwnPropertyDescriptor(_class$3.prototype,"removeMirrorImage"),_class$3.prototype),_applyDecoratedDescriptor$3(_class$3.prototype,"mouseup",[decorator],Object.getOwnPropertyDescriptor(_class$3.prototype,"mouseup"),_class$3.prototype),_applyDecoratedDescriptor$3(_class$3.prototype,"release",[decorator],Object.getOwnPropertyDescriptor(_class$3.prototype,"release"),_class$3.prototype),_applyDecoratedDescriptor$3(_class$3.prototype,"drop",[decorator],Object.getOwnPropertyDescriptor(_class$3.prototype,"drop"),_class$3.prototype),_applyDecoratedDescriptor$3(_class$3.prototype,"remove",[decorator],Object.getOwnPropertyDescriptor(_class$3.prototype,"remove"),_class$3.prototype),_applyDecoratedDescriptor$3(_class$3.prototype,"cancel",[decorator],Object.getOwnPropertyDescriptor(_class$3.prototype,"cancel"),_class$3.prototype),_applyDecoratedDescriptor$3(_class$3.prototype,"cleanup",[decorator],Object.getOwnPropertyDescriptor(_class$3.prototype,"cleanup"),_class$3.prototype),_applyDecoratedDescriptor$3(_class$3.prototype,"isInitialPlacement",[decorator],Object.getOwnPropertyDescriptor(_class$3.prototype,"isInitialPlacement"),_class$3.prototype),_applyDecoratedDescriptor$3(_class$3.prototype,"getConfig",[decorator],Object.getOwnPropertyDescriptor(_class$3.prototype,"getConfig"),_class$3.prototype),_class$3),_class$2,Item=(_class$2=function(){function e(t,r,i){classCallCheck(this,e),i||(i={}),this.config=i,this.id=i.id||"itemID_"+Date.now(),this.container=t,this.elm=r}return createClass(e,[{key:"grab",value:function(){return this.drag=new Drag(this),this.drag}},{key:"getConfig",value:function(e){return e=this.config.hasOwnProperty(e)?this.config[e]:this.container.getConfig(e),"function"==typeof e?e():e}}]),e}(),_applyDecoratedDescriptor$2(_class$2.prototype,"grab",[decorator],Object.getOwnPropertyDescriptor(_class$2.prototype,"grab"),_class$2.prototype),_applyDecoratedDescriptor$2(_class$2.prototype,"getConfig",[decorator],Object.getOwnPropertyDescriptor(_class$2.prototype,"getConfig"),_class$2.prototype),_class$2),_class$1,Container=(_class$1=function(){function e(t,r,i){classCallCheck(this,e),i||(i={}),this.config=i,this.id=i.id||"containerID_"+Date.now(),this.dragon=t,this.utils=t.utils,this.items=[],this.elm=r,this._initItems()}return createClass(e,[{key:"grab",value:function(e){var t=this.items[this.utils.getIndexByElm(this.items,e)];return t?t.grab():null}},{key:"_initItem",value:function(e){this.addItem(e,this.items.length,null,!0)}},{key:"addItem",value:function(e,t,r,i){t=t||0;var o=void 0;if(e instanceof Item?(e.container=this,o=e):o=new Item(this,e,r),this.items.splice(t,0,o),!i&&!this.elm.contains(o.elm)){var n=this.elm.children[t];n?this.elm.insertBefore(o.elm,n):this.elm.appendChild(o.elm)}return o}},{key:"removeItem",value:function(e){var t=void 0,r=void 0;return e instanceof Item?(e.container=null,t=this.items.indexOf(e)):t=this.utils.getIndexByElm(this.items,e),r=this.items.splice(t,1)[0],this.elm.contains(r.elm)&&this.elm.removeChild(r.elm),r}},{key:"_initItems",value:function(){for(var e=this.utils.toArray(this.elm.children),t=e.length,r=0;r<t;r++)this._initItem(e[r])}},{key:"getConfig",value:function(e){return e=this.config.hasOwnProperty(e)?this.config[e]:this.dragon.getConfig(e),"function"==typeof e?e():e}}]),e}(),_applyDecoratedDescriptor$1(_class$1.prototype,"grab",[decorator],Object.getOwnPropertyDescriptor(_class$1.prototype,"grab"),_class$1.prototype),_applyDecoratedDescriptor$1(_class$1.prototype,"addItem",[decorator],Object.getOwnPropertyDescriptor(_class$1.prototype,"addItem"),_class$1.prototype),_applyDecoratedDescriptor$1(_class$1.prototype,"removeItem",[decorator],Object.getOwnPropertyDescriptor(_class$1.prototype,"removeItem"),_class$1.prototype),_applyDecoratedDescriptor$1(_class$1.prototype,"getConfig",[decorator],Object.getOwnPropertyDescriptor(_class$1.prototype,"getConfig"),_class$1.prototype),_class$1),_class,doc=document;window.dragonSpace||(window.dragonSpace={});var space=window.dragonSpace,Dragon=(_class=function(){function e(t,r,i,o){classCallCheck(this,e),1==(t=t||{}).nodeType&&(t={containers:[t]}),this.utils=r,void 0!==t.length&&(t={containers:this.utils.ensureArray(t)}),this.domEventManager=i,this.domClassManager=o,this.using=[],this.config=t,this.defaults={mouseEvents:!0,mirrorAbsolute:!1,mirrorContainer:doc.body},this.id=t.id||"dragonID_"+Date.now(),this.containers=[],this.initSpace(t.space),this.space=space,space.dragons.push(this),this.addContainers()}return createClass(e,[{key:"initSpace",value:function(t){var r=this;t&&(space=t),space.dragons||(space.dragons=[],space.drags=[],space.utils=this.utils,this.domEventManager(document.documentElement,"add","mousedown",function(e){if(e.preventDefault(),r.utils.isInput(e.target))return void e.target.focus();r.grab(e.clientX,e.clientY,e.target)})),space.Dragon||(space.Dragon=e)}},{key:"addContainers",value:function(e,t){if(e=e||this.config.containers){for(var r,i,o=(e=this.utils.ensureArray(e)).length,n=[],s=0;s<o;s++)r=e[s],this.getContainer(r)?console.warn("container already registered",r):(i=new Container(this,r,t),this.containers.push(i),n.push(i));return n}}},{key:"getContainer",value:function(e,t){if(t)return this.containers[this.utils.getIndexByElm(this.containers,e)];for(var r,i=space.dragons,o=i.length,n=0;n<o;n++)if((r=this.utils.getIndexByElm(i[n].containers,e))>-1)return i[n].containers[r];return null}},{key:"grab",value:function(e,t){var r=void 0==t?e:doc.elementFromPoint(e,t),i=r,o=void 0,n=void 0,s=void 0;do{r=i,i=this.utils.getParent(r)}while(i&&!this.getContainer(i));if(i)return n=this.utils.getIndexByElm(this.containers,i),o=this.containers[n],s=o.grab(r),space.drags.push(s),s}},{key:"findDropTarget",value:function(e){for(;e&&!this.getContainer(e);)e=this.utils.getParent(e);return e}},{key:"getConfig",value:function(e){return e=this.config.hasOwnProperty(e)?this.config[e]:this.defaults[e],"function"==typeof e?e():e}},{key:"use",value:function(e){var t=this;return Array.isArray(e)||(e=[e]),e.forEach(function(e){return t.using.indexOf(e)>-1?0:e(t)}),this}}]),e}(),_applyDecoratedDescriptor(_class.prototype,"initSpace",[decorator],Object.getOwnPropertyDescriptor(_class.prototype,"initSpace"),_class.prototype),_applyDecoratedDescriptor(_class.prototype,"addContainers",[decorator],Object.getOwnPropertyDescriptor(_class.prototype,"addContainers"),_class.prototype),_applyDecoratedDescriptor(_class.prototype,"getContainer",[decorator],Object.getOwnPropertyDescriptor(_class.prototype,"getContainer"),_class.prototype),_applyDecoratedDescriptor(_class.prototype,"grab",[decorator],Object.getOwnPropertyDescriptor(_class.prototype,"grab"),_class.prototype),_applyDecoratedDescriptor(_class.prototype,"findDropTarget",[decorator],Object.getOwnPropertyDescriptor(_class.prototype,"findDropTarget"),_class.prototype),_applyDecoratedDescriptor(_class.prototype,"getConfig",[decorator],Object.getOwnPropertyDescriptor(_class.prototype,"getConfig"),_class.prototype),_applyDecoratedDescriptor(_class.prototype,"use",[decorator],Object.getOwnPropertyDescriptor(_class.prototype,"use"),_class.prototype),_class),doc$1=document,docElm$1=doc$1.documentElement,utils={},utils$1=Object.freeze({default:utils,getImmediateChild:getImmediateChild,getReference:getReference,getCoord:getCoord,getEventHost:getEventHost,getOffset:getOffset,getScroll:getScroll,getElementBehindPoint:getElementBehindPoint,getRectWidth:getRectWidth,getRectHeight:getRectHeight,getParent:getParent,nextEl:nextEl,toArray:toArray$1,ensureArray:ensureArray,bind:bind,domIndexOf:domIndexOf,isInput:isInput,isEditable:isEditable,getIndexByElm:getIndexByElm}),commonjsGlobal="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},NativeCustomEvent=commonjsGlobal.CustomEvent,index=useNative()?NativeCustomEvent:"undefined"!=typeof document&&"function"==typeof document.createEvent?function(e,t){var r=document.createEvent("CustomEvent");return t?r.initCustomEvent(e,t.bubbles,t.cancelable,t.detail):r.initCustomEvent(e,!1,!1,void 0),r}:function(e,t){var r=document.createEventObject();return r.type=e,t?(r.bubbles=Boolean(t.bubbles),r.cancelable=Boolean(t.cancelable),r.detail=t.detail):(r.bubbles=!1,r.cancelable=!1,r.detail=void 0),r},eventmap=[],eventname="",ron=/^on/;for(eventname in commonjsGlobal)ron.test(eventname)&&eventmap.push(eventname.slice(2));var eventmap_1=eventmap,doc$2=commonjsGlobal.document,addEvent=addEventEasy,removeEvent=removeEventEasy,hardCache=[];commonjsGlobal.addEventListener||(addEvent=addEventHard,removeEvent=removeEventHard);var crossvent={add:addEvent,remove:removeEvent,fabricate:fabricateEvent},cache={},start="(?:^|\\s)",end="(?:\\s|$)",classes={add:addClass,rm:rmClass};export default dragon;
//# sourceMappingURL=dragon.es.js.map
