/// <reference path="../qunit/qunit.js" />
/// <reference path="../../../client/js/libs/jquery-1.6.2.js" />
/// <reference path="../../../model/Model.js" />
/// <reference path="../mocks/MockMapRenderer.js" />


/**********************************************************************/
module('Map manipulation');
/**********************************************************************/
asyncTest('When adding a Tile to a Map, it is rendered', 3, function () {
  //arrange
  var game = new Game();
  var selector = $('<div></div>');
  var renderer = new JQueryMapRenderer(selector, 100);

  renderer.attachTo(game.map);

  //assert
  var timer = setTimeout(function () {
    clearTimeout(timer); delete timer;
    equals(selector.find('.tile').length, 2);
    equals(selector.find('.tile:eq(0)').text(), '(1,2)');
    equals(selector.find('.tile:eq(1)').text(), '(3,4)');
    start();
  }, 100);

  //act
  stop();
  game.map.setTile(new Tile(1, 2, { r: 32, g: 64, b: 128 }));
  game.map.setTile(new Tile(3, 4, { r: 0, g: 1, b: 2 }));
});

test('When fetching a Area of the Map, it is added to it\'s Tiles', function () {
  //arrange
  var game = new Game(new MapController());

  //act
  var area = new Area(-10, -10, 10, 10);
  game.map.fetch(area);

  //assert
  equals(game.map.tiles.length, area.getArea());
});

test('When the server refreshes an Area of the Map, it is added updated in the Map Tiles', function () {
	//arrange
	var mockSocket = new MockSocketsIOServer();
	var socket = mockSocket.connect('http://localhost:1234/blah');
	
	var game = new Game(new MapController(socket));

	//act
	var tiles = { tiles: [
	    new Tile(1,3,{}),
		new Tile(1,4,{}),
		new Tile(1,5,{})
	    ]};
	mockSocket.emit('map-update', tiles);

	//assert
	equals(game.map.tiles.length, 3);
});
