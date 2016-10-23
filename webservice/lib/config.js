var path = require('path');
var express = require('express');
var config = require('../configuration.js');
var favicon = require('serve-favicon');
var logger = require('./logger.js');

//List of available engines to use with this package
var availableEngines = ['ejs'];

module.exports = function(app){

	//Check if view engine is available
	if(!config.viewEngine || availableEngines.indexOf(config.viewEngine) === -1){
		console.log('Unable to use viewEngine ' + config.viewEngine);
		process.exit(1);
	}
	app.set('view engine', config.viewEngine);
	logger('View engine set to ' + config.viewEngine,1);
	//End View Engine

	//Set favicon
	if(config.faviconLocation){
		try{
			app.use(favicon(config.faviconLocation));
			logger('Favicon loaded from ' + config.faviconLocation,1);
		}catch(err){
			logger('Check your favicon file',-1);
			process.exit(1);
		}
	}
	//End Favicon

	//Set static paths
	if(config.publicPaths){
		
		try{
			var l = config.publicPaths.length;
			for(var i = 0; i < l; i++){
				app.use(config.publicPaths[i].name, express.static(config.publicPaths[i].path));
			}
		}catch(err){
			logger('Unable to make publicPaths available. Check your configuration',-1);
			process.exit(1);
		}

	}
	//End statics paths

	return 'Configuration loaded successfully';

};