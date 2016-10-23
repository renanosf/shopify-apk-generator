var ejs = require('ejs');
var fs = require('fs');
var path = require('path');
var async = require('async');
var Promise = require('promise');

var languages = require('./languages');
var config = require('../configuration.js');
var logger = require('./logger.js');
var _reject = require('./reject.js');
//EJS delimiter
var options = {delimiter: '%'};

//Render component
var get = function(path,view,locals){

	var promise = new Promise(function (resolve, reject) {
		//Check locals
		if(!locals || typeof locals !== 'object'){
			reject('locals must be an object');
			return null;
		}

		//Check Views and Path
		if(!path || !view || typeof path !== 'string' || typeof view !== 'string'){
			reject('Wrong path or view');
			return null;
		}

		if(config.viewEngine === 'ejs'){
			locals.gt = languages.getGt();
			ejs.renderFile(path + '/' + view + '.ejs',locals,options,function(err,html){
	  			if(err == null) resolve(html);
	  			else reject(err.toString());
	  		});
		}
	});

	return promise;
};

module.exports = {
	
	send : function(path,view,res,locals){
		//Check if express response object was passed
		if(!res || typeof res.send !== 'function'){
			logger('You must pass the express response object in third parameter of render.send',-1);
			return false;
		}
		//Check local variables
		if(locals && (typeof locals !== 'object' || Array.isArray(locals))){
			logger('Locals must be an object on render.send',-1);
			_reject(res,'Locals must be an object on render.send');
			return false;
		}

		if(!path || !view || typeof path !== 'string' || typeof view !== 'string'){
			logger('Wrong path or view on render.send',-1);
			_reject(res,'Wrong path or view on render.send');
			return false;
		}

		var l = locals || {};
		l.gt = languages.getGt();

		if(config.viewEngine === 'ejs'){
			ejs.renderFile(path + '/' + view + '.ejs',l,options,function(err,html){
	  			if(err == null) res.send(html);
	  			else _reject(res,err);
	  		});
		}
	},
	getComponents : function(obj){

		var promise = new Promise(function(resolve,reject){
		
			var functions = [];
			
			for (var prop in obj) {
	  			if (obj.hasOwnProperty(prop)) {
	    			functions.push(function(callback){
						components[obj[prop].name][obj[prop].action](obj[prop].params)
						.then(function(data){
							var temp = {};
							temp[prop] = data;
							callback(null,temp);
						},function(err){
							callback(err);
						});
	    			});
	  			}
			}

			async.parallel(functions,function(err,results){
				if(err !== null){
					reject(err);
					return null;
				}
				var res = {};
				results.forEach(function(elem){
					for (var prop in elem) {
	  					if (elem.hasOwnProperty(prop)) {
	  						res[prop] = elem[prop];
	  					}
	  				}
				});
				resolve(res);
			});
		});

		return promise;
	},
	get : get
};

//Load components of application
var components = {};

try{
	var component = fs.readdirSync(config.componentsPath);
	
	component.forEach(function(elem){
		if(elem.indexOf('.') === -1){
			components[elem] = require(config.componentsPath + '/' + elem + '/' + elem + '.js');
			//Load languages
			languages.addTextDomain('component',elem,components[elem].languages,config.componentsPath);
		}
	});
}catch(err){
	if(typeof err.errno !== 'undefined' && err.errno === -4058){
		logger('Check your componentsPath configuration.',-1);
	}else{
		logger(err,-1);
	}
	process.exit(1);
}