var Promise = require('promise');
var uuid = require('./uuid.js');
var AWS = require('aws-sdk');
var s3 = new AWS.S3({region : 'us-east-1', endpoint : 'https://s3.amazonaws.com'});

module.exports = {
	putObject : function(extensao,buffer,tipo,acl){
		var promise = new Promise(function(resolve,reject){
			
			var key = uuid.generate() + "-" + tipo + '.' + extensao;
			var params = {
				Body : buffer,
				ACL : acl,
				Bucket : process.env.SHOPIFY_S3_BUCKET,
				Key : key,
				ContentType : 'image/png'
			};

			s3.putObject(params, function(err, data) {
  				if (err) reject(-9);
 	 			else resolve("https://" + process.env.SHOPIFY_S3_BUCKET + ".s3.amazonaws.com/" + key);
			});
		});

		return promise;
	}
};