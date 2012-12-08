if( window.jQuery )
{
	$.fn.photobooth = function()
	{
		return this.each(function( i, container ) {
			var oPhotobooth = new Photobooth( container );
			$( container ).data( "photobooth", oPhotobooth );
			oPhotobooth.onImage = function( sDataUrl )
			{
				$( container ).trigger( "image", sDataUrl );
			};
		});
	};
}