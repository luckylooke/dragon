# Dragon (dragon.js)
Total rewrite of drag&drop javascript library [dragula.js](https://github.com/bevacqua/dragula) into shiny new library with [SOLID](https://en.wikipedia.org/wiki/SOLID_%28object-oriented_design%29) design principles. ( work in progress!!! )

## :warning: WARNING
THIS LIBRARY IS IN TURBULENT DEVELOPMENT, CODE IS RAPIDLY CHANGING AND REFACTORING. THIS LIBRARY IS NOT READY TO BE USED. IF YOU WANT TO BE NOTIFIED WHEN IT WILL BE READY, LET ME KNOW ON MY MAIL LUCKYLOOKE@GMAIL.COM

## Installation
```
npm install dragons
```

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
