fs = require( "fs" );
var uglify = require("uglify-es");
var cleanCSS = require('clean-css');

var sJs = fs.readFileSync( "../js/Photobooth.js", "utf-8" );
var pImports = sJs.match( /\/\/include (.*)/g );

for( var i = 0; i < pImports.length; i++ )
{
	console.log( "including '" + "../js/" + pImports[ i ].substr( 10 ) + "'");
	var sInclude = fs.readFileSync( "../js/" + pImports[ i ].substr( 10 ), "utf-8" );
	sJs = sJs.replace( pImports[ i ], sInclude );
}

/**
* Compress JavaScript
* No idea what an ast is...works fine though :-)
*/
console.log( "Minifying JavaScript");
sJs = uglify.minify( sJs );

/**
* Css
*/
console.log( "Minifying css" );
sCss = cleanCSS.process( fs.readFileSync( "../css/Photobooth.css", "utf-8" ) );

/**
* jQuery plugin code
*/
console.log( "Adding jQuery integration");
sjQuery = fs.readFileSync( "../js/jqueryIntegration.js", "utf-8" );
sjQuery = uglify.minify( sjQuery );


var sOutput = "";
sOutput += "/**\n";
sOutput += "*\n";
sOutput += "* Photobooth.js version 0.7-rsd2\n";
sOutput += "*\n";
sOutput += "* build " + ( new Date() ).toString() + "\n" ;
sOutput += "*\n";
sOutput += "* CSS\n";
sOutput += "*/\n";
sOutput += 'window.addEventListener("load",function(){var s = document.createElement("style"); s.innerHTML="' + sCss + '"; document.head.appendChild(s);},false);\n';
sOutput += "/**\n";
sOutput += "* JS\n";
sOutput += "*/\n";
sOutput += sJs.code;
sOutput += "\n/**\n";
sOutput += "* jQuery integration. (It's safe to delete this line if you're not using jQuery)\n";
sOutput += "*/\n";
sOutput += sjQuery.code;


fs.writeFileSync( "../photobooth_min.js", sOutput, "utf-8" );

console.log( "DONE" );
