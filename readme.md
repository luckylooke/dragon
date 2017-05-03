# Dragon (dragon.js)
Total rewrite of drag&drop javascript library [dragula.js](https://github.com/bevacqua/dragula) into shiny new library with [SOLID](https://en.wikipedia.org/wiki/SOLID_%28object-oriented_design%29) design principles. ( work in progress!!! )

## :warning: WARNING
THIS LIBRARY IS IN TURBULENT DEVELOPMENT, CODE IS RAPIDLY CHANGING AND REFACTORING. THIS LIBRARY IS NOT READY TO BE USED. IF YOU WANT TO BE NOTIFIED WHEN IT WILL BE READY, LET ME KNOW ON MY MAIL LUCKYLOOKE@GMAIL.COM

## Installation
```
npm install dragon
```
*\* many thanks to Enrico Marino ([@onirame](https://www.npmjs.com/~onirame)) for transferring ownership of his dragon npm package in favor of this project.*

Projects **with** module bundler:
```js
import Dragon from 'dragons';
new Dragon( config );
```

Projects **without** module bundler:
```html
<script src='./dragon.js'></script>
```

## Quick example

Projects **with** module bundler:
```js
import Dragon from 'dragons';
new Dragon( document.getElementsByClassName('container') );
```

Projects **without** module bundler:
```js
new Dragon( document.getElementsByClassName('container') );
```

## Principes of library
Explained principes of the library to better understanding how it works and how you can extend it or hook on its parts, events etc.

### Dragon objects
Dragon library has few classes helping to make drags done precisely and reliably. The classes are: Dragon, Container, Item, Drag. There is also one shared object called space. The space object is where dragons live together.

#### space
Main purpose of space is to provide communication medium for dragons.

#### Dragon( config | Array[ Container | DOMElement ] | ArrayLike[ DOMElement ] ) class
Main class of the library, it holds container objects so we can imagine it as group of containers.

#### Container( Dragon, DOMElement, config )
An object associated with DOM element which holds draggable items. 

#### Item( Container, DOMElement, config )
An object associated with DOM element which represents draggable item. 

#### Drag( Observable, Item, Container )
An object representing the active drag, it holds references to item being dragged, source container where the item was placed in the beginning of drag and other related info.

### States of the Item
Every drag has these stages: GRAB, DRAG, RELEASE.

#### Grab
Started with user interaction ( mousedown ) or by js, it is where Drag object instance is created. And it waits for starting signal ( movement, time, js ). 

#### Drag
Dragging is happening and parameters are changing ( position [x,y], elementBehindCursor )

#### Release
Drag is finished by release and several scenarios can occur. Dragged item can be placed into actual position, can be moved to initial position, or item can be removed. Depends on config and actual situation.