module.exports = function(res,err){
	//Log Error?
	//Production
	if(typeof process.env.NODE_ENV !== 'undefined' && process.env.NODE_ENV === 'production'){
		res.sendStatus(500);
	}else{
		//Development
		res.send(err.toString());
	}
}