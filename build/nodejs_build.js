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

/**
* Compress JavaScript
* No idea what an ast is...works fine though :-)
*/
console.log( "Minifying JavaScript");
var ast = jsp.parse( sJs ); // parse code and get the initial AST
ast = pro.ast_mangle(ast); // get a new AST with mangled names
ast = pro.ast_squeeze(ast); // get an AST with compression optimizations
sJs = pro.gen_code(ast);

/**
* Css
*/
console.log( "Minifying css" );
sCss = cleanCSS.process( fs.readFileSync( "../css/Photobooth.css", "utf-8" ) );

var now = new Date();

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


fs.writeFileSync( "../photobooth_min.js", sOutput, "utf-8" );

console.log( "DONE" );