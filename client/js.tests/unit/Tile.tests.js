/// <reference path="../qunit/qunit.js" />
/// <reference path="../../../model/Model.js" />

/**********************************************************************/
module('Tile.js');
/**********************************************************************/
test('Create a tile', function () {
  //arrange
  
  //act
  var tile = new Tile (1, 2);

  //assert
  equals(tile.x, 1);
  equals(tile.y, 2);
})

test('Get a tile id', function () {
  //arrange
  var tile = new Tile (5, -7);

  //act
  var id = tile.getId();
  //assert
  equals(id, '5,-7');
})
