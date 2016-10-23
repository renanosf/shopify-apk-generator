var express = require('express');
var path = require('path');
var morgan = require('morgan');
var FileStreamRotator = require('file-stream-rotator');
var fs = require('fs');
var bodyParser = require('body-parser');
var logger = require('./logger.js');
var configuration = require('../configuration.js');
var commonRoutes = require(configuration.commonRoutesFile);

var ajustaData = function(date){
	var ano = date.getFullYear().toString();
	var mes = ("00" + (date.getMonth() + 1).toString()).substr(-2);
	var dia = ("00" + date.getDate().toString()).substr(-2);
	var hours = ("00" + date.getHours().toString()).substr(-2);
	var minutes = ("00" + date.getMinutes().toString()).substr(-2);
	var seconds = ("00" + date.getSeconds().toString()).substr(-2);

	return ano + mes + dia + hours + minutes + seconds;
};

var app = express();

// ------------------------------------- LOG PART --------------------------------------------//
//Log Directory
var logDirectory = path.join(__dirname,'../log');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// create a rotating write stream 
var accessLogStream = FileStreamRotator.getStream({
  filename: logDirectory + '/access-%DATE%.log',
  frequency: 'daily',
  verbose: false
});
 
// setup the logger 
app.use(morgan('combined', {stream: accessLogStream}));
//------------------------------------- END LOG PART -----------------------------------------//

// ------------------------------------- COOKIES AND PARSES ----------------------------------//
//Body Parser
app.use(bodyParser.json({limit : '102400kb'}));
app.use(bodyParser.urlencoded({ extended: false, limit : '102400kb' }));
app.use(function(err, req, res, next) {
	if(err){
		var d = new Date();
		fs.writeFileSync(logDirectory + "/error-" + ajustaData(d), JSON.stringify(err), 'utf8');
		res.status(400).json({status : 0, erro : -1});
	}else{
		next();
	}
});
// ------------------------------------- END COOKIES AND PARSES ------------------------------//

//Rotas Comuns
commonRoutes(app);

// ------------------------------------- LIBS PART -------------------------------------------//
//Start some configurations
var config = require('./config.js')(app);
logger(config,1);
//Start routes
var routes = require('./routes.js')(app);
logger(routes,1);
// ------------------------------------- END LIBS PART ---------------------------------------//

module.exports = app;