var Promise = require('promise');
var uuid = require('./uuid.js');
var AWS = require('aws-sdk');
var s3 = new AWS.S3({region : 'sa-east-1', endpoint : 'https://s3-sa-east-1.amazonaws.com'});

module.exports = {
	putObject : function(extensao,buffer,tipo,acl){
		var promise = new Promise(function(resolve,reject){
			
			var key = uuid.generate() + "-" + tipo + '.' + extensao;
			var params = {
				Body : buffer,
				ACL : acl,
				Bucket : "shopify-app-generator",
				Key : key,
				ContentType : 'image/png'
			};

			s3.putObject(params, function(err, data) {
  				if (err) reject(-9);
 	 			else resolve("https://shopify-app-generator.s3.amazonaws.com/" + key);
			});
		});

		return promise;
	}
};