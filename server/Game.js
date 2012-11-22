/*
  Game
  A new game with an empty map.
*/
Game = function (map) {
  this.map = map;
};

//just so Eclipse see Game as a class
Game.prototype.update = function(){
	
};

//Node.js compatibility
if (typeof exports !== 'undefined') {
	exports.Game = Game;
}
