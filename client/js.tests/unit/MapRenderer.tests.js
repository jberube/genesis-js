/// <reference path="../qunit/qunit.js" />
/// <reference path="../../../model/Model.js" />
/// <reference path="./mocks/MockMapRenderer.js" />

/************************************************************
***** MapRenderer (base class)
************************************************************/
module('MapRenderer.js');

test('Create a map renderer', function () {
  //arrange

  //act
  var renderer = new MockMapRenderer();

  //assert
  equals(renderer instanceof MockMapRenderer, true);
  });

test('Render a tile', function () {
  //arrange
  var renderer = new MockMapRenderer();
  var tile = new Tile(12, 50);

  //act
  renderer.renderTile(tile);

  //assert
  equals(renderer.log.pop(), 'renderTile(12,50)');
});

/*
test('attachTo_map_bindsToCorrectEvent', function () {
  //arrange
  var map = new Map();
  var renderer = new MockMapRenderer();

  //act
  renderer.attachTo(map);  

  //assert
  equals(map.events.countListeners('tilesAdded'), 1);
});
*/
