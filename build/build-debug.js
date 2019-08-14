fs = require( "fs" );

var sJs = fs.readFileSync( "../js/Photobooth.js", "utf-8" );
var pImports = sJs.match( /\/\/include (.*)/g );

for( var i = 0; i < pImports.length; i++ )
{
	console.log( "including '" + "../js/" + pImports[ i ].substr( 10 ) + "'");
	var sInclude = fs.readFileSync( "../js/" + pImports[ i ].substr( 10 ), "utf-8" );
	sJs = sJs.replace( pImports[ i ], sInclude );
}

/**
* jQuery plugin code
*/
console.log( "Adding jQuery integration");
sjQuery = fs.readFileSync( "../js/jqueryIntegration.js", "utf-8" );

var sOutput = "";
sOutput += "/**\n";
sOutput += "*\n";
sOutput += "* Photobooth.js version 0.7-rsd2\n";
sOutput += "*\n";
sOutput += "* build " + ( new Date() ).toString() + "\n" ;
sOutput += "*\n";
sOutput += "* CSS\n";
sOutput += "*/\n";
sOutput += 'window.addEventListener("load",function(){var s = document.createElement("link"); s.href="css/Photobooth.css"; s.type = "text/css"; s.rel = "stylesheet"; document.head.appendChild(s);},false);\n';
sOutput += "/**\n";
sOutput += "* JS\n";
sOutput += "*/\n";
sOutput += sJs;
sOutput += "\n/**\n";
sOutput += "* jQuery integration. (It's safe to delete this line if you're not using jQuery)\n";
sOutput += "*/\n";
sOutput += sjQuery;

fs.writeFileSync( "../photobooth.js", sOutput, "utf-8" );
console.log( "DONE" );
