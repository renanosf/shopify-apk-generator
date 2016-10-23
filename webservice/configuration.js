/**
* Package : Shopify Challange
* Version : 0.1.0
* Author : Renan Fortes
* Description : Configuration file
**/

var path = require('path');

module.exports = {
	routesPath : path.join(__dirname,'routes'),
	commonRoutesFile : path.join(__dirname,'routes') + '/common.js',
	componentsPath : path.join(__dirname,'components'),
	faviconLocation : path.join(__dirname,'public') + '/favicon.ico',
	publicPaths : [
		{ path : path.join(__dirname,'public'), name : '/files'}
	],
	viewEngine : 'ejs',
	port: 3000,
	defaultLanguage : 'pt_BR',
	languages : []
};