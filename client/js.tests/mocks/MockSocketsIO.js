/// Mock the behavior of io.sockets
var MockSocketsIOServer = function () {
	this.url='';
	this.connections = [];
	this.events = [];
};

MockSocketsIOServer.prototype.connect = function (url) {
	if (url) this.url = url;
	var conn = new MockSocketsIOConnnection(this);
	this.connections.push(conn);
	return conn;
}; 

MockSocketsIOServer.prototype.emit = function (e, data) {
	for(c in this.connections) {
		var conn = this.connections[c];
		if (!conn) return;
		var callback = conn.events[e];
		if(!callback) return;
		callback(data);
	}
};

MockSocketsIOServer.prototype.on = function (event, callback) {
	this.events[event] = callback;
};


var MockSocketsIOConnnection = function (server) {
	this.server = server;
	this.events = [];
};

MockSocketsIOConnnection.prototype.emit = function(event, data) {
	var callback = this.server.events[event];
	if (callback) callback(data);
};

MockSocketsIOConnnection.prototype.on = function (event, callback) {
	this.events[event] = callback;
};