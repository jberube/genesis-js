/*
  Map
  Contains a whole map.
*/
Map = function () {
  this.tiles = { length : 0 };
};

/// Add a tile to this map by coordinates.
Map.prototype.getTile = function (x, y) {
	if(typeof y === 'undefined')
		return this.tiles[x];
  return this.tiles[x + ',' + y];
};

/// Add a tile to this map.
Map.prototype.setTile = function (tile) {
	if(!(tile instanceof Tile))
		tile = Tile.prototype.createFromObject(tile);

	if (!this.hasTile(tile))
		this.tiles.length++;
  
  this.tiles[tile.getId()] = tile;
};

/// Add an array of tiles to this map.
Map.prototype.setTiles = function (tiles) {
  for (t in tiles) {
		this.setTile(tiles[t]);
  }
};

/// Verify a tile existence by coordinates.
Map.prototype.hasTile = function (x, y) {
  return (typeof this.tiles[x + ',' + y] != 'undefined');
};

/// Removes a tile by coordinates.
Map.prototype.removeTile = function (x, y) {
  if (this.hasTile(x, y)) {
    delete this.tiles[x + ',' + y];
    this.tiles.length--;
    return true;
  }
  return false;
};


/*
  Tile
  A square spot of 1x1 on a Map.
*/
Tile = function (x, y, data, timestamp) {
  this.x = x;
  this.y = y;
  this.data;
	if(timestamp)
		this.timestamp = timestamp;
	else
		this.timestamp = new Date().getTime();
  if (data)
    this.data = data;
  else
    this.data = { };
};

// Creates a typed Tile from an untyped object 
Tile.prototype.createFromObject = function (tile) {
	return new Tile(tile.x, tile.y, tile.data, tile.timestamp);
};

/// Returns this map Id, which is 'x,y'.
Tile.prototype.getId = function () {
  return this.x + ',' + this.y;
};


/*
  Area
  A pair of coordinates representing an area on a map.
*/
Area = function (x, y, x1, y1) {
  this.x = x;
  this.y = y;
  this.x1 = x1;
  this.y1 = y1;
};

/// Returns the geometric area (width*height) of this Area.
Area.prototype.getArea = function () {
  return (Math.abs(this.x - this.x1) + 1) * (Math.abs(this.y - this.y1) + 1);
};

Area.prototype.toString = function () {
  return this.x + ',' + this.y + ';' + this.x1 + ',' + this.y1;
};

Area.prototype.width = function () {
  return Math.abs(this.x - this.x1) + 1;
};

Area.prototype.height = function () {
  return Math.abs(this.y - this.y1) + 1;
};


/*
  MapController
  Handles server operations for a Map.
*/
MapController = function (socket) {
	this.events = new EventHandler();
	this.socket = socket;
	this.socket.on('map-update', this.handleMapUpdate);
};

MapController.prototype.handleMapUpdate = function (data) {
	if (!data || !data.tiles)
		return;
	
	var tiles = [];
  for (i in data.tiles) {
      var tile = data.tiles[i];
      tiles.push(new Tile(tile.x, tile.y, tile.data));
  }
  this.events.fire('tiles-updated', tiles);
};

/// Fetch a map area and sets the tiles in the map.
/// returns: the tiles fetched.
MapController.prototype.fetch = function (area) {
	var $this = this;
	$.ajax({
    async : true,
    url: '/map/' + area.toString(),
    type: 'GET',
    cache: false,
    dataType: 'json',
    success: function (data, textStatus, jqXHR) {
			$this.events.fire('tiles-updated', null, data.tiles);
    }
  });
};

/// Notify the server about an update of a tile.
MapController.prototype.update = function (tile) {
	console.log('TILE:' + JSON.stringify(tile));
	$.ajax({
    async : true,
    url: '/map/update/' + tile.getId(),
    type: 'POST',
		data: JSON.stringify(tile),
    dataType: 'text',
    success: function (jqXHR, textStatus) {
			console.log('Tile ' + tile.getId() + 'sent');
    },
    error: function (jqXHR, textStatus, errorThrown) {
			console.warn('ERROR sending Tile ' + tile.getId());
			console.warn('textStatus: ' + textStatus + '. errorThrown: ' + errorThrown);
    }
  });
};

/// Register to a controller event.
MapController.prototype.on = function (eventName, callback) {
	this.events.on(eventName, callback);
};


/*
  EventHandler
  Allow binding of operations on objects.
*/
EventHandler = function () {
  this._events = [];
};

/// Register to an event.
/// eventName The name of the event to listen to (i.e.: 'tileAdded')
/// callback  The function to call when the event is fired
EventHandler.prototype.on = function (eventName, callback) {
	if (typeof callback === 'function') {
    // create the event if it does not exists
    if (typeof this._events[eventName] !== 'object') {
			var event = [];
			event.name = eventName;
			this._events[eventName] = event;
			this._events.push(event);
    }
    // adds a callback
    this._events[eventName].push(callback);
  }
};

/// eventName The name of the event (i.e.: 'tileAdded')
/// context   The value of this for the callback being called
/// args      Any other argument is passed to the callback when the event is fired
EventHandler.prototype.fire = function (eventName, context) {
  var event = this._events[eventName];
  for (l in event) {
    var listener = event[l];
    if (typeof listener === 'function') {
			// any other argument is passed to the callback
			var args = [];
			if(typeof arguments === 'object' && arguments.length >= 3)
				args = Array.prototype.slice.call(arguments, 2);

			// bind the given context for the callback passing additional arguments
			// if context is null or undefined, the global object is used 
			listener.apply(context, args);
		}
	}
};


// Node.js compatibility
if (typeof exports !== 'undefined') {
	exports.Map = Map;
	exports.Tile = Tile;
	exports.Area = Area;
	exports.EventHandler = EventHandler;
}
