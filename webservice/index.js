var app = require('./lib/app.js');
var config = require('./configuration.js');
var http = require('http');

app.set('port', config.port);

var server = http.createServer(app);

server.listen(config.port);

module.exports = {
	server : server,
	app : app
};