var languages = (function () {

	var fs = require('fs');
	var Gettext = require("node-gettext");
	var gt = new Gettext();
	var path = require('path');

	return {
		getGt : function(){
			return gt
		},
		addTextDomain : function(type,elem,langs,folder){
			for(var i = 0; i < langs.length; i++){
				var fileContents = fs.readFileSync(path.join(folder,elem,'languages') + '/' + elem + '_' + langs[i] + '.mo');
				gt.addTextdomain(type + '_' + elem + '_' + langs[i], fileContents);
			}
		}
	};

})();

module.exports = languages;