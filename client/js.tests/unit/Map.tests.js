/// <reference path="../qunit/qunit.js" />
/// <reference path="../../../model/Model.js" />
/// <reference path="../mocks/MockMapRenderer.js" />

/**********************************************************************/
module('Map.js');
/**********************************************************************/
test('ctor_ hasNoTiles', function () {
  //arrange

  //act
  var map = new Map();

  //assert
  equals(map.tiles.length, 0);
});

test('getTile_existingTileXY_returnsTile', function () {
  //arrange
  var map = new Map();
  var tile = new Tile(-15, -23);
  map.setTile(tile);

  //act
  var result = map.getTile(-15, -23);

  //assert
  equals(result, tile, 'getTile must return the exact same tile');
});

test('getTile_existingTileId_returnsTile', function () {
  //arrange
  var map = new Map();
  var tile = new Tile(-19, 44);
  map.setTile(tile);

  //act
  var result = map.getTile('-19,44');

  //assert
  strictEqual(result, tile, 'getTile must return the exact same tile');
});

test('getTile_unexistingTile_returnsUndefined', function () {
  //arrange
  var map = new Map();
  var tile = new Tile(-24, 32);
  map.setTile(tile);

  //act
  var result = map.getTile(-99, 99);

  //assert
  equal(result, undefined, 'getTile must return undefined');
});

test('setTile_unexistingTile_addsTile', function () {
  //arrange
  var map = new Map();
  var tile = new Tile(1, 2);
  
  //act
  map.setTile(tile);

  //assert
  equals(map.tiles.length, 1);
  equals(map.getTile(1, 2).x, 1);
  equals(map.getTile(1, 2).y, 2);
  });

/*
asyncTest('setTile_anyTile_rendersTileInEachMapRenderer', 2, function () {
  //arrange
  var map = new Map();
  var tile = new Tile(4, -8);

  var mapRenderer1 = new MockMapRenderer();
  mapRenderer1.attachTo(map);

  var mapRenderer2 = new MockMapRenderer();
  mapRenderer2.attachTo(map);

  //assert
  setTimeout(function () {
      var count = 0;
      count = countRenderedTile(mapRenderer1, 4, -8);
      equals(count, 1);
      count = 0;
      count = countRenderedTile(mapRenderer2, 4, -8);
      equals(count, 1);
      start();
    }, 100);

  //act
  stop();
  map.setTile(tile);
});
*/
function countRenderedTile(renderer, x, y) {
  var count = 0;
  for (i in renderer.log) {
    if (renderer.log[i] == 'renderTile(' + x + ',' + y + ')')
      count++;
  }
  return count;
}
/*
asyncTest('setTiles_multipleTiles_rendersEachTilesInEachMapRenderer', 4, function () {
  //arrange
  var map = new Map();
  var tile1 = new Tile(76, -76);
  var tile2 = new Tile(-67, 33);

  var mapRenderer1 = new MockMapRenderer();
  mapRenderer1.attachTo(map);

  var mapRenderer2 = new MockMapRenderer();
  mapRenderer2.attachTo(map);

  //assert
  setTimeout(function () {
    var count = 0;
    count = countRenderedTile(mapRenderer1, 76, -76);
    equals(count, 1);
    count = countRenderedTile(mapRenderer1, -67, 33);
    equals(count, 1);
    count = countRenderedTile(mapRenderer2, 76, -76);
    equals(count, 1);
    count = countRenderedTile(mapRenderer2, -67, 33);
    equals(count, 1);
    start();
  }, 100);

  //act
  stop();
  map.setTiles([tile1, tile2]);
});
*/
test('removeTile_existingTile_removesTile', function () {
  //arrange
  var map = new Map();
  var tile = new Tile(14, -89);
  map.setTile(tile);

  //act
  map.removeTile(14, -89);

  //assert
  equals(map.tiles.length, 0, 'the map should have 0 elements');
  ok(!map.hasTile(14, -89), 'the removed tile should not be present');
  });

test('removeTile_unexistingTile_doesNothing', function () {
  //arrange
  var map = new Map();
  var tile = new Tile(-8, 5);
  map.setTile(tile);

  //act
  map.removeTile(3, 154);

  //assert
  equals(map.tiles.length, 1, 'the map should have 1 element');
  ok(map.hasTile(-8, 5), 'the tile should still be present');
});

test('hasTile_returnsIfTileExists', function () {
  //arrange
  var map = new Map();
  var tile = new Tile(1, 2);

  //act
  map.setTile(tile);

  //assert
  equals(map.hasTile(1, 2), true);
  equals(map.hasTile(4, 2), false);
});

/*
test('setController_validMapController_sets_controller', function () {
  //arrange
  var map = new Map();
  var mapController = new MapController();

  //act
  map.setController(mapController);

  //assert
  ok(map.controller === mapController, 'map.controller must match value set in map.setController()');
  //strictEqual freeze the browser O_o
  //strictEqual(map.controller, mapController, 'map.controller must match value set in map.setController()');
});
*/

/*
test('fetch_area_returnsThatArea', function () {
  //arrange
  var area = new Area(0, 0, 9, 9);
  var map = new Map();
  map.setController(new MapController());

  //act
  var tiles = map.fetch(area);

  //assert
  equal(tiles.length, area.getArea(), 'must return a number of tiles that matches the given area');
  equal(map.tiles.length, area.getArea(), 'must add a number of tiles to the map.tiles that matches the given area');
});
*/

/* TODO
- replace the MapController by a FakeController
- what happens when no MapController has been set? no tiles returned + log entry?
*/
