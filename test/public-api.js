'use strict';

var test = require('tape');
var dragon = require('..');

test('public api matches expectation', function (t) {
  t.equal(typeof dragon, 'function', 'dragon is a function');
  t.end();
});
