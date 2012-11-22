/// <reference path="../qunit/qunit.js" />
/// <reference path="../../../model/Model.js" />
/// <reference path="../../../model/JQueryMapRenderer.js" />
/// <reference path="../../js/libs/jquery.current.js" />

/*******************************************************************************
 * **** JQueryMapRenderer
 ******************************************************************************/
/*
module('JQueryMapRenderer.js');

test('constructor_creates A jQuery map renderer', function() {
	// arrange

	// act
	var selector = $('<div></div>');
	var renderer = new JQueryMapRenderer(selector);

	// assert
	ok(renderer instanceof JQueryMapRenderer);
	ok(renderer instanceof MapRenderer);
});

test('renderTile_tileInViewport_rendersTheTile',
		function() {
			// arrange
			var selector = $('<div></div>');
			var renderer = new JQueryMapRenderer(selector, 100);
			renderer.setViewport(new Area(5, 20, 15, 26));
			var tile = new Tile(10, 25, {
				r : 10,
				g : 12,
				b : 124
			});

			// act
			renderer.renderTile(tile);

			// assert
			equals(renderer.$grid.children().length, 1,
					'exactly one tile should have been rendered');
			var tileElement = renderer.$grid.find('.tile:eq(0)');
			ok(tileElement.hasClass('tile'),
					'rendered tile should have class \'tile\'');
			equals(tileElement.text(), '(10,25)');
		});

test('renderTile_selectorHasMultipleElements_rendersATileInAllSelectors',
		function() {
			// arrange
			var selector = $('<div></div><div></div>');
			var renderer = new JQueryMapRenderer(selector, 100);
			renderer.setViewport(new Area(0, 0, 100, 100));
			var tile = new Tile(24, 30, {
				r : 10,
				g : 12,
				b : 124
			});

			// act
			renderer.renderTile(tile);

			// assert
			equals(renderer.$grid.find('.tile').length, 2);
			equals(renderer.$grid.find('.tile').eq(0).text(), '(24,30)');
			equals(renderer.$grid.find('.tile').eq(1).text(), '(24,30)');
		});

test('renderTile_tileAlreadyExists_tileNotRendered', function() {
	// arrange
	var selector = $('<div></div>');
	var renderer = new JQueryMapRenderer(selector, 100);
	renderer.setViewport(new Area(0, 0, 100, 100));
	var tile = new Tile(17, 34, {
		r : 10,
		g : 12,
		b : 124
	});

	// act
	renderer.renderTile(tile);
	renderer.renderTile(tile);

	// assert
	equals(renderer.$grid.find('.tile').length, 1);
	equals(renderer.$grid.find('.tile').eq(0).text(), '(17,34)');
});

test('isTileVisible_tileNotVisible_tileRendered', 1, function() {
	// arrange
	var selector = $('<div></div>');
	var renderer = new JQueryMapRenderer(selector);
	var map = new Map();
	renderer.attachTo(map);
	var tile1 = new Tile(0, 0, {
		r : 111,
		g : 111,
		b : 111
	});
	var tile2 = new Tile(100, 100, {
		r : 222,
		g : 222,
		b : 222
	});

	// act
	renderer.renderTile(tile1);
	renderer.renderTile(tile2);

	// assert
	equals(renderer.$grid.find('.tile').length, 1,
			'only one tile should have been rendered');
});

test('isTileInDOM_tileInDOM_returnsTrue', 1, function() {
	// arrange
	var selector = $('<div></div>');
	var renderer = new JQueryMapRenderer(selector);
	var map = new Map();
	renderer.attachTo(map);
	var tile = new Tile(0, 0, {
		r : 12,
		g : 12,
		b : 12
	});
	renderer.renderTile(tile);

	// act
	var result = renderer.isTileInDOM(tile);

	// assert
	ok(result);
});

test('isTileInDOM_tileNotInDOM_returnsFalse', 1, function() {
	// arrange
	var selector = $('<div></div>');
	var renderer = new JQueryMapRenderer(selector);
	var map = new Map();
	renderer.attachTo(map);
	var tile = new Tile(0, 0, {
		r : 12,
		g : 12,
		b : 12
	});

	// act
	var result = renderer.isTileInDOM(tile);

	// assert
	ok(!result);
});
*/
