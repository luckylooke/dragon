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
import Dragon from 'dragon';
new Dragon( config );
```

Projects **without** module bundler:
```html
<script src='./dragon.js'></script>
```

## Quick example

Projects **with** module bundler:
```js
import Dragon from 'dragon';
new Dragon( document.getElementsByClassName('container') );
```

Projects **without** module bundler:
```js
new Dragon( document.getElementsByClassName('container') );
```

## Special thanks
I want to specially thank to Joe Hill for releasing the 'dragon' npm username in favor of the dragon library, so I was able to crete @dragon organisation. So plugins of the library can be namespaces under @dragon/plugin-name
