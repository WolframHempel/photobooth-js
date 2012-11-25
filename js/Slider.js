var Slider = function( container, fOnChange )
{
	container.innerHTML = '<div class="submenu"><div class="tip"></div><div class="slider"><div class="track"></div><div class="handle" style="left:50px"><div></div></div></div></div>';
	var startX = 0;
	var pos = 50;
	var left = 50;
	var handle = container.getElementsByClassName( "handle" )[0];
	var background = container.getElementsByClassName( "slider" )[0];

	var fOnMouseDown = function( e )
	{
		e.preventDefault();
		startX = e.clientX;
		document.addEventListener( "mousemove", fOnMouseMove, false );
		document.addEventListener( "mouseup", fOnMouseUp, false );
	};

	var fOnMouseMove = function( e )
	{
		fApplyX( pos + ( e.clientX - startX ) );
	};

	var fApplyX = function( x )
	{
		if( x > 0 && x < 100 )
		{
			left = x;
			handle.style.left = x + "px";
			fOnChange( ( x - 50 ) / 100 );
		}
	};

	var fOnMouseUp = function( e )
	{
		pos = left;
		document.removeEventListener( "mousemove", fOnMouseMove );
		document.removeEventListener( "mouseup", fOnMouseUp );
	};


	var fOnBackgroundClick = function( e )
	{
		fApplyX( e.layerX );
		pos = left;
	};

	background.addEventListener( "click", fOnBackgroundClick, false );
	handle.addEventListener( "mousedown", fOnMouseDown, false );
	handle.addEventListener( "click", function(e){e.stopPropagation(); e.cancelBubble=true;}, false );
};