module.exports = {
	aceitaImagem : function(req,file,cb){
		switch(file.mimetype){
			case 'image/png':
				cb(null,true);
				break;
			default:
				cb(-6,false);
				break;
		}
	}
};