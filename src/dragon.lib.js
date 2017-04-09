import './classListPolyfill.js'; // Element.classList polyfill
import Dragons from './dragons.js'; // library core
import touchy from './touchy.js'; // cross event

let dragonsInstance = new Dragons ();

touchy ( document.documentElement, 'add', 'mousedown', dragonsInstance.grab.bind ( dragonsInstance ) );

export default dragonsInstance;
window.dragons = dragonsInstance;