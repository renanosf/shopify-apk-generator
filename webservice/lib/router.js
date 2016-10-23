module.exports = {
	route : function(name,router,method,map,f){
		if(map){
			for(var i = 0; i < map[name].length; i++){
				router[method](map[name][i],f);
			}
		}else{
			router[method](name,f);
		}
	}
}