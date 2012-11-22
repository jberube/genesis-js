/// <reference path="../../../../model/Model.js" />
/// <reference path="../../../js/libs/jquery-1.6.2.js" />

/// Mock the behavior of a MapRenderer
MockMapRenderer = function (enableLog, maxLogLength) {
  // Call the parent constructor
  //MapRenderer.call(this);

  var _enableLog = (typeof enableLog != 'undefined' && enableLog === true);
  var _maxLogLength = (typeof maxLogLength != 'undefined' ? maxLogLength : 100);
  this.log = [];
}

// inherit MapRenderer
//MockMapRenderer.prototype = new MapRenderer(true);
// correct the constructor pointer because it points to MapRenderer
//MockMapRenderer.prototype.constructor = MockMapRenderer;

/// Try to render the given tile.
MockMapRenderer.prototype.renderTile = function (tile) {
  // call the parent renderTile function.
  //MapRenderer.prototype.renderTile.call(this, tile);

  if (this._enableLog) {
    //log the event
    this.log.push('renderTile:' + tile.getId());

    //purge older log entries
    if (this._maxLogLength && log.length >= this._maxLogLength)
      this.log = this.log.slice(this._maxLogLength - (Math.Floor(this._maxLogLength * 0.25)), log.length);
  }
}

/// Try to render the given tile.
MockMapRenderer.prototype.renderTile = function (tile) {
  this.log.push('renderTile(' + tile.getId() + ')');
}
