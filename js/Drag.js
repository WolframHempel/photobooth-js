Drag = function( element )
{
	var startX = 0,
		startY = 0,
		scope = this;

	this.onStart = function(){};
	this.onMove = function(){};
	this.onStop = function(){};


	var fOnMouseDown = function( e )
	{
		e.preventDefault();
		startX = e.clientX;
		startY = e.clientY;

		scope.onStart( startX, startY );

		document.addEventListener( "mousemove", fOnMouseMove, false );
		document.addEventListener( "mouseup", fOnMouseUp, false );
	};

	var fOnMouseMove = function( e )
	{
		scope.onMove( e.clientX - startX, e.clientY - startY );
	};

	var fOnMouseUp = function( e )
	{
		scope.onStop( e.clientX - startX, e.clientY - startY );
		document.removeEventListener( "mousemove", fOnMouseMove );
		document.removeEventListener( "mouseup", fOnMouseUp );
	};

	element.addEventListener( "mousedown", fOnMouseDown, false );
};