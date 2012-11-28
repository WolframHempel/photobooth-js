window.onload = function()
{
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