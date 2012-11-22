/// Handles the DOM elements to display the map.
GameController = function(game) {
	this.game = game;
	this.events = new EventHandler();
};

//GameController.prototype.

//Node.js compatibility
if (typeof exports !== 'undefined') {
	exports.GameController = GameController;
}
