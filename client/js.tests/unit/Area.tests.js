/// <reference path="../qunit/qunit.js" />
/// <reference path="../../../model/Model.js" />

/**********************************************************************/
module('Area.js');
/**********************************************************************/
test('Constructor_SetsProperties', function () {
  //arrange

  //act
  var area = new Area(1, 2, 10, 20);

  //assert
  equals(area.x, 1);
  equals(area.y, 2);
  equals(area.x1, 10);
  equals(area.y1, 20);
});

test('getArea_returs_Area\'sArea', function () {
  //arrange

  //act
  var area = new Area(0, 5, 9, 19);
  
  //assert
  equals(area.getArea(), 150);
});

test('getWidth_returs_Area\'sWidth', function () {
  //arrange

  //act
  var area = new Area(0, 5, 9, 19);

  //assert
  equals(area.getArea(), 150);
});

test('toString_returns_coordinatesOfArea', function () {
  //arrange

  //act
  var area = new Area(0, 2, 152, -19);

  //assert
  equals(area.toString(), '0,2;152,-19');
});
