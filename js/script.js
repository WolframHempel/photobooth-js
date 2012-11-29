window.onload = function()
{

	$( '#wrapper' ).photobooth().on( "image", function( event, dataUrl ){
		console.log( arguments );
		$( "body" ).append( '<img src="' + dataUrl + '" />');
	});
	return;
	oPhotobooth = new Photobooth( document.getElementById( "wrapper" ) );
	//oPhotobooth.forceHSB = true;
	//isSupported
	//
	oPhotobooth.onImage = function( sDataUrl )
	{
		var img = document.createElement( "img" );
		img.src = sDataUrl;
		document.body.appendChild( img );
	};
};