/// <reference path="./Game.js" />
/// <reference path="../../model/Model.js" />
/// <reference path="../../model/JQueryMapRenderer.js" />
/// <reference path="./libs/jquery.current.js" />
var _game;

$(function() {
	console.log('document_ready');

	// attach to socket
	var socket = io.connect('http://localhost:1337');
	socket.on('ready', function() {
		console.log('server is ready');
	});
	socket.on('tile-updated', function(data) {
		console.log('server tile-updated');
		_game.mapRenderer.renderTile(data);
	});

	// initialize the map renderer
	var $grid = $('#grid');
	var mapRenderer = new JQueryMapRenderer($grid, {
		tileSize: 50,
		buffer: 20,
		viewport: new Area(0, 0, 0, 0)
	});

	_game = new Game(
		new Map(), 
		mapRenderer,
		new MapController(socket)
	);

	/// center viewport and select tile
	$grid.on('click', '.tile', function(event) {
		// select tile
		$(event.currentTarget).addClass('selected');
		// center on tile
		_game.mapRenderer.focus(event.target);
		// update color picker
		var tile = _game.findTile(event.currentTarget);
		$('#color .r').val(tile.data.r);
		$('#color .g').val(tile.data.g);
		$('#color .b').val(tile.data.b);
		// fetch missing tiles
		var area = _game.mapRenderer.centerViewport(tile);
		_game.mapController.fetch(area);
	});
	
	/// changing a tile color
	$('#color button').on('click', function(event) {
		var color = {r:0, g:0, b:0};
		color.r = new Number($('#color .r').val());
		color.g = new Number($('#color .g').val());
		color.b = new Number($('#color .b').val());
		if(color.r==NaN || color.g==NaN || color.b==NaN || color.r<0 || color.r>255 || color.g<0 || color.g>255 || color.b<0 || color.b>255) {
			console.log('invalid color: ' + JSON.stringify(color));
			return false;
		}
		
		var $sel = $('#tiles .tile.selected');
		var tile = _game.findTile($sel.get(0));
		if( !tile ) return false;
		tile.data = color;
		// rendered only when the server pushes the update		
		_game.mapController.update(tile);
	});
});

// resize grid on window resize
$(window).resize(function() {
	console.log('window_resize');
	_game.mapRenderer.resizeGrid();
	_game.fetchMissingTiles();
});


/*
 * drag var _lastMoveMap = new Date(); var _lastFecthMap = new Date(); var
 * _startPosition; $('#grid').live('mousedown', function(e) {
 * if(e.preventDefault) e.preventDefault(); console.log('#grid mousedown');
 * _startPosition = getPoint(e.clientX, e.clientY); });
 * 
 * $('#grid').live('mousemove', function(e) { if(e.preventDefault)
 * e.preventDefault(); if(!_startPosition) return -1;
 * 
 * var now = new Date(); var delayMoveMap = now - _lastMoveMap; if(delayMoveMap >
 * 150) { console.log('#grid mousemove: move'); _lastMoveMap = new Date(); var
 * newPos = getPoint(e.clientX, e.clientY); var vector =
 * getVector(_startPosition, newPos); moveElement($tiles, vector);
 * 
 * _startPosition = getPoint(e.clientX, e.clientY); }
 * 
 * var delayFecthMap = now - _lastFecthMap; if(delayFecthMap > 500) {
 * console.log('#grid mousemove: fetch'); fetchMap(); // reset timer
 * _lastFecthMap = now; } });
 * 
 * $('#grid').live('mouseup', function(e) { console.log('#grid mouseup'); var
 * newPos = getPoint(e.clientX, e.clientY); var vector =
 * getVector(_startPosition, newPos); moveElement($tiles, vector); fetchMap();
 * _startPosition = null; });
 * 
 * $('#grid').live('mouseleave', function(e) { fetchMap(); _startPosition =
 * null; });
 * 
 * $('.tile').live('click', function(e) { console.log('.tile click');
 * centerElement(e.target);
 * $(e.target).addClass("selected").siblings().removeClass("selected"); });
// Apply a translation to the element for the vector.
function moveElement(element, vector) {
	var $element = $(element);
	var targetPosition = $element.offset();
	$element.offset( {
		top : targetPosition.top + vector.y,
		left : targetPosition.left + vector.x
	});
}
*/

