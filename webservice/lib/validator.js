//Modulo Validador de Email
var emailValidator = require("email-validator");

//Caso A requisição não tenha enviado todos os parametros necessário gerar a mensagem explicativa
var stringifyParametrosNecessarios = function(obj){
	var str = 'Sintaxe inválida. Parâmetros obrigatórios: ';
	for(var prop in obj){
		str += prop + ', ';
	}
	return str.slice(0,-2);
};

//Verifica se o valor está dentro das specificações exigidas
var checkSteps = function(obj,value,variable){
	for(var prop in obj){
		switch(prop){
			case 'email':
				if(!emailValidator.validate(value) && isNaN(value)) return retornaErroObjeto(obj[prop]);
				break;
			case 'maxLength':
				if(value.toString().length > obj[prop].expected) return retornaErroObjeto(obj[prop]);
				break;
			case 'minLength':
				if(value.toString().length < obj[prop].expected) return retornaErroObjeto(obj[prop]);
				break;
			default:
				break;
		}
	}
	return true;
}

//Metodo para retornar o objeto de erro
var retornaErroObjeto = function(obj){
	return {
		mensagem : obj['mensagem'],
		status : 422,
		erro : obj['erro']
	};
}

//Modulo Validador de JSONs enviados para o webservice
//Recebe um array de metodos com seus respectivos parametros obrigatórios
//Recebe o json enviado na requisição
//Recebe o nome da requisição atual

module.exports = function(arr,body,method){
	
	if(typeof arr[method] !== 'undefined'){
		
		for (var prop in arr[method]) {
			
			if(typeof body[prop] === 'undefined'){
				return {
					mensagem : stringifyParametrosNecessarios(arr[method]),
					status : 400,
					erro: -1
				};
			}
			
			switch(arr[method][prop]['type']){
				case 'number|string':
					if(isNaN(body[prop]) && typeof body[prop] !== 'string'){
						return retornaErroObjeto(arr[method][prop]);
					}
					break;
				case 'number':
					if(isNaN(body[prop])){
						return retornaErroObjeto(arr[method][prop]);
					}
					break;
				case 'array':
					if(body[prop].constructor !== Array){
						return retornaErroObjeto(arr[method][prop]);
					}
				default:
					break;
			}

			var check = checkSteps(arr[method][prop]['steps'],body[prop],prop);
			if(typeof check === 'object') return check;

		}
		return true;
	
	}else{
		return true;
	}
}