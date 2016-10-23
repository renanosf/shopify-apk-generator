var fs = require('fs');
var Gettext = require("node-gettext");
var gt = new Gettext();
var path = require('path');

var Transaltions = (function () {

	var fileContents = fs.readFileSync(path.join(__dirname,"../languages/homepage_pt_BR.mo"));
	gt.addTextdomain("homepage_pt_BR", fileContents);

	fileContents = fs.readFileSync(path.join(__dirname,"../languages/homepage_en.mo"));
	gt.addTextdomain("homepage_en", fileContents);

	fileContents = fs.readFileSync(path.join(__dirname,"../languages/homepage_es.mo"));
	gt.addTextdomain("homepage_es", fileContents);

    return {};

})();

module.exports = gt;