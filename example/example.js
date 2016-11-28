'use strict';

new Dragon([$('left-defaults'), $('right-defaults')]);
// dragon([$('left-copy'), $('right-copy')], { copy: true });



function $ (id) {
  return document.getElementById(id);
}
