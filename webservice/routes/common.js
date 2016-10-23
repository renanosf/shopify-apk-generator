var config = require('../configuration.js');

var findInLanguages = function(str){
	for(var i = 0; i < config.languages.length; i++){
		if(config.languages[i] === str) return str
	}
	return false;
};

module.exports = function(app){
	app.all('/',function(req,res,next){
		res.locals.lc = config.defaultLanguage
		next();
	});
	app.all('/:lang/',function(req,res,next){
		res.locals.lc = findInLanguages(req.params.lang);
		if(!res.locals.lc){
			res.locals.lc = config.defaultLanguage;
			res.locals.page = req.params.lang;
		}
		next();
	});
	app.all('/:lang/:page',function(req,res,next){
		res.locals.lc = findInLanguages(req.params.lang);
		if(!res.locals.lc){
			res.locals.lc = config.defaultLanguage;
			res.locals.page = req.params.lang;
			res.locals.method = req.params.page;
		}else{
			res.locals.page = req.params.page;
		}
		next();
	});
	app.all('/:lang/:page/:method',function(req,res,next){
		res.locals.lc = findInLanguages(req.params.lang);
		if(!res.locals.lc){
			res.locals.lc = config.defaultLanguage;
			res.locals.page = req.params.lang;
			res.locals.method = req.params.page;
			res.locals.query = req.params.method;
		}else{
			res.locals.page = req.params.page;
			res.locals.method = req.locals.method;
		}
		next();
	});
};