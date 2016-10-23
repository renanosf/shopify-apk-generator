var Promise = require('promise');
var request = require('request');
var fs = require("fs");
var Imagemin = require('imagemin');
var async = require('async');
var redis = require('../../../lib/redis.js');
var aws = require('../../../lib/aws.js');
var AWS = require('aws-sdk');

var appQueueUrl = "https://sqs.us-east-1.amazonaws.com/977575696306/appQueue";

var sqs = new AWS.SQS({region: "us-east-1"});

var Model = function(){};

Model.prototype.createApp = function(data){
	data.action = "createApp";

	var promise = new Promise(function(resolve,reject){
		var params = {
        	MessageBody: JSON.stringify(data),
        	QueueUrl: appQueueUrl,
        	DelaySeconds: 0
    	};

    	sqs.sendMessage(params, function(err, data2) {
        	if(err) {
        		console.log(err);
            	reject(JSON.stringify(err));
        	} else {
        		setFlagRedis(data.apiKey)
        		.then(function(){
        			resolve({status : 1, msg : "Your app is being generated. Refresh this page in a few minutes"});
        		});
        	}
    	});
	});
	
	return promise;
};

var setFlagRedis = function(apiKey){
	var promise = new Promise(function(resolve,reject){
		redis.client.set("app:" + apiKey + ":created","1",function(err,res){
			resolve();
		});
	});
	
	return promise;
};

Model.prototype.getInfoApp = function(data){
	var promise = new Promise(function(resolve,reject){
		appExists(data.apiKey)
		.then(function(){
			getApkLink(data.apiKey)
			.then(function(url){
				resolve({status : 2, apkUrl : url, msg : "Cool!!! Your app is ready"});
			})
			.catch(function(){
				resolve({status : 1, msg : "Your app is being generated. Refresh this page in a few minutes"});
			});
		})
		.catch(function(){
			resolve({status : 0, msg : 'Time to create the app'});
		});
	});
	
	return promise;
};

var getApkLink = function(apiKey){
	var promise = new Promise(function(resolve,reject){
		redis.client.get("app:" + apiKey + ":apk",function(err,res){
			if(err || res === null) reject();
			else resolve(res);
		});
	});
	
	return promise;
};

var appExists = function(apiKey){
	var promise = new Promise(function(resolve,reject){
		redis.client.get("app:" + apiKey + ":created",function(err,res){
			if(err || res === null) reject();
			else resolve();
		});
	});
	
	return promise;
};

Model.prototype.getProducts = function(data){
	var promise = new Promise(function(resolve,reject){
		getKeysInfo(data.apiKey)
		.then(function(info){
			return getProducts(data,info);
		})
		.then(function(products){
			resolve(products);
		})
		.catch(function(err){
			reject(err);
		});
	});
	
	return promise;
};

Model.prototype.setKeys = function(data){

	var _custom_collections = null;

	var promise = new Promise(function(resolve,reject){
		checkKeys(data)
		.then(function(custom_collections){
			_custom_collections = custom_collections;
			return saveKeys(data);
		})
		.then(function(){
			resolve(_custom_collections);
		})
		.catch(function(err){
			reject(err);
		})
	});
	
	return promise;
};

Model.prototype.mergeFile = function(totalChunks,identifier){

	var promise = new Promise(function(resolve,reject){
		var total = 1;
		var buffers = [];

		while(total <= totalChunks){
			buffers.push(readBuffer(total,identifier));
			total++;
		}

		Promise.all(buffers)
		.then(function(res){
			resolve(Buffer.concat(res));
		}).catch(function(err){
			reject(-8);
		});
	});

	return promise;

};

Model.prototype.sendToAmazon = function(extensao,buffer,tipo){
	var promise = new Promise(function(resolve,reject){
		aws.putObject(extensao,buffer,tipo,'public-read')
		.then(function(link){
			resolve(link);
		})
		.catch(function(err){
			console.log(err);
			reject(err);
		})
	});

	return promise;
};

var getProducts = function(data,info){
	var promise = new Promise(function(resolve,reject){
		var url = "https://" + info.apiKey + ":" + info.apiPassword + "@" + info.storeUrl + "/admin/products.json?collection_id=" + data.collectionId;
		request(url, function (error, response, body) {
	  		if (!error && response.statusCode == 200) {
	  			resolve(JSON.parse(body).products);
	  		}else{
	  			reject("Are you sure that these are the right keys?");
	  		}
		});
	});
	
	return promise;
};

var getKeysInfo = function(apiKey){
	var promise = new Promise(function(resolve,reject){
		redis.client.get("app:" + apiKey,function(err,res){
			if(err || res === null) reject("No info available");
			else resolve(JSON.parse(res));
		})
	});
	
	return promise;
};

var readBuffer = function(chunk,identifier){

	var promise = new Promise(function(resolve,reject){
		fs.readFile("temp/flow-" + identifier + "." + chunk,function(err,data){
			if(err){
				reject("Não foi possível ler o buffer");
			}
			else{
				resolve(data);
				fs.unlink("temp/flow-" + identifier + "." + chunk,function(err,data){});
			}
		});
	});

	return promise;

};

var saveKeys = function(data){
	var promise = new Promise(function(resolve,reject){
		var val = JSON.stringify(data);
		redis.client.set("app:" + data.apiKey,val,function(err){
			if(err) reject("Internal server error");
			else resolve();
		})
	});
	
	return promise;
};

var checkKeys = function(data){
	var promise = new Promise(function(resolve,reject){
		var url = "https://" + data.apiKey + ":" + data.apiPassword + "@" + data.storeUrl + "/admin/custom_collections.json";
		request(url, function (error, response, body) {
	  		if (!error && response.statusCode == 200) {
	  			resolve(JSON.parse(body).custom_collections);
	  		}else{
	  			reject("Are you sure that these are the right keys?");
	  		}
		});
	});
	
	return promise;
};

module.exports = new Model();