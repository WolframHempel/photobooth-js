fs = require( "fs" );
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
 * Css
 */
console.log( "Minifying css" );
sCss = cleanCSS.process( fs.readFileSync( "../css/Photobooth.css", "utf-8" ) );

/**
* jQuery plugin code
*/
console.log( "Adding jQuery integration");
sjQuery = fs.readFileSync( "../js/jqueryIntegration.js", "utf-8" );

var sOutput = "";
sOutput += "/**\n";
sOutput += "*\n";
sOutput += "* Photobooth.js version 0.7-rsd3\n";
sOutput += "*\n";
sOutput += "* build " + ( new Date() ).toString() + "\n" ;
sOutput += "*\n";
sOutput += "* CSS\n";
sOutput += "*/\n";

// Because o CORB, embending the css here too: https://www.chromestatus.com/feature/5629709824032768
/*
sOutput += 'window.addEventListener("load",function(){var s = document.createElement("link"); ';
sOutput += ' s.href="https://raw.githubusercontent.com/rsd/photobooth-js/master/css/Photobooth.css"; ';
sOutput += 's.type = "text/css"; s.rel = "stylesheet"; document.head.appendChild(s);},false);\n';
*/
sOutput += 'window.addEventListener("load",function(){var s = document.createElement("style"); s.innerHTML="';
sOutput += sCss + '"; document.head.appendChild(s);},false);\n';

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
