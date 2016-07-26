'use strict';

dragula([$('left-defaults'), $('right-defaults')]);
dragula([$('left-copy'), $('right-copy')], { copy: true });



function $ (id) {
  return document.getElementById(id);
}
