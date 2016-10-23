var colors = require('colors/safe');

module.exports = function(message,type){

	if(!message) return false;

	switch(type){
		case 1:
			if(typeof process.env.NODE_ENV !== 'undefined'){
				console.log(colors.green(message));
			}
			break;
		case 0:
			console.log(colors.yellow(message));
			break;
		case -1:
			console.log(colors.red(message));
			break;
		default:
			if(typeof process.env.NODE_ENV !== 'undefined'){
				console.log(message);
			}
			break;
	}

};