/// <reference path="../node_modules/socket.io/lib/socket.io.js" />

(function(port) {
	console.log('current working directory (process.cwd()): ' + process.cwd());

	var http = require('http');
	var app = http.createServer(handler);

	var io = require('socket.io').listen(app);
	var fs = require('fs');
	var path = require('path');
	var qs = require('querystring');

	var model = require('../model');
	var server = require('./Game');
	var ctrlr = require('./GameController');
	
	app.listen(port);
	console.log('Server running on port ' + port);

	function handler(request, response) {
		console.log('request starting for url: ' + request.url);

		// try to route the request
		for (i in routing.routes) {
			var route = routing.routes[i];
			// validate the method
			if(route.method && request.method != route.method)
				continue;
			// match the route against the request
			var matches = route.urlTemplate.exec(request.url);
			if (!matches) 
				continue;
			// match found
			//TODO: generic tracing for requests
			console.info('route matched: ' + route.urlTemplate);
			console.info(request.method + ' ' + request.url);
			route.callback.call(route, request, response, matches);
			break;
		}
	}

	// cheap routes object
	var routing = {
		routes : []
	};

	// map service
	routing.routes.push( {
		method : 'GET',
		urlTemplate : new RegExp('^/map/(-?[0-9]+,-?[0-9]+)(;-?[0-9]+,-?[0-9]+)?(.*)?$'),
		callback : function(request, response, matches) {
			try {
				var coords = parseCoords(matches[1]);
				if (matches.length >= 3 && matches[2])
					coords = parseCoords(matches[2], coords);
				var area = getMapArea(coords);
			} catch (e) {
				necronomicon.add(e);
			}
			response.writeHead(200, {
				'Content-Type' : 'text/json'
			});
			response.end(JSON.stringify(area), 'utf-8');
		}
	});

	routing.routes.push( {
		method : 'POST',
		urlTemplate : new RegExp('^/map/update/(-?[0-9]+,-?[0-9]+)(\\?.*)?$'),
		callback : function(request, response, matches) {
			request.setEncoding();
			var body = '';
			request.on('data', function (data) {
					body += data;
			});
			request.on('end', function () {
			  //var POST = qs.parse(body);
				var tile = JSON.parse(body);
				updateTile(tile);
				io.sockets.emit('tile-updated', tile);

				response.writeHead(200);
				response.end();
			});
		}
	});

	// echo service, to use in tests
	routing.routes.push( {
		urlTemplate : new RegExp('^/echo$'),
		callback : function(request, response, matches) {
			if (request.method == 'POST') {
				var body = '';
				request.on('data', function(data) {
					body += data;
					response.writeHead(200, {
						'Content-Type' : 'text/json'
					});
					response.write(JSON.stringify(body));
					response.end();
				});
				request.on('end', function() {
					var POST = qs.parse(body);
					response.writeHead(200, {
						'Content-Type' : 'text/json'
					});
					response.write(JSON.stringify(POST));
					response.end();
				});
			}
		}
	});

	// fallback route: serve default file
	routing.routes.push( {
		urlTemplate : new RegExp('^/$'),
		callback : function(request, response, matches) {
			var path = request.url + 'client/index.html';
			redirectTo(request, response, path);
		}
	});

	// fallback route: serve a file
	routing.routes.push( {
		urlTemplate : new RegExp('^/.+$'),
		callback : function(request, response, matches) {
			// try to serve a file
			serveFile(request, response, '.');
		}
	});

	// generate a random map
	//TODO: Create the game object
	var map = new model.Map();
	var game = new server.Game(map);
	var controller = new ctrlr.GameController(game);
	
	var clients = [];
	io.sockets.on('connection', function(socket) {
		// client is fully initialized
		clients.push(socket);
		socket.emit('socket ready:' + socket);
		/*
		 * socket.on('my other event', function(data) { console.log(data);
		 * });
		 */
	});

	// Serve a file
	function serveFile(request, response, root) {

		var filePath;
		if (root)
			filePath = root + request.url;
		else
			filePath = request.url;
		console.log('trying to serve file: ' + filePath);

		// determine contentType from file extension
		var contentType;
		var extname = path.extname(filePath);
		switch (extname) {
		case '.js':
			contentType = 'text/javascript';
			break;
		case '.css':
			contentType = 'text/css';
			break;
		default:
			contentType = 'text/html';
			break;
		}

		path.exists(filePath,
			function(exists) {
				console.log('exists: ' + exists);
				if (!exists) {
					console.log('file ' + filePath + ' does not exist. Do something about it or get used to it.');
					response.writeHead(404);
					return response.end('not found: ' + filePath, 'utf-8');
				}

				fs.readFile(filePath,
					function(error, content) {
						if (error) {
							console.log('error reading file: ' + filePath);
							response.writeHead(500);
							return response.end('error reading file: ' + filePath + ', error: ' + error);
						}

						console.log('success reading file: ' + filePath);
						response.writeHead(200, { 'Content-Type' : contentType });
						return response.end(content, 'utf-8');
					});
				});
	}

	function redirectTo(request, response, path) {
		console.log('redirecting to: ' + path);
		//TODO: broken - put the right headers		
		response.writeHead(301, {location : path});
		response.end(path);
	}

	// get an area of the map for these coords
	function getMapArea(coords) {
		console.log('getMapArea(coords)');
		console.info('coords:' + JSON.stringify(coords));
		var area = {
			origin : coords[0],
			tiles : []
		};
		// only one coordinate, i.e.: /map/0,5.
		if (typeof (coords[1]) === 'undefined') {
			var tile = getTile(area.origin.x, area.origin.y);
			area.tiles.push(tile);
			return area;
		}
		// coordinate range, i.e.: /map/0,5;10,12
		for ( var i = 0; i <= coords[1].x - coords[0].x; i++) {
			var x = area.origin.x + i;
			for ( var j = 0; j <= coords[1].y - coords[0].y; j++) {
				var y = area.origin.y + j;
				var tile = getTile(x, y);
				area.tiles.push(tile);
			}
		}
		return area;
	}

	function getTile(x, y) {
		if (!game.map.tiles[x])
			game.map.tiles[x] = [];
		if (!game.map.tiles[x][y])
			return (game.map.tiles[x][y] = createRandomTile(x, y));
		return game.map.tiles[x][y];
	}

	function updateTile(tile) {
		//update the tile's timestamp
		tile.timestamp = new Date().getTime();
		if (!game.map.tiles[tile.x])
			game.map.tiles[tile.x] = [];
		console.log('replacing ' + game.map.tiles[tile.x][tile.y] + ' by ' + tile.data);
		game.map.tiles[tile.x][tile.y] = tile;
	}

	function parseCoords(input, coords) {
		input = input.replace(/^;/, '');
		if (!coords)
			coords = [];

		var point = input.split(',');
		coords.push( {
			x : parseInt(point[0]),
			y : parseInt(point[1])
		});
		return coords;
	}

	function createRandomTile(x, y) {
		var r = Math.floor(256 * Math.random());
		var g = Math.floor(256 * Math.random());
		var b = Math.floor(256 * Math.random());
		var tile = new Tile(x, y, {
			r : r,
			g : g,
			b : b
		});

		return tile;
	}
})(1337);
