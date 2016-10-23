var fs = require('fs');
var path = require('path');
var config = require('../configuration.js');
var logger = require('./logger.js');
var languages = require('./languages.js');

//Load all routes inside routesPath folder and apply to app
module.exports = function(app){
	var routes = [];

	try{

		//Read dir
		var route = fs.readdirSync(config.routesPath);
	
		//Iterate each route
		route.forEach(function(elem){
			if(elem.indexOf('.') === -1){
				//Load Javascript
				var r = require(config.routesPath + '/' + elem + '/' + elem + '.js');
				//Load languages
				languages.addTextDomain('route',elem,r.languages,config.routesPath);
				//Load Routes
				routes.push(r);
			}
		});

		//Apply to express
		routes.forEach(function(route){
			app.use(route.name,route.router);
		});

		return routes.length + ' route(s) loaded successfully';
	
	}catch(err){

		//Handle Erros;
		if(typeof err.errno !== 'undefined' && err.errno === -4058){
			logger('No such directory in routesPath parameter',-1);
			process.exit(1);
		}else if(typeof err.code !== 'undefined' && err.code === 'MODULE_NOT_FOUND'){
			logger(err,-1);
			process.exit(1);
		}else{
			logger(err,-1);
			process.exit(1);
		}

	}
};