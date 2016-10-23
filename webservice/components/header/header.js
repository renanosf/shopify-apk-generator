var render = require('../../lib/render.js');
var path = require('path');
var cp = path.join(__dirname,'views');
var Promise = require('promise');

module.exports = {
	
	default : function(params){

		var promise = new Promise(function (resolve, reject) {

			params.domain = 'component_header_' + params.lc;
			render.get(cp,'header',params)
			.then(function(data){
				resolve(data);
			},function(err){
				reject(err);
			});
		});

		return promise;

	},

	languages : ['pt_BR','en','es']
};