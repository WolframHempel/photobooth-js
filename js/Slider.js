var Slider = function( eContainer, fOnChange )
{
	eContainer.innerHTML = '<div class="submenu"><div class="tip"></div><div class="slider"><div class="track"></div><div class="handle" style="left:50px"><div></div></div></div></div>';

	var pos = 50,
		left = 50,
		eHandle = eContainer.getElementsByClassName( "handle" )[0],
		background = eContainer.getElementsByClassName( "slider" )[0];

	var oHandleDrag = new Drag( eHandle );

	oHandleDrag.onMove = function( x )
	{
		fApplyX( pos + x );
	};

	oHandleDrag.onStop = function( x )
	{
		pos = left;
	};

	var fApplyX = function( x )
	{
		if( x > 0 && x < 100 )
		{
			left = x;
			eHandle.style.left = x + "px";
			fOnChange( ( x - 50 ) / 100 );
		}
	};

	var fOnBackgroundClick = function( e )
	{
		fApplyX( e.layerX );
		pos = left;
	};

	background.addEventListener( "click", fOnBackgroundClick, false );
	eHandle.addEventListener( "click", fCancelBubble, false );
};