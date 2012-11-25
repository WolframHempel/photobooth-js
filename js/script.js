window.onload = function()
{
	oPhotobooth = new Photobooth( document.getElementById( "wrapper" ), function( sDataUrl ){ console.log( sDataUrl ); });
};