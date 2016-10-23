// ---------------------------------- CARREGAMENTO DE MODULOS ----------------------------------//
//ExpressJS
var express = require('express');
var expressRouter = express.Router();

//Carrega bibliotecas do framework
var render = require('../../lib/render.js');
var _reject = require('../../lib/reject.js');
var router = require('../../lib/router.js');
var validator = require('../../lib/validator.js');

//Carrega modulos necessários
var path = require('path');
var Promise = require('promise');
var uuid = require('uuid');
var multer  = require('multer');
var fs = require("fs");
var async = require("async");

//Javascripts da rota
var mimetype = require('./utils/mimetype.js');
var flow = require('./utils/flow.js')('temp');
var routesConfig = require('./utils/_configuration.js');
var model = require('./model/webservice.js');
var _required = require('./utils/_required.js');

//Mimetypes aceito para upload
//2097152 = 2MB
var uploadImagem = multer({ dest : 'temp/', fileFilter : mimetype.aceitaImagem, limits : {fileSize : 2097152}}).single('file');
// ------------------------------------- FIM CARREGAMENTO DE MODULOS --------------------------//

expressRouter.options('*',function(req,res,next){
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
	res.header("Access-Control-Allow-Headers", "Content-Type");
	res.header("Access-Control-Expose-Headers", "Content-Type");

	res.status(200).json({status : 1});
});

//Function to set CORS Headers
expressRouter.all('*',function(req, res, next){

	//CORS
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
	res.header("Access-Control-Allow-Headers", "Content-Type");
	res.header("Access-Control-Expose-Headers", "Content-Type");

	next();

});

//Verifica se os parametros necessários foram enviados na requisição
//Caso os parametros estejam incorretos retornar erro 400
//Senão prosseguir com a rota
expressRouter.post('/:metodo',function(req, res, next){
	var r = validator(_required,req.body,req.params.metodo);
	if(typeof r === 'object'){
		res.status(r.status).json({status: 0, erro: r.erro, mensagem: r.mensagem});
		return null;
	}
	next();
});

router.route('/setKeys',expressRouter,'post',routesConfig.map,function(req, res, next){
	
	model.setKeys(req.body)
	.then(function(custom_collections){
		res.json({status : 1, custom_collections : custom_collections});
	})
	.catch(function(err){
		res.json({status : 0, msg : err});
	});

});

router.route('/getProducts',expressRouter,'post',routesConfig.map,function(req, res, next){
	
	model.getProducts(req.body)
	.then(function(products){
		res.json({status : 1, products : products});
	})
	.catch(function(err){
		res.json({status : 0, msg : err});
	});

});

router.route('/getInfoApp',expressRouter,'post',routesConfig.map,function(req, res, next){
	
	model.getInfoApp(req.body)
	.then(function(data){
		res.json(data);
	})
	.catch(function(err){
		res.json({status : 0, msg : err});
	});

});

router.route('/createApp',expressRouter,'post',routesConfig.map,function(req, res, next){
	
	model.createApp(req.body)
	.then(function(data){
		res.json(data);
	})
	.catch(function(err){
		res.json({status : 0, msg : err});
	});

});

expressRouter.post('/upload',function(req,res,next){
	uploadImagem(req,res,function(err){
		if(!err){
			
			var totalChunks = req.body.flowTotalChunks;
			var currentChunk = req.body.flowChunkNumber;
			var tipo = req.body.tipo;

			if(['icon','splash'].indexOf(tipo) === -1){
				fs.unlink(req.file.path,function(){});
				res.status(422).json({status : 0, erro : -105, mensagem : 'Invalid upload type'});
			}else{
				flow.post(req, function(status, filename, original_filename, identifier) {
				
					var extensao = identifier.slice(-3);

	    			if(status === 'done' && totalChunks == currentChunk){
	    				model.mergeFile(totalChunks,identifier)
	    				.then(function(buffer){
	    					return model.sendToAmazon(extensao,buffer,tipo);
	    				})
	    				.then(function(link){
	    					res.status(200).json({arquivo : link});
	    				})
	    				.catch(function(erro){
	    					console.log(erro);
	    					res.status(422).json({status : 0, erro : erro});
	    				});
	    			}else{
	    				res.status(200).json({arquivo : identifier});
	    			}
	  			});
			}

		}else{
			var erro = typeof err === 'number' ? err : -7;
			res.status(400).json({status : 0, erro : erro});
		}
	});
});

expressRouter.get('/upload',function(req,res){
	flow.get(req, function(status, filename, original_filename, identifier) {

	    if (status == 'found') {
	      	status = 200;
	      	res.status(status).json({arquivo : identifier});
	    } else {
	      	status = 204;
	      	res.status(status).send();
	    }

  	});
});

expressRouter.all('*',function(req, res, next){
	
	res.status(200).json({
		status : 1,
		msg : 'Willllsoon'
	});

});

module.exports = {
	name : '/webservice',
	router : expressRouter,
	languages : routesConfig.languages
};