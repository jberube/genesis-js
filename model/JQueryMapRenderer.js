/// <reference path="./Model.js" />
/// <reference path="../client/js/libs/jquery.current.js" />

/// Handles the DOM elements to display the map.
JQueryMapRenderer = function(selector, options) {
	this.tileSize = options.tileSize;
	this.buffer = options.buffer;
	this.viewport = options.viewport;

	// keep max in outer context so it can be reused
	this.frame = 75;
	this.max = 5;

	this.$grid = selector;
	this.$grid.append('<div id="tiles"></div>');
	this.$tiles = this.$grid.children('#tiles');
	this.tilesAge = [];
	this.renderQueue = [];

	setInterval.call(this, this.next, this.frame);
};

/// kickoff the rendering loop.
JQueryMapRenderer.prototype.next = function() {
	//if queue is empty, it's over
	if(this.renderQueue.length <= 0)
		return;

	//render next frames	
	var tile, i=0, toAdd='',
		span, acc, start = new Date();
	do {
		//fetch next tile to render
		if(!(tile = this.renderQueue.shift()))
			break;
		// ensure the tile is strongly typed	
		if (!(tile instanceof Tile))
			tile = Tile.prototype.createFromObject(tile);
		// verify if the tile should be rendered
		if(!this.tileRenderable.call(this, tile))
			continue;
		var html = this.renderTileString.call(this, tile);
		// update the tile's age
		this.tilesAge[tile.x + ',' + tile.y] = tile.timestamp;
		// check if the tile already exist
		var $tile = this.$tiles.children('#x' + tile.x + 'y' + tile.y); 
		if($tile.hasClass('selected')){
			$tile.replaceWith($(html).addClass('selected'));
		} else
			toAdd += html;

		i++;
	} while (i < this.max)

	// render the new tiles in DOM
	if(toAdd.length > 0)
		this.$tiles.append(toAdd);

	//adjust rendering speed if too slow
	span = new Date() - start;
	//protect against extremums
	if(i >= this.max) {
		acc = (this.frame / span);
		if(acc > 2)
			acc = 2;
		else if(acc < 0.5)
			acc = 0.5;
		else
			//target 90% potential speed
			acc*=0.9;
		this.max*=acc;
		$('#tpf').text('tpf: ' + this.max);
	}
};

// Try to render the given tile.
JQueryMapRenderer.prototype.renderTile = function(tile) {
	// ensure the tile is strongly typed	
	if (!(tile instanceof Tile))
		tile = Tile.prototype.createFromObject(tile);

	// verify if the tile should be rendered
	if(!this.tileRenderable(tile))
		return false;

	// render the tile.
	var html = this.renderTileString(tile);

	// put it in the DOM
	var $tile = this.$tiles.children('#x' + tile.x + 'y' + tile.y); 
	if ($tile.length > 0){
		if($tile.hasClass('selected')){
			$tile.replaceWith($(html).addClass('selected'));
			$('#colorPicker #r').val(tile.data.r);
			$('#colorPicker #g').val(tile.data.g);
			$('#colorPicker #b').val(tile.data.b);
		} else {
			$tile.replaceWith(html);
		}
	}
	else
		this.$tiles.append(html);
	return true;
};

// Try to render the given tile.
JQueryMapRenderer.prototype.tileRenderable = function(tile) {
	// do not render already valid tile
	if(this.tilesAge[tile.x + ',' + tile.y] == tile.timestamp) {
		//console.log('ignored ' + tile.getId() + ', timestamp:' + tile.timestamp);
		return false;
	}

	// determine if the tile is in the visible area of the viewport.
	return this.isTileVisible(tile);
};

JQueryMapRenderer.prototype.renderTileString = function(tile) {
	var left = this.tileSize * tile.x;
	var top = this.tileSize * tile.y;
	return '<div class="tile" id="x' + tile.x + 'y' + tile.y + '" style="background-color:rgb('
			+ tile.data.r + ',' + tile.data.g + ',' + tile.data.b
			+ ');left:' + left + 'px;top:' + top + 'px">(' + tile.getId() + ')</div>';
};

// Try to render the given tile.
JQueryMapRenderer.prototype.renderTiles = function(tiles) {
	//make a rendering queue that works across multiple events
	this.renderQueue = this.renderQueue.concat(tiles);	
};

// Try to render the given tile.
JQueryMapRenderer.prototype.isTileVisible = function(tile) {
	return tile.x >= this.viewport.x - this.buffer
			&& tile.x <= this.viewport.x1 + this.buffer
			&& tile.y >= this.viewport.y - this.buffer
			&& tile.y <= this.viewport.y1 + this.buffer;
};

// center viewport around a tile 
JQueryMapRenderer.prototype.centerViewport = function(tile) {
	var bufferX = Math.floor((this.$grid.width() / this.tileSize + 1) / 2);
	var bufferY = Math.floor((this.$grid.height() / this.tileSize + 1) / 2);
	 
	var area = new Area(
		tile.x - bufferX, 
		tile.y - bufferY, 
		tile.x + bufferX,
		tile.y + bufferY
	);
	this.setViewport(area);

	return area;
};

JQueryMapRenderer.prototype.focus = function(tileElement) {
	// center viewport on element, relative to offset parent
	var $element = $(tileElement);
	// offset of the parent, relative to the document
	var $parent = $element.offsetParent();
	// offset of the viewport, relative to the document
	var $viewport = $parent.offsetParent();

	// offset to center an element in the viewport, relative to the viewport
	var focusX = $viewport.width() / 2 - this.tileSize / 2;
	var focusY = $viewport.height() /2 - this.tileSize / 2;

	// add viewport offset
	var viewportOffset = $viewport.offset();
	focusX += viewportOffset.left;
	focusY += viewportOffset.top;

	// substract the current tile's position
	var elementPosition = $element.position();
	focusX -= elementPosition.left;
	focusY -= elementPosition.top;

	// position the offset parent
	$parent.offset({
		top : focusY, 
		left : focusX
	});

	// select focused element
	$element.addClass("selected").siblings().removeClass("selected");
};

JQueryMapRenderer.prototype.resizeGrid = function() {
	var height = $(window).height();
	height -= this.buffer*2;
	height -= height % this.tileSize;
	
	var width = $(window).width();
	width -= this.buffer*2 + 200;
	width -= width % this.tileSize;
	this.$grid.css('height', height + 'px');
	this.$grid.css('width', width + 'px');
};

// Get the viewport in which this renderer operates.
JQueryMapRenderer.prototype.getViewport = function() {
	var height = $(window).height();
	var width = $(window).width();

	var nbTilesX = Math.ceil(width / this.tileSize);
	var nbTilesY = Math.ceil(height / this.tileSize);

	// Gets the origin (upper left tile of the area).
	var pos = this.$grid.position();
	var x = Math.ceil(pos.left / this.tileSize) * -1;
	var y = Math.ceil(pos.top / this.tileSize) * -1;

	return new Area(x, y, x + nbTilesX, y + nbTilesY);
}

// Set the viewport in which this renderer operates.
JQueryMapRenderer.prototype.setViewport = function(area) {
	this.viewport = area;
};

