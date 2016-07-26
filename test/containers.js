'use strict';

var test = require('tape');
var dragon = require('..');

test('drake defaults to no containers', function (t) {
  var drake = dragon();
  t.ok(Array.isArray(drake.containers), 'drake.containers is an array');
  t.equal(drake.containers.length, 0, 'drake.containers is empty');
  t.end();
});

test('drake reads containers from array argument', function (t) {
  var el = document.createElement('div');
  var containers = [el];
  var drake = dragon(containers);
  t.equal(drake.containers, containers, 'drake.containers matches input');
  t.equal(drake.containers.length, 1, 'drake.containers has one item');
  t.end();
});

test('drake reads containers from array in options', function (t) {
  var el = document.createElement('div');
  var containers = [el];
  var drake = dragon({ containers: containers });
  t.equal(drake.containers, containers, 'drake.containers matches input');
  t.equal(drake.containers.length, 1, 'drake.containers has one item');
  t.end();
});

test('containers in options take precedent', function (t) {
  var el = document.createElement('div');
  var containers = [el];
  var drake = dragon([], { containers: containers });
  t.equal(drake.containers, containers, 'drake.containers matches input');
  t.equal(drake.containers.length, 1, 'drake.containers has one item');
  t.end();
});
