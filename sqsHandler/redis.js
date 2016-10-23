var redis = require("redis"),
client = redis.createClient({host : process.env.SHOPIFY_REDIS_HOST});

var connected = false;

client.on("error",function(error){
	console.log("Error connecting to Redis");
});

client.on("reconnecting",function(data){
	connected = false;
	console.log("Reconnecting");
});

client.on("ready",function(){
	connected = true;
	console.log("Redis is ready to use");
});

client.on("connect",function(){
	console.log("Redis is connected");
});

module.exports = {
	client : client,
	isConnected : function(){
		return connected;
	}
};