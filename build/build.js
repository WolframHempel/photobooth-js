fs = require( "fs" );
var jsp = require("uglify-js").parser;
var pro = require("uglify-js").uglify;
var cleanCSS = require('clean-css');

var sJs = fs.readFileSync( "../js/Photobooth.js", "utf-8" );
var pImports = sJs.match( /\/\/include (.*)/g );

for( var i = 0; i < pImports.length; i++ )
{
	console.log( "including '" + "../js/" + pImports[ i ].substr( 10 ) + "'");
	var sInclude = fs.readFileSync( "../js/" + pImports[ i ].substr( 10 ), "utf-8" );
	sJs = sJs.replace( pImports[ i ], sInclude );
}

var fMinifyJs = function( sJavasScript )
{
	var ast = jsp.parse( sJavasScript ); // parse code and get the initial AST
	ast = pro.ast_mangle(ast); // get a new AST with mangled names
	ast = pro.ast_squeeze(ast); // get an AST with compression optimizations
	return pro.gen_code(ast);
};
/**
* Compress JavaScript
* No idea what an ast is...works fine though :-)
*/
console.log( "Minifying JavaScript");
sJs = fMinifyJs( sJs );
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
sjQuery = fMinifyJs( sjQuery );


var sOutput = "";
sOutput += "/**\n";
sOutput += "*\n";
sOutput += "* Photobooth.js version 0.7\n";
sOutput += "*\n";
sOutput += "* build " + ( new Date() ).toString() + "\n" ;
sOutput += "*\n";
sOutput += "* CSS\n";
sOutput += "*/\n";
sOutput += 'window.addEventListener("load",function(){var s = document.createElement("style"); s.innerHTML="' + sCss + '"; document.head.appendChild(s);},false);\n';
sOutput += "/**\n";
sOutput += "* JS\n";
sOutput += "*/\n";
sOutput += sJs;
sOutput += "\n/**\n";
sOutput += "* jQuery integration. (It's safe to delete this line if you're not using jQuery)\n";
sOutput += "*/\n";
sOutput += sjQuery;


fs.writeFileSync( "../photobooth_min.js", sOutput, "utf-8" );

console.log( "DONE" );