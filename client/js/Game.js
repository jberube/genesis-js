/*
  Game
  A new game with an empty map.
*/
Game = function (map, renderer, controller) {
  this.map = map;
  this.mapRenderer = renderer;
  this.mapController = controller;

	var $this = this;
	var _eventHandlers = {
		onTileAdded : function(tiles) {
			$this.map.setTiles(tiles);
			$this.mapRenderer.renderTiles(tiles);
		}
	}

	this.mapController.on('tiles-updated', _eventHandlers.onTileAdded);

	// set grid size and fetch missing tiles
	//TODO: _game.move(0, 0); 
	//or _game.focus(0, 0);
	//or _game.mapRenderer.centerViewport(0, 0)
	this.mapRenderer.resizeGrid();
	this.fetchMissingTiles();
};

/// Find a tile corresponding to a DOM element
Game.prototype.findTile = function(element){
		var tileId = element.attributes['id'].nodeValue;
		tileId = tileId.replace('x', '').replace('y', ',');
		var tile = _game.map.getTile(tileId);
		if (typeof tile === 'undefined')
			console.error('unable to find tile' + tileId);
		return tile;
};

Game.prototype.fetchMissingTiles = function() {
	var area = this.mapRenderer.getViewport();
	this.mapRenderer.setViewport(area);
	this.mapController.fetch(area);
}

